import { ethers, JsonRpcSigner } from "ethers";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConnectWalletButton from "./ConnectWalletButton";

interface HeaderProps {
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
  provider: ethers.Provider | null;
  setProvider: Dispatch<SetStateAction<ethers.Provider | null>>;
}

const Header: FC<HeaderProps> = ({ signer, setSigner, setProvider }) => {
  const navigate = useNavigate();

  return (
    <div className="container-style h-20 flex justify-between items-center p-10 bg-blue-200">
      <button onClick={() => navigate("/")}>Home</button>

      <button onClick={() => navigate("/donation")}>기부하기</button>

      <button onClick={() => navigate("/applyDonatePJ")}>
        기부 프로젝트 신청
      </button>

      <button onClick={() => navigate("/signup")}>현용</button>

      <button onClick={() => navigate("/sungwoo")}>성우</button>

      <button onClick={() => navigate("/daehwan")}>대환</button>

      <button onClick={() => navigate("/minjae")}>민재</button>

      <ConnectWalletButton
        signer={signer}
        setSigner={setSigner}
        setProvider={setProvider}
      ></ConnectWalletButton>
    </div>
  );
};

export default Header;
