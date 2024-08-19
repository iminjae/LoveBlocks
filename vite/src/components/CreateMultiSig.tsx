import { Wallet } from "ethers";
import { Contract, ethers, JsonRpcSigner } from "ethers";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

interface CreateMultiSigProps {
  signer: JsonRpcSigner;
  adminSigner: Wallet | null;
  setStep: Dispatch<SetStateAction<number>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  contract: Contract;
}

const CreateMultiSig: FC<CreateMultiSigProps> = ({
  signer,
  adminSigner,
  setStep,
  name,
  setName,
}) => {
  return (
    <div className="min-h-screen flex items-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6">
        <h1 className="text-xl font-bold mb-4">Create new Safe Account</h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Signers and confirmations
          </h2>
          <p className="text-gray-600 mb-4">
            Set the signer wallets of your Safe Account and how many need to
            confirm to execute a valid transaction.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Input your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                value={signer.address}
                className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
                disabled
              />
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="LoveBlocks Signer"
                disabled
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                value={adminSigner!.address}
                className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Threshold</h2>
          <p className="text-gray-600 mb-4">
            Any transaction requires the confirmation of:
          </p>

          <div className="flex items-center space-x-2">
            <input
              type="number"
              value="2"
              className="w-12 px-3 py-2 border rounded-md text-center"
              readOnly
            />
            <span className="text-gray-600">out of signer(s)</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="px-4 py-2  rounded-md"></div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => setStep(2)}
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white shadow-lg rounded-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-bold mb-4">Your Safe Account preview</h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600">Wallet</p>
            <p className="font-mono">arbit:0x2A4f...ASC9</p>
          </div>
          <div>
            <p className="text-gray-600">Network</p>
            <p className="font-mono">Arbitrum</p>
          </div>
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-mono">{name}</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-sm font-semibold">Safe Account creation</h3>
          <p className="text-gray-600 text-sm">Network fee</p>
          <p className="text-gray-600 text-sm">Address book privacy</p>
        </div>

        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-sm font-semibold">Safe Account setup</h3>
          <p className="text-gray-600 text-sm">1/1 policy</p>
          <p className="text-gray-600 text-sm">
            Use a threshold higher than one to prevent losing access to your
            Safe Account...
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateMultiSig;
