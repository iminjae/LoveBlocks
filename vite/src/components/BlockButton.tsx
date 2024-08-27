import { FC, CSSProperties } from 'react';

interface LegoBlockProps {
  color: string;
  style?: CSSProperties; // style 속성을 추가합니다
}

const BlockButton: FC<LegoBlockProps> = ({ color, style }) => {
  return (
    <div className="relative inline-block">
      {/* Block body */}
      <div
        className={`w-32 h-16 rounded-lg shadow-lg relative flex justify-center items-center ${color}`}
        style={{
          ...style,
          border: '2px solid black', // 블록 외곽선을 추가
          backgroundClip: 'padding-box', // 배경 이미지가 외곽선과 겹치지 않도록 설정
        }}
      >
        {/* Dots on top of the block (cross-section view) */}
        <div className="flex justify-center gap-1">
          <div
            className={`w-7 h-6 rounded-full shadow-lg ${color}`}
            style={{
              border: '2px solid black', // 점의 외곽선을 추가
              backgroundClip: 'padding-box', // 배경 이미지가 외곽선과 겹치지 않도록 설정
            }}
          ></div>
          <div
            className={`w-7 h-6 rounded-full shadow-lg ${color}`}
            style={{
              border: '2px solid black', // 점의 외곽선을 추가
              backgroundClip: 'padding-box', // 배경 이미지가 외곽선과 겹치지 않도록 설정
            }}
          ></div>
          <div
            className={`w-7 h-6 rounded-full shadow-lg ${color}`}
            style={{
              border: '2px solid black', // 점의 외곽선을 추가
              backgroundClip: 'padding-box', // 배경 이미지가 외곽선과 겹치지 않도록 설정
            }}
          ></div>
          <div
            className={`w-7 h-6 rounded-full shadow-lg ${color}`}
            style={{
              border: '2px solid black', // 점의 외곽선을 추가
              backgroundClip: 'padding-box', // 배경 이미지가 외곽선과 겹치지 않도록 설정
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BlockButton;
