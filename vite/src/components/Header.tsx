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

    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <button className="text-xl font-bold text-toss-dark" onClick={() => navigate("/")}>LOVEBLOCKS</button>
          <nav className="space-x-8">
            <button  className="text-toss-gray hover:text-toss-blue" onClick={() => navigate("/donation")}>기부하기</button>
            <button  className="text-toss-gray hover:text-toss-blue" onClick={() => navigate("/applyDonatePJ")}>기부 프로젝트 신청</button>
            <button  className="text-toss-gray hover:text-toss-blue" onClick={() => navigate("/signup")}>현용</button>
            <button  className="text-toss-gray hover:text-toss-blue" onClick={() => navigate("/sungwoo")}>성우</button>
            <button  className="text-toss-gray hover:text-toss-blue" onClick={() => navigate("/daehwan")}>대환</button>
            <button  className="text-toss-gray hover:text-toss-blue" onClick={() => navigate("/minjae")}>민재</button>
            {localStorage.getItem("addr") ? (
              <button className="text-toss-gray hover:text-toss-blue" onClick={onClickLogout}>
                {localStorage.getItem("addr")?.substring(0, 5)}...
                {localStorage.getItem("addr")?.substring(15, 20)}
              </button>
            ) : signer ? (
              <button className="text-toss-gray hover:text-toss-blue" onClick={onClickLogout}>
                {signer.address.substring(0, 5)}...
                {signer.address.substring(15, 20)}
              </button>
            ) : (
              <button onClick={onClickMetamask}>Connect Wallet</button>
            )}


          </nav>
        </div>
      </header>



   
  );
};

export default Header;
