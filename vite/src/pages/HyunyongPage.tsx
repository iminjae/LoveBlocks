import { FC, useEffect } from "react";
import TokenCollect from "../components/TokenCollect";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import Test2 from "../components/Test2";

const HyunyongPage: FC = () => {
  const { signer } = useOutletContext<OutletContext>();

  return (
    <>
      {signer && (
        <div>
          토큰수집 해보자
          <TokenCollect signer={signer}></TokenCollect>
          <Test2 signer={signer}></Test2>
        </div>
      )}
    </>
  );
};

export default HyunyongPage;
