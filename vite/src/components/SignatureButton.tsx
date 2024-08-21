import { FC, useEffect, useState } from "react";
import { ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import donationAbi from "../abis/donationAbi.json";
import { donationContractAddress } from "../abis/contarctAddress";
import { Wallet } from "ethers";
import { supabaseClient } from "../lib/supabaseClient";
import "../styles/SignatureButton.css"; // 추가: CSS 파일 가져오기

interface Token {
  tokenAddress: string;
  amount: bigint;
  decimal: bigint;
}

interface HeaderProps {
  signer: JsonRpcSigner | null;
  adminSigner: Wallet | null;
  selectedTokens: {
    tokenAddress: string;
    amount: bigint;
    name: string;
    symbol: string;
    decimal: bigint;
    image: string;
  }[];
}

interface DbData {
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
  selectedTokens,
}) => {
  const [deadline, setDeadline] = useState<number>(
    Math.floor(Date.now() / 1000) + 60 * 60
  ); // 1시간 유효
  const [deleteDatas, setDeleteDatas] = useState<SelectData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태 추가

  useEffect(() => {
    if (!signer) return;
    console.log("SELECTED TOKENS ", selectedTokens);
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
  };

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
        amount: value,
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
    setIsLoading(true); // 로딩 시작
    const spender = donationContractAddress;

    try {
      for (const token of selectedTokens) {
        console.log(token, spender, deadline);
        const signature = await getPermitSignature(token, spender, deadline);

        if (signature) {
          await sendSignaturesToPermit(signature);

          //DB insert - owner, tokenAddress, amount
          const data = {
            tokenAddress: token.tokenAddress!,
            amount: token.amount!,
            owner: signer!.address!,
          };
          console.log("DATA", data);
          await insertSig(data);
        } else {
          console.error(
            "Failed to collect signature for token:",
            token.tokenAddress
          );
        }
      }

      await countSig();
    } finally {
      setIsLoading(false); // 로딩 종료
    }
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
      .insert({
        tokenAddress: signature.tokenAddress,
        amount: signature.amount.toString(),
        owner: signature.owner,
      });
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
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition animate-pulse"
        onClick={handleCollectSignatures}
        disabled={isLoading} // 로딩 중에는 버튼 비활성화
      >
        기부하기
      </button>

      {isLoading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default SignatureButton;
