import { FC, useEffect, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import SignatureButton from "../components/SignatureButton";
import { OutletContext } from "../components/Layout";
import ProgressDonate from "../components/ProgressDonate";
import DonateNFT from "../components/DonateNFT";
import { ethers } from "ethers";

interface HoldToken {
  tokenAddress: string;
  amount: bigint;
  name: string;
  symbol: string;
  decimal: bigint;
  image: string;
}
interface TokenPrice {
  id: string;
  usd: string;
}
interface MergeToken {
  tokenAddress: string;
  amount: bigint;
  name: string;
  symbol: string;
  decimal: bigint;
  image: string;
  usd: string;
}

const DonationPage: FC = () => {
  const { signer, adminSigner } = useOutletContext<OutletContext>();
  const location = useLocation();
  const { holdTokens, tokenPrice } = location.state || { holdTokens: [], tokenPrice: [] };
  const [mergeTokens, setMergeTokens] = useState<MergeToken[]>()

  useEffect(() => {
    const mergedTokens = holdTokens.map((token:HoldToken) => {
      // 모든 가격 데이터에서 토큰의 symbol과 매칭되는 id를 찾음
      const matchingPrice = tokenPrice.find((price:TokenPrice) => {
          // symbol과 id를 비교할 때, 소문자로 변환하여 비교
          return price.id.includes(token.symbol.toLowerCase());
      });
  
      // 토큰 객체에 가격을 추가하여 반환
      return {
          ...token,
          usd: matchingPrice ? matchingPrice.usd : null
      };
  });
  
  setMergeTokens(mergedTokens);
  }, [tokenPrice])
  
  return (
    <div>
      <ProgressDonate signer={signer}/>
      <br/>
      <br/>
      {mergeTokens && mergeTokens.map((token: MergeToken, index: number) => (
        <li key={index}>
          <img src={token.image} alt={token.name} width="30" height="30" />
          <span>
            {token.name} ({token.symbol})
          </span>
          <span>: {token.amount.toString()}</span>
          <div>: {token.tokenAddress}</div>
          <div>: {(Number(ethers.formatUnits(token.amount,token.decimal))*Number(token.usd)).toFixed(2) }$</div>
        </li>
      ))}
      <SignatureButton
        signer={signer}
        holdTokens={holdTokens}
        adminSigner={adminSigner}
      ></SignatureButton>
      <DonateNFT signer={signer} holdTokens={holdTokens}/>
    </div>
    
  );
};

export default DonationPage;
