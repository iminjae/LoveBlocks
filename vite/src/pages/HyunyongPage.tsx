import { FC, useEffect } from "react";
import TokenCollect from "../components/TokenCollect";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";

const HyunyongPage: FC = () => {
  const { signer } = useOutletContext<OutletContext>();

  return (
    <>
      {signer && (
        <div>
          토큰수집 해보자
          <TokenCollect signer={signer}></TokenCollect>
        </div>
      )}
    </>
  );
};

export default HyunyongPage;
