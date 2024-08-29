import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ClovaOCR from "./ClovaOCR";
import { Contract, JsonRpcSigner, Wallet } from "ethers";
import ReceiveDonation from "./ReceiveDonation";

interface OrganizationMypageCompProps {
  projectInfo: string[];
  signer: JsonRpcSigner | null;
  adminSigner: Wallet | null;
  contract: Contract | null;
}

interface OrgData {
  organizationName: string;
  title: string;
  content: string;
  image: string;
}

interface ReceiptData {
  totalPrice: string;
  itemsData: {
    name: string;
    count: string;
    price: string;
  }[];
}

<motion.div animate={{ scale: 0.5 }} />;

const extractReceiptData = async (file: File) => {
  return {
    date: "2024-08-25",
    items: [
      { name: "Item A", quantity: 1, amount: "$50" },
      { name: "Item B", quantity: 2, amount: "$100" },
    ],
  };
};

const simulateLoading = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const OrganizationMypageComp: React.FC<OrganizationMypageCompProps> = ({
  projectInfo,
  signer,
  contract,
  adminSigner,
}) => {
  const [usageHistory, setUsageHistory] = useState([
    {
      date: "2024-08-23",
      items: [{ name: "라면", quantity: 100, amount: "$100" }],
    },
  ]);
  const [totalDonations, setTotalDonations] = useState(67.54);
  const [withdrawnAmount, setWithdrawnAmount] = useState(29.59);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean[]>([]);
  const [isReceived, setIsReceived] = useState<boolean[]>([]);
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);

  const [receipt, setReceipt] = useState<ReceiptData[]>([]);

  const [data, setData] = useState<OrgData>();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const receiptData = await extractReceiptData(file);
      setUsageHistory((prevHistory) => [
        ...prevHistory,
        {
          date: receiptData.date,
          items: receiptData.items,
        },
      ]);
    }
  };

  const handleWithdraw = async (amount: number, index: number) => {
    setGlobalLoading(true);
    setIsLoading((prev) => {
      const newLoadingState = [...prev];
      newLoadingState[index] = true;
      return newLoadingState;
    });

    await simulateLoading(2000);

    setWithdrawnAmount((prev) => prev + amount);
    setIsReceived((prev) => {
      const newReceivedState = [...prev];
      newReceivedState[index] = true;
      return newReceivedState;
    });

    setIsLoading((prev) => {
      const newLoadingState = [...prev];
      newLoadingState[index] = false;
      return newLoadingState;
    });

    setSelectedIndexes((prev) => prev.filter((i) => i !== index));
    setGlobalLoading(false);
  };

  const remainingAmount = totalDonations - withdrawnAmount;

  const toggleContentVisibility = () => {
    setIsContentVisible((prev) => !prev);
  };

  const getUrl = async () => {
    try {
      const response = await fetch(
        `https://gateway.pinata.cloud/ipfs/${projectInfo[1]}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch JSON from IPFS");
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching JSON from IPFS:", error);
      return null;
    }
  };

  useEffect(() => {
    getUrl();
  }, []);

  useEffect(() => {
    if (receipt.length === 0) return;
    console.log("receipt", receipt);
  }, [receipt]);

  const addReceiptData = (newData: ReceiptData) => {
    setReceipt((prevReceipt) => [...prevReceipt, newData]);
  };

  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const toggleExpand = (index: number) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center relative">
      {globalLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="text-center text-white">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
            <p>지갑으로 USDT 수령 중...</p>
          </div>
        </div>
      )}
      <div
        className={`font-sans text-gray-900 max-w-4xl w-full ${
          globalLoading ? "opacity-50" : ""
        }`}
      >
        {/* Title and Buttons */}
        <h1 className="text-center text-4xl font-semibold mb-4">
          나의 프로젝트 현황
        </h1>
        <h1 className="text-center text-4xl font-semibold mb-4">
          지금 확인해보세요
        </h1>

        {/* Buttons */}
        <div className="flex flex-col items-center">
          <button
            className="w-20 py-3 text-sm bg-blue-500 text-white rounded-lg font-semibold mb-4 hover:bg-blue-600"
            onClick={toggleContentVisibility}
          >
            {isContentVisible ? "접기" : "확인하기"}
          </button>

          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
        </div>

        {/* Conditional Content */}
        {isContentVisible && (
          <>
            {/* Box 1: Image and Progress Bar */}
            <div className="mb-6 rounded-lg overflow-hidden shadow-sm">
              <img
                src={`${data!.image}`}
                alt="Project"
                className="w-full object-cover"
              />
              <div className="mt-4">
                <div className="w-full bg-gray-200 h-3 rounded-full">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: "50%" }}
                  ></div>
                </div>
                <p className="text-gray-600 text-sm text-l mt-2">
                  프로젝트 모금 기간 : 29일 (2024.08.01 - 2024.08.29)
                </p>
              </div>
            </div>

            {/* Box 2: Donation Summary */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
              <motion.div
                className="p-6 bg-white rounded-lg text-center shadow-md"
                whileHover={{
                  x: [0, -5, 5, -5, 5, 0], // Vibrate left and right
                  transition: { duration: 0.5 }, // Duration of the vibration effect
                }}
              >
                <h2 className="text-sm font-medium text-gray-600">
                  기부금 총액
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                  ${totalDonations}
                </p>
              </motion.div>
              <motion.div
                className="p-6 bg-white rounded-lg text-center shadow-md"
                whileHover={{
                  x: [0, -5, 5, -5, 5, 0], // Vibrate left and right
                  transition: { duration: 0.5 }, // Duration of the vibration effect
                }}
              >
                <h2 className="text-sm font-medium text-gray-600">
                  수령한 기부금액
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                  ${withdrawnAmount}
                </p>
              </motion.div>

              <motion.div
                className="p-6 bg-white rounded-lg text-center shadow-md"
                whileHover={{
                  x: [0, -5, 5, -5, 5, 0], // Vibrate left and right
                  transition: { duration: 0.5 }, // Duration of the vibration effect
                }}
              >
                <h2 className="text-sm font-medium text-gray-600">
                  잔여 기부금
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                  ${remainingAmount}
                </p>
              </motion.div>
            </div>

            {/* Box 3: Usage History */}

            <div className="mb-6 p-6 mt-20 bg-white rounded-lg shadow-md">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  기부금 사용 내역
                </h2>
                <ClovaOCR
                  signer={signer}
                  addReceiptData={addReceiptData}
                ></ClovaOCR>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
                      <th className="p-3">총 금액</th>
                      <th className="p-3">구매 물품 수</th>
                      <th className="p-3">상세보기</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {receipt.map((entry, entryIndex) => {
                      const isExpanded = expandedIndexes.includes(entryIndex);
                      return (
                        <React.Fragment key={entryIndex}>
                          <tr
                            className="border-b last:border-none cursor-pointer"
                            onClick={() => toggleExpand(entryIndex)}
                          >
                            <td className="p-3">{entry.totalPrice} 원</td>
                            <td className="p-3">{entry.itemsData.length} 개</td>
                            <td className="p-3 text-blue-500 underline">
                              {isExpanded ? "접기" : "펼치기"}
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-gray-50">
                              <td colSpan={3}>
                                <table className="w-full bg-white rounded-lg mt-2">
                                  <tbody className="text-gray-600 text-sm">
                                    {entry.itemsData.map((item, itemIndex) => (
                                      <tr
                                        key={itemIndex}
                                        className="border-b last:border-none"
                                      >
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3">{item.count}</td>
                                        <td className="p-3">{item.price} 원</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>

              </div>
                <ReceiveDonation
              signer={signer}
              adminSigner={adminSigner}
              contract={contract!}
            ></ReceiveDonation>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrganizationMypageComp;
