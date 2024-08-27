import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Contract, ethers, JsonRpcSigner } from "ethers";
import { Wallet } from "ethers";
import Footer from "./Footer";
import multisigFactoryAbi from "../abis/multisigFactoryAbi.json";
import HeaderOrg from "./HeaderOrg";

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
  const [contract, setContract] = useState<Contract>();
  const [multiSigCA, setMultiSigCA] = useState<Contract>();

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

  useEffect(() => {
    if (!signer) return;
    const addr = "0xc76666A1db180F311B16C71Af947D5fF4803b4d3"; //multisig Factory Contract Address
    const abi = multisigFactoryAbi;
    const contract = new ethers.Contract(addr, abi, signer); // multisig Factory contract
    setContract(contract);
  }, [signer]);

  useEffect(() => {
    if (!contract) return;
    getInstantiation();
  }, [contract]);

  const getInstantiation = async () => {
    console.log(signer!.address);
    const multiSigCA = await contract!.instantiations(signer!.address, 0);
    setMultiSigCA(multiSigCA);
    console.log("multiSigCA", multiSigCA);
  };

  return (
    <div>
      {!multiSigCA ? (
        <Header
          signer={signer}
          setSigner={setSigner}
          provider={provider}
          setProvider={setProvider}
        />
      ) : (
        <HeaderOrg
          signer={signer}
          setSigner={setSigner}
          provider={provider}
          setProvider={setProvider}
        />
      )}

      <div style={{ paddingTop: "60px" }}>
        <Outlet context={{ signer, adminSigner, setProvider, setSigner }} />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
