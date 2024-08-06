import { FC, useState, useEffect } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Test: FC = () => {
  const [usdtPrice, setUsdtPrice] = useState<string>("");

  // Sepolia 테스트넷의 USDT/USD Price Feed 주소
  const contractAddress = "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E";

  // Chainlink Price Feed ABI
  const contractABI = [
    {
      inputs: [],
      name: "latestRoundData",
      outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  useEffect(() => {
    const fetchUSDTPrice = async () => {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );

          const data = await contract.latestRoundData();
          const price = ethers.formatUnits(data.answer, 8); // Chainlink uses 8 decimals for USD price feeds
          setUsdtPrice(price);
        } catch (error) {
          console.error("Error fetching USDT price:", error);
        }
      } else {
        console.log("Please install MetaMask!");
      }
    };

    fetchUSDTPrice();
  }, []);

  return (
    <div>
      <h1>USDT Price</h1>
      {usdtPrice ? (
        <p>Current USDT Price: ${parseFloat(usdtPrice).toFixed(2)}</p>
      ) : (
        <p>Loading USDT Price...</p>
      )}
    </div>
  );
};

export default Test;
