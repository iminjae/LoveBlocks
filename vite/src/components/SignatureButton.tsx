import { FC, useEffect, useState } from "react";
import { ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import donationAbi from "../abis/donationAbi.json";
import { donationContractAddress } from "../abis/contarctAddress";
import { Wallet } from "ethers";
import { supabaseClient } from "../lib/supabaseClient";
import "../styles/SignatureButton.css"; 

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
  onSuccess: () => void;
  setLoading: (loading: boolean) => void; // 로딩 상태 업데이트 함수
  setProgress: (progress: number) => void; // 진행률 업데이트 함수
  setMention: (mention: string) => void;   // 메시지 업데이트 함수
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
  onSuccess,
  setLoading,
  setProgress,
  setMention,
}) => {
  const [deadline, setDeadline] = useState<number>(
    Math.floor(Date.now() / 1000) + 60 * 60
  ); 
  const [deleteDatas, setDeleteDatas] = useState<SelectData[]>([]);

  useEffect(() => {
    if (!signer) return;
    console.log("SELECTED TOKENS ", selectedTokens);
  }, [signer]);

  useEffect(() => {
    if (!deleteDatas) return;

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
    const value = token.amount;
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
      const signature = await signer.signTypedData(domain, types, message);
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
    try {
        setLoading(true); 
        setProgress(0);  // 초기 진행률 설정
        setMention('서명 수집 중...');

        const spender = donationContractAddress;
        const stepProgress = 100 / selectedTokens.length;  // 각 토큰마다 진행률을 얼마나 증가시킬지 계산

        for (let i = 0; i < selectedTokens.length; i++) {
            const token = selectedTokens[i];
            try {
                const signature = await getPermitSignature(token, spender, deadline);

                if (signature) {
                    const newProgress = (i + 1) * stepProgress;  // 새로운 진행률 계산
                    setProgress(newProgress);  // 진행률 업데이트
                    await sendSignaturesToPermit(signature);
                    const data = {
                        tokenAddress: token.tokenAddress!,
                        amount: token.amount!,
                        owner: signer!.address!,
                    };
                    await insertSig(data);
                    setMention(`${token.name} 서명 완료.`);
                } else {
                    console.error("Failed to collect signature for token:", token.tokenAddress);
                }
            } catch (error) {
                console.error("Error processing token:", token.tokenAddress, error);
                setMention(`서명 수집 중 오류가 발생했습니다: ${token.name}`);
            }
        }
        
        await countSig();
        onSuccess(); // 서명이 완료되면 onSuccess 호출
    } catch (error) {
        console.error("Error in handleCollectSignatures:", error);
        setMention('서명 수집 중 전체 오류가 발생했습니다.');
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
      setMention('서명 전송 중 오류가 발생했습니다.');
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
      setMention('DB 저장 중 오류가 발생했습니다.');
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
        if (!data || data.length === 0) return;
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
      >
        기부하기
      </button>
    </div>
  );
};

export default SignatureButton;
