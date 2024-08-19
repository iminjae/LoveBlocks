import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { ethers, JsonRpcSigner } from "ethers";
import { Wallet } from "ethers";
// import Footer from "./Footer";

export interface OutletContext {
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
  provider: ethers.Provider | null;
  setProvider: Dispatch<SetStateAction<ethers.Provider | null>>;
  adminSigner: Wallet | null;
}

const Layout: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [adminSigner, setAdminSigner] = useState<Wallet | null>(null);

  const setAdmin = async () => {
    const provider = new ethers.JsonRpcProvider(
      "https://arbitrum-mainnet.infura.io/v3/4120a176f57d44b79a5f54b1b9cfc9fb"
    );
    const wallet = new ethers.Wallet(
      `${import.meta.env.VITE_SIG_WALLET_PRIVATE_KEY}`,
      provider
    );
    setAdminSigner(wallet);
  };

  useEffect(() => {
    if (!signer) return;
    localStorage.setItem("addr", signer.address);
    setAdmin();
  }, [signer]);

  return (
    <div>
      <Header
        signer={signer}
        setSigner={setSigner}
        provider={provider}
        setProvider={setProvider}
      />
      <div>
        <Outlet context={{ signer, adminSigner }} />
      </div>
      {/* <Footer />  */}
    </div>
  );
};

export default Layout;
