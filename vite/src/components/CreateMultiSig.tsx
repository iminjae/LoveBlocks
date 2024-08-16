import { Contract, ethers, JsonRpcSigner } from "ethers";
import { FC, useEffect, useState } from "react";

interface CreateMultiSigProps {
  signer: JsonRpcSigner;
}

const CreateMultiSig: FC<CreateMultiSigProps> = ({ signer }) => {
  const [contract, setContract] = useState<Contract>();

  useEffect(() => {
    if (!signer) return;
    //0xa0f05A6b7Bc76eF10AB2eF4D5C9c94Ca84335ffd -> 
    const addr = "0xb9684C81030dE826b2F67E5B32a8F98BA14f47cd";
    const abi = [
      "function submitTransaction(address destination, uint value, bytes data) returns (uint transactionId)",
      "function executeTransaction(uint transactionId)",
    ];

    const contract = new ethers.Contract(addr, abi);
    setContract(contract);
  }, [signer]);

  useEffect(() => {
    console.log(contract)
  }, [contract])
  
  const submitTx = async () => {
    await contract!.submitTransaction("0x98303f589155D2f87A9e1D561ed1E2D26F1C57c5",0,)
  }

  return (
    <div>
      <div>
        <input type="text" />
        <div>{signer.address}</div>
      </div>
      <button onClick={submitTx}>Button</button>
    </div>
  );
};

export default CreateMultiSig;
