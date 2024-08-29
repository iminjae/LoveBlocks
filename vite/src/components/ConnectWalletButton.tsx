import { JsonRpcSigner } from "ethers";
import { ethers } from "ethers";
import React, { Dispatch, FC, SetStateAction, useEffect } from "react";

interface ConnectWalletButtonProps {
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
  setProvider: Dispatch<SetStateAction<ethers.Provider | null>>;
}

const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
  signer,
  setSigner,
  setProvider,
}) => {
  const getSigner = async () => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    setSigner(await provider.getSigner());
  };

  useEffect(() => {
    const localIsLogin = localStorage.getItem("isLogin");
    if (localIsLogin === "true") {
      getSigner();
    }
  }, []);

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
    <>
      {localStorage.getItem("addr") ? (
        <button onClick={onClickLogout} className="text-toss-gray hover:text-toss-blue">
          {localStorage.getItem("addr")?.substring(0, 5)}...
          {localStorage.getItem("addr")?.substring(15, 20)}
        </button>
      ) : signer ? (
        <button onClick={onClickLogout} className="text-toss-gray hover:text-toss-blue">
          {signer.address.substring(0, 5)}...
          {signer.address.substring(15, 20)}
        </button>
      ) : (
        <button onClick={onClickMetamask} className="text-toss-gray hover:text-toss-blue">Connect Wallet</button>
      )}
    </>
  );
};

export default ConnectWalletButton;
