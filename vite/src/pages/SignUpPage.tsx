import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import CreateMultiSig from "../components/CreateMultiSig";
import CheckMultiSig from "../components/CheckMultiSig";
import ReceiveDonation from "../components/ReceiveDonation";
import { Contract, ethers } from "ethers";
import multisigFactoryAbi from "../abis/multisigFactoryAbi.json";
import ResultMultiSig from "../components/ResultMultiSig";

const SignUpPage: FC = () => {
  const { signer, adminSigner } = useOutletContext<OutletContext>();
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [contract, setContract] = useState<Contract>();

  useEffect(() => {
    if (!signer) return;
    const addr = "0xc76666A1db180F311B16C71Af947D5fF4803b4d3"; //multisig CA
    const abi = multisigFactoryAbi;
    const contract = new ethers.Contract(addr, abi, signer);
    setContract(contract);
  }, [signer]);

  return (
    <>
      {signer && contract && (
        <div>
          {step === 1 && (
            <CreateMultiSig
              signer={signer}
              adminSigner={adminSigner}
              setStep={setStep}
              name={name}
              setName={setName}
              contract={contract}
            ></CreateMultiSig>
          )}
          {step === 2 && (
            <CheckMultiSig
              signer={signer}
              adminSigner={adminSigner}
              setStep={setStep}
              name={name}
              contract={contract}
            ></CheckMultiSig>
          )}
          {step === 3 && (
            <ResultMultiSig
              signer={signer}
              contract={contract}
            ></ResultMultiSig>
          )}
          <ReceiveDonation
            signer={signer}
            contract={contract}
            adminSigner={adminSigner}
          ></ReceiveDonation>
        </div>
      )}
    </>
  );
};

export default SignUpPage;
