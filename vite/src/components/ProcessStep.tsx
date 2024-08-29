import React, { FC } from "react";

interface StepProps {
  number: string;
  title: string;
  description: string;
}

const Step: FC<StepProps> = ({ number, title, description }) => {
  let bgColor;
  switch (number) {
    case "1":
      bgColor = "bg-[#FF6B6B]"; // 예: 1일 때 파란색
      break;
    case "2":
      bgColor = "bg-[#6BCB77]"; // 예: 2일 때 초록색
      break;
    case "3":
      bgColor = "bg-[#4D96FF]"; // 예: 3일 때 빨간색
      break;
    case "4":
      bgColor = "bg-[#FFD93D]"; // 예: 1일 때 파란색
      break;
    case "5":
      bgColor = "bg-[#845EC2]"; // 예: 2일 때 초록색
      break;
    case "6":
      bgColor = "bg-[#FF9671]"; // 예: 3일 때 빨간색
      break;
  }
  return (
    <div className="flex items-center">
      <div
        className={`flex items-center justify-center w-8 h-8 ${bgColor} text-white rounded-full`}
      >
        {number}
      </div>
      <div className="ml-4">
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Step;
