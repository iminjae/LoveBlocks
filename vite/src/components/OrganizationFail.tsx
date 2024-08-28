import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const OrganizationFail: React.FC = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [globalLoading, setGlobalLoading] = useState(false);

  // 컨텐츠 표시 토글 함수
  const toggleContentVisibility = () => {
    navigate("/");
  };

  // 파일 업로드 핸들러
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 처리 로직
      console.log(file);
    }
  };

  // 애니메이션 설정
  const dropIn = {
    hidden: {
      y: "-10%", // 페이지 상단에서 1cm 정도 위에서 시작
      opacity: 0, // 처음엔 투명
    },
    visible: {
      y: "0",
      opacity: 1, // 선명하게 변화
      transition: {
        type: "spring",
        stiffness: 50,
        delay: 0.3, // 약간의 딜레이 후 애니메이션 시작
        duration: 0.6, // 애니메이션 지속 시간
      },
    },
  };

  return (
    <motion.div
      className={`flex flex-col justify-center items-center min-h-screen font-sans text-gray-900 ${
        globalLoading ? "opacity-50" : ""
      }`}
      initial="hidden"
      animate="visible"
      variants={dropIn}
    >
      {/* Title and Buttons */}
      <h1 className="text-center text-4xl font-semibold mb-4">
        아쉽게도 이번 추첨에는 선발되지 못하셨어요.
      </h1>
      <h1 className="text-center text-4xl font-semibold mb-4">
        다음 기회에 도전해 주세요! 😃
      </h1>

      {/* Buttons */}
      <div className="flex flex-col items-center">
        <button
          className="w-40 py-3 text-sm bg-blue-500 text-white rounded-lg font-semibold mb-4 hover:bg-blue-600"
          onClick={toggleContentVisibility}
        >
          메인으로 돌아가기
        </button>

        <input
          type="file"
          id="file-upload"
          style={{ display: "none" }}
          onChange={handleUpload}
        />
      </div>
    </motion.div>
  );
};

export default OrganizationFail;
