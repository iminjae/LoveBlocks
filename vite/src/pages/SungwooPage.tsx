import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FaHandHoldingHeart, FaChartPie, FaProjectDiagram, FaListAlt, FaRocket, FaLightbulb } from 'react-icons/fa';

const SungwooPage: React.FC = () => {
  // 샘플 데이터
  const donationData = {
    totalDonated: 1434020,
    totalUsed: 1030020,
    usageBreakdown: [
      { name: '사용됨', value: 1030020, percent: 71.8 },
      { name: '미사용', value: 404000, percent: 28.2 },
    ],
    projectDonations: [
      { id: 1, donor: '김철수', project: '프로젝트 A', amount: 500000, date: '2023-03-15' },
      { id: 2, donor: '이영희', project: '프로젝트 B', amount: 300000, date: '2023-03-16' },
      { id: 3, donor: '단체 X', project: '프로젝트 C', amount: 230020, date: '2023-03-17' },
    ],
  };

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-noto-sans-kr">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-16">기부 현황 대시보드</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* 컴포넌트 1: 기부자 기부 금액 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition duration-500 hover:scale-105 border-t-4 border-indigo-500">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <FaHandHoldingHeart className="text-3xl text-indigo-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">기부자 기부 금액</h2>
            </div>
            <p className="text-4xl font-bold text-indigo-500">
              {donationData.totalDonated.toLocaleString()} 원
            </p>
          </div>

          {/* 컴포넌트 2: 기부단체 사용 기부금액 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition duration-500 hover:scale-105 border-t-4 border-emerald-500">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-3 rounded-full mr-4">
                <FaChartPie className="text-3xl text-emerald-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">기부단체 사용 기부금액</h2>
            </div>
            <p className="text-4xl font-bold text-emerald-500">
              {donationData.totalUsed.toLocaleString()} 원
            </p>
          </div>

          {/* 컴포넌트 3: 기부금 활용 현황 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition duration-500 hover:scale-105 border-t-4 border-blue-500">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaProjectDiagram className="text-3xl text-blue-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">기부금 활용 현황</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-6">
              {donationData.usageBreakdown.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center mx-3">
                  <div
                    className="w-4 h-4 mr-2 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm text-gray-600">{entry.name} ({entry.percent}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 추가 섹션 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition duration-500 hover:scale-105 border-t-4 border-amber-500">
            <div className="flex items-center mb-6">
              <div className="bg-amber-100 p-3 rounded-full mr-4">
                <FaRocket className="text-3xl text-amber-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">목표 달성률</h2>
            </div>
            <p className="text-4xl font-bold text-amber-500">75%</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition duration-500 hover:scale-105 border-t-4 border-rose-500">
            <div className="flex items-center mb-6">
              <div className="bg-rose-100 p-3 rounded-full mr-4">
                <FaLightbulb className="text-3xl text-rose-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">새로운 프로젝트</h2>
            </div>
            <p className="text-4xl font-bold text-rose-500">3</p>
          </div>
        </div>

        {/* 컴포넌트 4: 프로젝트별 기부 목록 */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-8">
            <div className="bg-violet-100 p-3 rounded-full mr-4">
              <FaListAlt className="text-3xl text-violet-500" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800">프로젝트별 기부 목록</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">기부자</th>
                  <th className="py-3 px-6 text-left">프로젝트</th>
                  <th className="py-3 px-6 text-left">금액</th>
                  <th className="py-3 px-6 text-left">날짜</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {donationData.projectDonations.map((donation) => (
                  <tr key={donation.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{donation.donor}</td>
                    <td className="py-3 px-6 text-left">{donation.project}</td>
                    <td className="py-3 px-6 text-left">{donation.amount.toLocaleString()} 원</td>
                    <td className="py-3 px-6 text-left">{donation.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SungwooPage;