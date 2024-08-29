import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  FaHandHoldingHeart,
  FaChartPie,
  FaProjectDiagram,
  FaListAlt,
} from "react-icons/fa";

const Dashboard: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const donationData = {
    totalDonated: 1434020,
    totalUsed: 1030020,
    usageBreakdown: [
      { name: "사용됨", value: 1030020, percent: 71.8 },
      { name: "미사용", value: 404000, percent: 28.2 },
    ],
    projectDonations: [
      {
        id: 1,
        donor: "김철수",
        project: "프로젝트 A",
        amount: 500000,
        date: "2023-03-15",
      },
      {
        id: 2,
        donor: "이영희",
        project: "프로젝트 B",
        amount: 300000,
        date: "2023-03-16",
      },
      {
        id: 3,
        donor: "단체 X",
        project: "프로젝트 C",
        amount: 230020,
        date: "2023-03-17",
      },
    ],
  };

  const COLORS = ["#3182F6", "#4DADF7", "#94D0FF", "#C6E5FF", "#E7F4FF"];

  const handleRowClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div
      className={`bg-[#F9FAFB] min-h-screen py-10 px-5 sm:px-10 lg:px-20 font-sans transition-opacity duration-3000 ease-out ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: isLoaded ? "translateY(0)" : "translateY(-2cm)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#191F28] mb-12">
          기부 현황 대시보드
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-white border border-[#6BCB77] p-3 rounded-full mr-4">
                <FaHandHoldingHeart className="text-2xl text-[#6BCB77]" />
              </div>
              <h2 className="text-lg font-medium text-[#191F28]">
                기부자 기부 금액
              </h2>
            </div>
            <div className="flex items-center justify-center pt-20">
              <p className="text-4xl font-bold text-[#3182F6]">
                {donationData.totalDonated.toLocaleString()} 원
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-white border border-[#FF6B6B] p-3 rounded-full mr-4">
                <FaChartPie className="text-2xl text-[#FF6B6B]" />
              </div>
              <h2 className="text-lg font-medium text-[#191F28]">
                기부단체 사용 기부금액
              </h2>
            </div>
            <div className="flex items-center justify-center pt-20">
              <p className="text-4xl font-bold text-[#3182F6]">
                {donationData.totalUsed.toLocaleString()} 원
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 transition-all hover:shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-white border border-[#845EC2] p-3 rounded-full mr-4">
                <FaProjectDiagram className="text-2xl text-[#845EC2]" />
              </div>
              <h2 className="text-lg font-medium text-[#191F28]">
                기부금 활용 현황
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={donationData.usageBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {donationData.usageBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-4">
              {donationData.usageBreakdown.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center mx-2">
                  <div
                    className="w-3 h-3 mr-1 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-xs text-[#4E5968]">
                    {entry.name} ({entry.percent.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <div className="bg-white border border-[#FFC75F] p-3 rounded-full mr-4">
              <FaListAlt className="text-2xl text-[#FFC75F]" />
            </div>
            <h2 className="text-xl font-medium text-[#191F28]">
              프로젝트별 기부 목록
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-[#F9FAFB] text-[#4E5968] text-xs">
                  <th className="py-3 px-4 text-left font-medium">기부자</th>
                  <th className="py-3 px-4 text-left font-medium">프로젝트</th>
                  <th className="py-3 px-4 text-left font-medium">금액</th>
                  <th className="py-3 px-4 text-left font-medium">날짜</th>
                </tr>
              </thead>
              <tbody className="text-[#191F28] text-sm">
                {donationData.projectDonations.map((donation) => (
                  <React.Fragment key={donation.id}>
                    <tr
                      className={`border-b border-[#E5E8EB] hover:bg-[#F9FAFB] cursor-pointer ${
                        expandedRow === donation.id ? "bg-[#F9FAFB]" : ""
                      }`}
                      onClick={() => handleRowClick(donation.id)}
                    >
                      <td className="py-3 px-4 text-left">{donation.donor}</td>
                      <td className="py-3 px-4 text-left">
                        {donation.project}
                      </td>
                      <td className="py-3 px-4 text-left text-[#3182F6]">
                        {donation.amount.toLocaleString()} 원
                      </td>
                      <td className="py-3 px-4 text-left">{donation.date}</td>
                    </tr>
                    {expandedRow === donation.id && (
                      <tr className="bg-[#F9FAFB]">
                        <td colSpan={4} className="p-4 text-[#4E5968] text-xs">
                          상세 내용: 기부자 {donation.donor}님이{" "}
                          {donation.project} 프로젝트에{" "}
                          {donation.amount.toLocaleString()} 원을
                          기부하였습니다. 기부 날짜: {donation.date}.
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
