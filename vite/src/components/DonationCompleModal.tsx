import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface DonationModalProps {
  onClose: () => void;
  className?: string; // 추가적인 스타일링을 위한 className prop
}

const DonationModal: FC<DonationModalProps> = ({ onClose, className }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center ${className}`}
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto z-50">
        <h2 className="text-2xl font-bold text-center">
          기부가 성공적으로 완료되었습니다!
        </h2>
        <p className="mt-4 text-center">기부에 참여해 주셔서 감사합니다!</p>
        <div className="mt-6 flex justify-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              navigate("/mypage");
              onClose();
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
