import React, { FC } from "react";

interface TokenInfoProps {
  name: string;
  tokenCnt: string;
  tokenPrice: string;
}

const TokenInfo: FC<TokenInfoProps> = ({ name, tokenCnt, tokenPrice }) => {
  return (
    <>
      <div>{name}</div>
      <div>보유 개수: {tokenCnt}</div>
      <div>가격: {tokenPrice}</div>
    </>
  );
};

export default TokenInfo;
