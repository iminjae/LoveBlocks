import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { ethers, JsonRpcSigner } from "ethers";
// import Footer from "./Footer";

export interface OutletContext {
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
  provider: ethers.Provider | null;
  setProvider: Dispatch<SetStateAction<ethers.Provider | null>>;
}

const Layout: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);

  useEffect(() => {
    if(!signer) return;
    localStorage.setItem("addr",signer.address);
  }, [signer])


  return (
    <div>
      <Header signer={signer} setSigner={setSigner} provider={provider} setProvider={setProvider}/>
      <div>
        <Outlet context={{ signer }} />
      </div>
      {/* <Footer />  */}
    </div>
  );
};

export default Layout;