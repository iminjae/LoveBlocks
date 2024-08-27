import styled, { keyframes } from "styled-components";
import binanceImg from "../assets/binanceImg.png";
import likelionImg from "../assets/likelionImg.png";
import bithumbImg from "../assets/bithumbImg.png";
import upbitImg from "../assets/upbitImg.png";

// 슬라이드 애니메이션 정의
const slideAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

// 슬라이더 컨테이너 스타일 정의
const SliderContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background-color: #fff; /* 배경을 흰색으로 설정 */
`;

// 슬라이드 콘텐츠 스타일 정의
const SliderContent = styled.div`
  display: flex;
  width: calc(200px * 4 * 2); /* 두 배로 설정된 슬라이더 항목의 총 너비 */
  animation: ${slideAnimation} 20s linear infinite;
`;

// 슬라이더 항목 스타일 정의
const PartnerItem = styled.div`
  flex: 0 0 auto;
  width: 200px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  font-size: 18px;
  white-space: nowrap;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const PartnerSlider: React.FC = () => {
  const partners = [binanceImg, likelionImg, bithumbImg, upbitImg];

  return (
    <SliderContainer>
      <SliderContent>
        {[...partners, ...partners].map((partner, index) => (
          <PartnerItem key={index}>
            <img src={partner} alt={`Partner ${index + 1}`} />
          </PartnerItem>
        ))}
      </SliderContent>
    </SliderContainer>
  );
};

export default PartnerSlider;
