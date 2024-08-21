import { FC, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import CreateMultiSig from "../components/CreateMultiSig";
import CheckMultiSig from "../components/CheckMultiSig";
import ReceiveDonation from "../components/ReceiveDonation";
import { Contract, ethers } from "ethers";
import multisigFactoryAbi from "../abis/multisigFactoryAbi.json";
import ResultMultiSig from "../components/ResultMultiSig";
import ConnectWalletButton from "../components/ConnectWalletButton";

const SignUpPage: FC = () => {
  const navigate = useNavigate();

  const { signer, adminSigner, setSigner, setProvider } =
    useOutletContext<OutletContext>();
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [contract, setContract] = useState<Contract>();
  const [multiSigCA, setMultiSigCA] = useState<Contract>();

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
    <>
      {!signer && (
        <ConnectWalletButton
          signer={signer}
          setSigner={setSigner}
          setProvider={setProvider}
        ></ConnectWalletButton>
      )}
      {signer && multiSigCA && (
        <div>
          <div>MultiSig Address: {multiSigCA}</div>
          <button onClick={() => navigate("/applyDonatePJ")}>
            기부 프로젝트 등록
          </button>
        </div>
      )}
      {signer && !multiSigCA && (
        <div>
          {step === 1 && (
            <CreateMultiSig
              signer={signer}
              adminSigner={adminSigner}
              setStep={setStep}
              name={name}
              setName={setName}
              contract={contract!}
            ></CreateMultiSig>
          )}
          {step === 2 && (
            <CheckMultiSig
              signer={signer}
              adminSigner={adminSigner}
              setStep={setStep}
              name={name}
              contract={contract!}
            ></CheckMultiSig>
          )}
          {step === 3 && (
            <ResultMultiSig
              signer={signer}
              multiSigCA={multiSigCA!}
            ></ResultMultiSig>
          )}
          <ReceiveDonation
            signer={signer}
            contract={contract!}
            adminSigner={adminSigner}
          ></ReceiveDonation>
        </div>
      )}
    </>
  );
};

export default SignUpPage;
