import { FC, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import SignatureButton from "../components/SignatureButton";
import { OutletContext } from "../components/Layout";
import silverCard from "../assets/silverCard.jpg";
import commonCard from "../assets/common.jpeg";
import { ethers } from "ethers";
import { format, differenceInDays } from "date-fns";
import "../styles/TokenCardAnimation.css";

interface HoldToken {
  tokenAddress: string;
  amount: bigint;
  name: string;
  symbol: string;
  decimal: bigint;
  image: string;
}

const DonationPage: FC = () => {
  const { signer, adminSigner } = useOutletContext<OutletContext>();
  const location = useLocation();
  const { holdTokens } = location.state || { holdTokens: [] };
  const [selectedTokens, setSelectedTokens] = useState<HoldToken[]>([]);

  const donationInfo = {
    title: "기부 제목",
    organizationName: "기부 단체 이름",
    description:
      "이 글은 기부의 목적과 기부금의 사용처에 대한 내용을 담고 있습니다. 기부해주신 분들께 깊이 감사드립니다.",
    totalAmount: "100 ETH", // 예시 모금액
    totalDonors: 50, // 예시 기부자 수
    startDate: new Date(2024, 7, 1), // 기부 시작일 (예시 날짜)
    endDate: new Date(2024, 8, 30), // 기부 종료일 (예시 날짜)
  };

  const today = new Date();
  const dDay = differenceInDays(donationInfo.endDate, today);
  const formattedStartDate = format(donationInfo.startDate, "yyyy-MM-dd");
  const formattedEndDate = format(donationInfo.endDate, "yyyy-MM-dd");

  const toggleTokenSelection = (token: HoldToken) => {
    setSelectedTokens((prevSelectedTokens) => {
      const isSelected = prevSelectedTokens.some(
        (selectedToken) => selectedToken.tokenAddress === token.tokenAddress
      );
      if (isSelected) {
        return prevSelectedTokens.filter(
          (selectedToken) => selectedToken.tokenAddress !== token.tokenAddress
        );
      } else {
        return [...prevSelectedTokens, token];
      }
    });
  };

  const totalSelectedAmount = selectedTokens.reduce(
    (total, token) => total + parseFloat(ethers.formatUnits(token.amount, token.decimal)),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-grow">
        <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 shadow-md rounded-lg mt-10 mx-4">
          <div className="max-w-7xl mx-auto">
            {/* 기부 단체 설명 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center">
              {/* 좌측 이미지 */}
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={commonCard}
                  alt="Donation Organization"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 우측 설명 */}
              <div className="flex flex-col justify-center text-left space-y-4">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  {donationInfo.title}
                </h2>
                <h3 className="text-xl text-gray-700">
                  {donationInfo.organizationName}
                </h3>
                <div className="text-gray-600 leading-relaxed max-h-40 overflow-y-auto pr-2">
                  {donationInfo.description}
                </div>
                <div className="text-gray-800 font-medium space-y-1">
                  <p>
                    모금액: <span className="font-bold text-gray-900">{donationInfo.totalAmount}</span>
                  </p>
                  <p>
                    기부자 수: <span className="font-bold text-gray-900">{donationInfo.totalDonors}명</span>
                  </p>
                  <p>
                    기부 기간:{" "}
                    <span className="font-bold text-gray-900">
                      {formattedStartDate} ~ {formattedEndDate}
                    </span>
                  </p>
                  <p>
                    D-Day:{" "}
                    <span className="font-bold text-red-500">
                      {dDay >= 0 ? `D-${dDay}` : "종료됨"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* 토큰 목록 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-60">
              {holdTokens.length > 0 ? (
                holdTokens.map((token: HoldToken) => (
                  <div
                    key={token.tokenAddress}
                    className={`p-6 rounded-lg shadow-md text-center cursor-pointer transition-transform transform hover:scale-105 ${
                      selectedTokens.some(
                        (selectedToken) =>
                          selectedToken.tokenAddress === token.tokenAddress
                      )
                        ? "selected-token-card"
                        : "border border-gray-200"
                    }`}
                    style={{
                      backgroundImage: `url(${silverCard})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundBlendMode: "overlay",
                    }}
                    onClick={() => toggleTokenSelection(token)}
                  >
                    <img
                      src={token.image}
                      alt={token.name}
                      className="w-16 h-16 mx-auto rounded-full"
                    />
                    <h3 className="text-xl font-bold mt-4 text-gray-800">
                      {token.name}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      잔액: {ethers.formatUnits(token.amount, token.decimal)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="mt-4 text-lg text-center text-gray-600">
                  보유한 토큰이 없습니다.
                </p>
              )}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg py-4 px-6 flex justify-between items-center space-x-4 border-t border-gray-200">
            {/* 왼쪽: 그래프 */}
            <div className="w-2/5 flex justify-center items-center h-60">
              {/* 명함 크기의 그래프 자리 */}
              <div className="w-full h-full bg-gray-100 flex justify-center items-center">
                  NFT 넣을거
              </div>
            </div>

            {/* 오른쪽: 선택된 토큰들 및 총량/버튼 */}
            <div className="w-3/5 flex flex-col justify-between h-60 overflow-hidden">
              <div className="flex flex-wrap items-center space-x-2 overflow-x-auto">
                {selectedTokens.map((token) => (
                  <div
                    key={token.tokenAddress}
                    className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 shadow-sm"
                  >
                    <img
                      src={token.image}
                      className="w-8 h-8 rounded-full"
                      alt={token.name}
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {token.name}: {ethers.formatUnits(token.amount, token.decimal)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 p-4 rounded-lg shadow-md">
                <div className="text-gray-900 font-bold text-lg">
                  예상 기부 량 : {totalSelectedAmount} ETH
                </div>
                <SignatureButton
                  signer={signer}
                  selectedTokens={selectedTokens}
                  adminSigner={adminSigner}
                ></SignatureButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DonationPage;
