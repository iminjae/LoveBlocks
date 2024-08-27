import React, { FC, useState } from "react";

const DonationTable: FC = () => {
  const [openRow, setOpenRow] = useState(null);

  const usageData = [
    {
      name: "아메리카노",
      category: "COFFEE",
      sides: "샷추가",
      stock: 0,
      price: "₩4,500 ~ ₩4,500",
      details: "Additional details about 아메리카노.",
    },
    {
      name: "김밥",
      category: "FOOD",
      sides: "",
      stock: 200,
      price: "₩500 ~ ₩500",
      details: "Additional details about 김밥.",
    },
    // Add more data as needed
  ];

  const toggleRow = (index) => {
    setOpenRow(openRow === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        사용내역 리스트
      </h2>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기부자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                프로젝트
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                날짜
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usageData.map((item, index) => (
              <React.Fragment key={index}>
                <tr
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => toggleRow(index)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <span
                      className={`transform ${
                        openRow === index ? "rotate-90" : "rotate-0"
                      }`}
                    >
                      &#9654;
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.sides}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.stock}
                  </td>
                </tr>
                {openRow === index && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4">
                      <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        <p className="text-sm text-gray-700">{item.details}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationTable;
