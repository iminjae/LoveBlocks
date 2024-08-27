import { FC } from "react";
import { OutletContext } from "../components/Layout";
import { useOutletContext } from "react-router-dom";
import DonationTable from "../components/DonationTable";
import ClovaOCR from "../components/ClovaOCR";

const MinjaePage: FC = () => {
  const { signer } = useOutletContext<OutletContext>();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500 truncate">
                  기부자 기부 금액
                </div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  1,434,020 원
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500 truncate">
                  기부단체 사용 기부금액
                </div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  1,030,020 원
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="text-sm font-medium text-gray-500 truncate">
                  기부금 활용 현황
                </div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  <span className="text-indigo-500">71.8%</span> 사용됨
                </div>
              </div>
            </div>
          </div>

          {/* Donation List Section */}
          <DonationTable></DonationTable>
          <ClovaOCR signer={signer}></ClovaOCR>
        </div>
      </main>
    </div>
  );
};

export default MinjaePage;
