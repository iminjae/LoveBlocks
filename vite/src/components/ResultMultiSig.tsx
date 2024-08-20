import { Contract } from "ethers";
import { JsonRpcSigner } from "ethers";
import { FC, useEffect, useState } from "react";

interface ResultMultiSigProps {
  signer: JsonRpcSigner | null;
  contract: Contract;
}

const ResultMultiSig: FC<ResultMultiSigProps> = ({ signer, contract }) => {
  const [multiSigAddr, setMultiSigAddr] = useState<string>();
  useEffect(() => {
    if (!signer) return;
    getMultiSigAddr();
  }, [signer]);

  useEffect(() => {
    if (!multiSigAddr) return;
    console.log("multiSigAddr ", multiSigAddr);
  }, [multiSigAddr]);

  const getMultiSigAddr = async () => {
    const addr = await contract.instantiations(signer?.address, 0);
    setMultiSigAddr(addr);
  };

  return <div>Multsig addr : {multiSigAddr}</div>;
};

export default ResultMultiSig;
