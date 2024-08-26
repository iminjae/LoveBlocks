import React, { useState } from "react";

// Mock function to simulate receipt data extraction
const extractReceiptData = async (file: File) => {
  return {
    date: "2024-08-25",
    items: [
      { name: "Item A", quantity: 1, amount: "$50" },
      { name: "Item B", quantity: 2, amount: "$100" },
    ],
  };
};

// Mock function to simulate a delay for loading
const simulateLoading = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const OrganizationMypage: React.FC = () => {
  const [usageHistory, setUsageHistory] = useState([
    {
      date: "2024-08-23",
      items: [{ name: "Donation to Charity X", quantity: 1, amount: "$100" }],
    },
  ]);
  const [totalDonations, setTotalDonations] = useState(500);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean[]>([]);
  const [isReceived, setIsReceived] = useState<boolean[]>([]);
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);

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

  const handleCheckboxChange = (index: number) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
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

  return (
    <div className="bg-toss-light min-h-screen flex justify-center items-center relative">
      {globalLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="text-center text-white">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
            <p>지갑으로 USDT 수령중...</p>
          </div>
        </div>
      )}
      <div
        className={`p-5 font-sans text-gray-800 bg-white rounded-xl max-w-3xl w-full shadow-lg ${
          globalLoading ? "opacity-50" : ""
        }`}
      >
        <h1 className="text-center text-black-700 mb-4"> 기부 단체 페이지 </h1>
        <div className="mb-4">
          <div>
            <img
              src="https://via.placeholder.com/150"
              alt="Project"
              className="w-full rounded-md mb-2"
            />
            <div className="mb-2">
              <label className="block text-blue-700 mb-1">Progress: 50%</label>
              <div className="w-full bg-blue-200 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
            </div>
            <p className="text-blue-700 text-sm">
              해당 프로젝트는 XX양로원을 위해 2024년 8월 1일 ~ 2024년 8월
              31일까지 모금되었습니다.
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div className="p-4 bg-toss-light rounded-xl text-center w-full shadow-black shadow-sm hover:animate-wiggle">
            <h2 className="text-black-700">기부금 총액</h2>
            <p className="text-black-900 text-2xl font-bold">
              ${totalDonations}
            </p>
          </div>
          <div className="p-4 bg-toss-light rounded-xl text-center w-full shadow-black shadow-sm hover:animate-wiggle">
            <h2 className="text-black-700">찾아간 기부금액</h2>
            <p className="text-black-900 text-2xl font-bold">
              ${withdrawnAmount}
            </p>
          </div>
          <div className="p-4 bg-toss-light rounded-xl text-center w-full shadow-black shadow-sm hover:animate-wiggle">
            <h2 className="text-black-700">기부금 잔여금액</h2>
            <p className="text-black-900 text-2xl font-bold">
              ${remainingAmount}
            </p>
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-black-700 mb-2 text-xl mt-20">사용 내역</h2>
          <table className="w-full bg-white rounded-xl overflow-hidden shadow-md">
            <thead>
              <tr className="bg-blue-100 text-black-700">
                <th className="p-2">날짜</th>
                <th className="p-2">아이템</th>
                <th className="p-2">양/개수</th>
                <th className="p-2">금액</th>
                <th className="p-2">선택</th>
                <th className="p-2">수령</th>
              </tr>
            </thead>
            <tbody>
              {usageHistory.map((entry, entryIndex) =>
                entry.items.map((item, itemIndex) => {
                  const index = entryIndex * 10 + itemIndex;
                  const isSelected = selectedIndexes.includes(index);
                  const loading = isLoading[index];
                  const received = isReceived[index];

                  return (
                    <tr key={`${entryIndex}-${itemIndex}`}>
                      <td className="p-2 border">{entry.date}</td>
                      <td className="p-2 border">{item.name}</td>
                      <td className="p-2 border">{item.quantity}</td>
                      <td className="p-2 border">{item.amount}</td>
                      <td className="p-2 border text-center">
                        <input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(index)}
                          checked={isSelected}
                          disabled={received || globalLoading}
                        />
                      </td>
                      <td className="p-2 border text-center">
                        <button
                          className={`px-4 py-2 rounded ${
                            isSelected && !received
                              ? "bg-blue-500 text-white cursor-pointer"
                              : "bg-gray-300 text-gray-600 cursor-not-allowed"
                          } ${loading ? "opacity-50" : ""}`}
                          disabled={
                            !isSelected || loading || received || globalLoading
                          }
                          onClick={() =>
                            handleWithdraw(
                              parseFloat(item.amount.slice(1)),
                              index
                            )
                          }
                        >
                          {loading
                            ? "로딩 중..."
                            : received
                            ? "수령 완료"
                            : "수령하기"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <input type="file" onChange={handleUpload} className="mt-4 w-full" />
        </div>
      </div>
    </div>
  );
};

export default OrganizationMypage;
