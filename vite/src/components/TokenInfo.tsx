import React, { FC } from "react";

interface TokenInfoProps {
  name: string;
  tokenCnt: string;
  tokenPrice: string;
  tokenSymbol: string;
}

const TokenInfo: FC<TokenInfoProps> = ({
  name,
  tokenCnt,
  tokenPrice,
  tokenSymbol,
}) => {
  return (
    <div className="">
      <div>{name}</div>
      <div>
        보유 개수: {tokenCnt.slice(0, 5)} {tokenSymbol}
      </div>
      <div>가격: {tokenPrice}</div>
    </div>
  );
};

export default TokenInfo;
