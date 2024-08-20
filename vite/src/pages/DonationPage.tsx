import { FC, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import SignatureButton from "../components/SignatureButton";
import { OutletContext } from "../components/Layout";
import ProgressDonate from "../components/ProgressDonate";

interface HoldToken {
  tokenAddress: string;
  amount: string;
  name: string;
  symbol: string;
  decimal: bigint;
  image: string;
}

const DonationPage: FC = () => {
  const { signer, adminSigner } = useOutletContext<OutletContext>();
  const location = useLocation();
  const { holdTokens } = location.state || { holdTokens: [] };

  return (
    <div>
      <ProgressDonate signer={signer}/>
      <br/>
      <br/>
      {holdTokens.map((token: HoldToken, index: number) => (
        <li key={index}>
          <img src={token.image} alt={token.name} width="30" height="30" />
          <span>
            {token.name} ({token.symbol})
          </span>
          <span>: {token.amount}</span>
          <div>: {token.tokenAddress}</div>
        </li>
      ))}
      <SignatureButton
        signer={signer}
        holdTokens={holdTokens}
        adminSigner={adminSigner}
      ></SignatureButton>
    </div>
  );
};

export default DonationPage;
