import { FC } from "react";
import TokenCollect from "../components/TokenCollect";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import CreateMultiSig from "../components/CreateMultiSig";


const SignUpPage: FC = () => {
  const { signer } = useOutletContext<OutletContext>();

  return (
    <>
      {signer && (
        <div>
          <CreateMultiSig signer={signer}></CreateMultiSig>
        </div>
      )}
    </>
  );
};

export default SignUpPage;
