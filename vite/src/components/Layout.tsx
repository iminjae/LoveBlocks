import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { JsonRpcSigner } from "ethers";
// import Footer from "./Footer";

export interface OutletContext {
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
}

const Layout: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  useEffect(() => {
    if(!signer) return;
    localStorage.setItem("addr",signer.address);
  }, [signer])


  return (
    <div>
      <Header signer={signer} setSigner={setSigner}/>
      <div>
        <Outlet context={{ signer, setSigner }} />
      </div>
      {/* <Footer />  */}
    </div>
  );
};

export default Layout;