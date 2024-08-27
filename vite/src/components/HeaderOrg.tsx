import { ethers, JsonRpcSigner } from "ethers";
import { Dispatch, FC, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import ConnectWalletButton from "./ConnectWalletButton";
import logo from "../assets/logo.png";

interface HeaderProps {
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
  provider: ethers.Provider | null;
  setProvider: Dispatch<SetStateAction<ethers.Provider | null>>;
}

const HeaderOrg: FC<HeaderProps> = ({ signer, setSigner, setProvider }) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Loveblocks Logo" className="h-8 w-8" />
          <button
            className="text-xl font-bold text-toss-dark"
            onClick={() => navigate("/")}
          >
            LOVEBLOCKS
          </button>
        </div>
        <nav className="hidden md:flex space-x-4 lg:space-x-8">
          <button
            className="text-toss-gray hover:text-toss-blue"
            onClick={() => navigate("/applyDonatePJ")}
          >
            기부 프로젝트 신청
          </button>
          <button
            className="text-toss-gray hover:text-toss-blue"
            onClick={() => navigate("/sungwoo")}
          >
            대시보드
          </button>
          <button
            className="text-toss-gray hover:text-toss-blue"
            onClick={() => navigate("/organization")}
          >
            마이페이지
          </button>
          <ConnectWalletButton
            signer={signer}
            setSigner={setSigner}
            setProvider={setProvider}
          />
        </nav>
        <div className="md:hidden">
          <ConnectWalletButton
            signer={signer}
            setSigner={setSigner}
            setProvider={setProvider}
          />
        </div>
      </div>
    </header>
  );
};

export default HeaderOrg;
