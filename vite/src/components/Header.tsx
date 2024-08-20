import { ethers, JsonRpcSigner } from "ethers";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
  provider: ethers.Provider | null;
  setProvider: Dispatch<SetStateAction<ethers.Provider | null>>;
}

const Header: FC<HeaderProps> = ({ signer, setSigner, setProvider }) => {
  const navigate = useNavigate();

  const getSigner = async () => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    setSigner(await provider.getSigner());
  };

  const onClickMetamask = async () => {
    try {
      getSigner();
      switchToArbitrum();
      
      localStorage.setItem("isLogin", "true");
    } catch (error) {
      console.error(error);
    }
  };

  const onClickLogout = () => {
    setSigner(null);

    localStorage.removeItem("isLogin");
    localStorage.removeItem("addr");
  };

  useEffect(() => {
    const localIsLogin = localStorage.getItem("isLogin");
    if (localIsLogin === "true") {
      getSigner();
    }
  }, []);

  const switchToArbitrum = async () => {
    if (!window.ethereum) return;

    const chainId = "0xa4b1"; //Arbitrum 체인ID

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (error) {
      const switchError = error as { code: number; message: string };
      //metamask 상에서 체인이 없을 때 에러 처리
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId,
                chainName: "Arbitrum One",
                rpcUrls: ["https://arb1.arbitrum.io/rpc"],
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://arbiscan.io"],
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      } else {
        console.error(switchError);
      }
    }
  };

  return (
    <div className="container-style h-20 flex justify-between items-center p-10 bg-blue-200">
      <button onClick={() => navigate("/")}>Home</button>

      <button onClick={() => navigate("/signup")}>현용</button>

      <button onClick={() => navigate("/sungwoo")}>성우</button>

      <button onClick={() => navigate("/daehwan")}>대환</button>

      <button onClick={() => navigate("/minjae")}>민재</button>

      {localStorage.getItem("addr") ? (
        <button onClick={onClickLogout}>
          {localStorage.getItem("addr")?.substring(0, 5)}...
          {localStorage.getItem("addr")?.substring(15, 20)}
        </button>
      ) : signer ? (
        <button onClick={onClickLogout}>
          {signer.address.substring(0, 5)}...
          {signer.address.substring(15, 20)}
        </button>
      ) : (
        <button onClick={onClickMetamask}>Connect Wallet</button>
      )}
    </div>
  );
};

export default Header;
