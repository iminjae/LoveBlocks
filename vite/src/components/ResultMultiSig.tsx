import { Contract } from "ethers";
import { JsonRpcSigner } from "ethers";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ResultMultiSigProps {
  signer: JsonRpcSigner | null;
  multiSigCA: Contract;
}

const ResultMultiSig: FC<ResultMultiSigProps> = ({ multiSigCA }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div>MultiSig Address: {multiSigCA}</div>
      <button onClick={() => navigate("/applyDonatePJ")}>
        기부 프로젝트 등록
      </button>
    </div>
  );
};

export default ResultMultiSig;
