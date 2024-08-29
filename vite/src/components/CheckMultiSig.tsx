import { Wallet } from "ethers";
import { Contract } from "ethers";
import { JsonRpcSigner } from "ethers";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

interface CheckMultiSigProps {
  signer: JsonRpcSigner;
  adminSigner: Wallet | null;
  setStep: Dispatch<SetStateAction<number>>;
  name: string;
  contract: Contract;
}

const CheckMultiSig: FC<CheckMultiSigProps> = ({
  signer,
  adminSigner,
  setStep,
  name,
  contract,
}) => {
  const [multiSigContract, setMultiSigContract] = useState<Contract>();

  useEffect(() => {
    if (!multiSigContract) return;
    console.log("multiSigAddr ", multiSigContract);
    setStep(3);
  }, [multiSigContract]);

  const onClickCreateMultiSig = async () => {
    const multiSigContract = await contract!.create([signer, adminSigner], 2);
    setMultiSigContract(multiSigContract);
  };

  return (
    <div className="min-h-screen flex items-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6">
        <h1 className="text-xl font-bold mb-4">Review</h1>
        <p className="text-gray-600 mb-6">
          You're about to create a new Safe Account and will have to confirm the
          transaction with your connected wallet.
        </p>

        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-600">Network</p>
              <p className="font-mono">Arbitrum</p>
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-mono">{name}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-600">Signers</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <img
                  src="https://avatars.dicebear.com/api/pixel-art/yhy.svg"
                  alt="Signer 1"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-mono">{name}</p>
                  <p className="text-gray-500">{signer.address}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src="https://avatars.dicebear.com/api/pixel-art/yhy2.svg"
                  alt="Signer 2"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-mono">LoveBlocks Signer</p>
                  <p className="text-gray-500">{adminSigner?.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-gray-600">Threshold</p>
              <p className="font-mono">2 out of 2 signer(s)</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <p className="text-gray-600">Est. network fee</p>
          <p className="font-mono text-green-600">{"< 0.00001 AETH"}</p>
          <p className="text-gray-600 text-sm mt-2">
            You will have to confirm a transaction with your connected wallet.
          </p>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md"
            onClick={() => setStep(1)}
          >
            Back
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={onClickCreateMultiSig}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckMultiSig;
