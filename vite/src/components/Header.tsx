import { ethers, JsonRpcSigner } from "ethers";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
}

const Header: FC<HeaderProps> = ({ signer, setSigner}) => {
    const navigate = useNavigate();


    const getSigner = async () => {
      if (!window.ethereum) return;
  
      const provider = new ethers.BrowserProvider(window.ethereum);
  
      setSigner(await provider.getSigner());
    };
  
    const onClickMetamask = async () => {
      try {
        getSigner();
  
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
    
    return (

        <div className="container-style h-20 flex justify-between items-center p-10 bg-blue-200">
            <button
              onClick={() => navigate("/hyeonyong")}
            >
                현용
            </button>

            <button
              onClick={() => navigate("/seongwoo")}
            >
                성우
            </button>

            <button
              onClick={() => navigate("/daehwan")}
            >
                대환
            </button>

            <button
              onClick={() => navigate("/minjae")}
            >
                민재
            </button>
            {
  localStorage.getItem("addr") ? (
    <button onClick={onClickLogout}>
      {localStorage.getItem("addr")?.substring(0, 5)}...
      {localStorage.getItem("addr")?.substring(15, 20)}
    </button>
  ) : (
    signer ? (
      <button onClick={onClickLogout}>
        {signer.address.substring(0, 5)}...
        {signer.address.substring(15, 20)}
      </button>
    ) : (
      <button onClick={onClickMetamask}>Connect Wallet</button>
    )
  )
}

        </div>
    );
};

export default Header;