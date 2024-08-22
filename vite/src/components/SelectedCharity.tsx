import { JsonRpcSigner } from "ethers";
import React, { FC } from "react";
import ReceiveDonation from "./ReceiveDonation";

interface SelectedCharityProps {
  signer: JsonRpcSigner;
  organization: {
    orgAddr: string;
    cid: string;
  };
}

const SelectedCharity: FC<SelectedCharityProps> = ({
  organization,
  signer,
}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative">
            <img
              className="w-full h-64 object-cover"
              src="https://via.placeholder.com/600x400" // Replace with your image URL
              alt="Project"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-white text-xl font-semibold flex items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <span className="text-lg font-bold">yaha</span>
                </div>
                <span className="ml-2">s</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              SH작은도서관 보육원 아동 독서치료 지원 프로젝트
            </h2>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: "5%" }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-sm text-gray-600">
                <span>5%</span>
                <span>14.26$</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {organization.orgAddr === signer.address ? (
        <button>사용 기부금 수령</button>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default SelectedCharity;
