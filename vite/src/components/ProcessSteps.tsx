import { FC } from "react";
import Step from "./ProcessStep";

const ProcessSteps: FC = () => {
  return (
    <div className="relative flex items-center justify-center w-full h-[560px]">
      {/* Top row */}
      <div
        className="absolute w-[85%] h-[300px] border-[3px] ml-[12%] border-toss-dark rounded-full"
        style={{ clipPath: "inset(0 20% 0 0)" }}
      ></div>
      <div className="absolute top-[19%] left-[22%]">
        <Step
          number="3"
          title="멀티시그 지갑에 보관"
          description="기부단체-관리자 간 기부금 공동 관리"
        />
      </div>
      <div className="absolute top-[19%] left-[57%] transform -translate-x-1/2">
        <Step
          number="2"
          title="USDT swap"
          description="모금 기간 종료 후, 수집 토큰 -> USDT"
        />
      </div>
      <div className="absolute top-[19%] left-[70%]">
        <Step
          number="1"
          title="토큰 기부"
          description="기부자 지갑의 토큰 수집 및 기부"
        />
      </div>

      {/* Bottom row */}
      <div className="absolute bottom-[19%] left-[22%]">
        <Step
          number="4"
          title="기부금 선 사용"
          description="필요 물품에 대한 기부단체 선구매"
        />
      </div>
      <div className="absolute bottom-[19%] left-[55%] transform -translate-x-1/2">
        <Step
          number="5"
          title="사용 영수증 인증"
          description="구매 금액에 대한 영수증 인증"
        />
      </div>
      <div className="absolute bottom-[19%] left-[70%]">
        <Step
          number="6"
          title="기부금 후 지급"
          description="인증된 금액 수령"
        />
      </div>
    </div>
  );
};

export default ProcessSteps;
