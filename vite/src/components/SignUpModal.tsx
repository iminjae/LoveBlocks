import { Contract, JsonRpcSigner, Wallet } from "ethers";
import React, { Dispatch, FC, SetStateAction } from "react";

interface SafeAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  signer: JsonRpcSigner;
  adminSigner: Wallet | null;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  contract: Contract;
}

const SignUpModal: FC<SafeAccountModalProps> = ({
  isOpen,
  onClose,
  signer,
  adminSigner,
  name,
  setName,
  contract,
}) => {
  if (!isOpen) return null;

  const onClickCreateMultiSig = async () => {
    await contract!.create([signer, adminSigner], 2);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-8 transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex items-center text-xl font-extrabold text-gray-900">
            기업 회원가입
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-all duration-300 ease-in-out"
          >
            &times;
          </button>
        </div>

        <div className="flex space-x-8">
          {/* Left section: Form */}
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                가입 정보를 입력해주세요
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                회원가입 후 사용하게 될 지갑 이름입니다. <br></br>연결된 지갑
                주소를 확인해주세요.
              </p>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    지갑명
                  </label>
                  <input
                    type="text"
                    className="block w-full border-gray-300 rounded-lg shadow-sm p-3"
                    placeholder="ex) 초록우산"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    지갑 주소
                  </label>
                  <input
                    type="text"
                    className="block w-full border-gray-300 rounded-lg shadow-sm p-3"
                    value={signer.address}
                    disabled
                  />
                </div>
                <div className="bg-blue-50 p-5 mt-2 rounded-lg shadow-sm">
                  <p className="text-blue-800 text-sm font-semibold">
                    가입 정보를 다시 한번 확인하세요!
                  </p>
                  <p className="text-blue-700 text-xs mt-1">
                    기부 프로젝트 선정 후, 기부금 수령 시 USDT가 전달되는 지갑
                    주소입니다. 본인 단체의 지갑 주소가 맞는지 확인하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="border-l border-gray-300"></div>

          {/* Right section: Account Preview and Blue Box */}
          <div className="flex-1 max-w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Your Account preview
              </h3>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">
                    Wallet:
                  </span>
                  <span className="text-gray-900 truncate">
                    {signer.address}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">
                    Network:
                  </span>
                  <span className="text-gray-900">Arbitrum</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">Name:</span>
                  <span className="text-gray-900">{name}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                LoveBlock's Account preview
              </h3>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">
                    Wallet:
                  </span>
                  <span className="text-gray-900 truncate">
                    {adminSigner?.address}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">
                    Network:
                  </span>
                  <span className="text-gray-900">Arbitrum</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">Name:</span>
                  <span className="text-gray-900">Love Blocks</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition-all duration-300 ease-in-out"
          >
            취소
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 ease-in-out"
            onClick={onClickCreateMultiSig}
          >
            가입하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
