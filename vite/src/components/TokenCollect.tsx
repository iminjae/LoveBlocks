import { JsonRpcSigner } from "ethers";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import TokenInfo from "./TokenInfo";
// import { supabaseClient } from "../lib/supabaseClient";

interface TokenCollectProps {
  signer: JsonRpcSigner;
}
interface TokenCoinGecko {
  id: string;
  name: string;
  platforms: {
    [key: string]: string | null;
  };
  symbol: string;
}
interface HoldToken {
  tokenAddress: string;
  amount: string;
  name: string;
  symbol: string;
  decimal: bigint;
  image: string;
}

interface SelectData {
  id: number;
  signature: string;
  created_at: string;
}

const TokenCollect: FC<TokenCollectProps> = ({ signer }) => {
  const [tokenInfos, setTokenInfos] = useState<TokenCoinGecko[]>([]);
  const [tokenAddrs, setTokenAddrs] = useState<string[]>([]);
  const [holdTokens, setHoldTokens] = useState<HoldToken[]>([]);
  // const [deleteDatas, setDeleteDatas] = useState<SelectData[]>([]);

  const tokenAbi = [
    "function balanceOf(address _owner) view returns (uint256 balance)",
    "function symbol() view returns (string)",
    "function name() view returns (string)",
    "function decimals() view returns (uint8)",
  ];

  //1. 코인게코 api를 사용해서 아비트럼 체인 내의 토큰 주소를 전부 가져온다
  async function getArbitrumTokensAddress() {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/list?include_platform=true"
      );

      //토큰 정보 전체 저장
      const tokens = response.data.filter((token: TokenCoinGecko) => {
        const keys = token.platforms ? Object.keys(token.platforms) : [];
        const tokenAddr = keys.some(
          (key) => key?.toLowerCase() === "arbitrum-one"
        );
        return tokenAddr;
      });
      setTokenInfos(tokens);

      //토큰 주소만 저장
      const tokenAddr = tokens.map((token: TokenCoinGecko) => {
        const platform = token.platforms ?? {};
        return platform["arbitrum-one"];
      });
      setTokenAddrs(tokenAddr);

      console.log("getArbitrumTokensAddress success");
    } catch (error) {
      console.error("getArbitrumTokensAddress, ", error);
    }
  }

  //2. 각 토큰 주소에 signer의 지갑주소로 balanceOf
  async function getBalance(tokenAddrs: string[]) {
    const balanceData = tokenAddrs.map(async (tokenAddr) => {
      const contract = new ethers.Contract(
        tokenAddr,
        tokenAbi,
        signer.provider
      );

      try {
        const balance = await contract.balanceOf(signer.address);
        console.log("BALLLLL ", balance);
        const formattedBalance = ethers.formatUnits(balance, 18);

        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimal = await contract.decimals();

        if (Number(formattedBalance) > 0) {
          return {
            tokenAddress: tokenAddr,
            amount: formattedBalance,
            name,
            symbol,
            decimal,
            image: "",
          };
        }
      } catch (error) {
        // console.error("Get Balance Error, ", error);
      }
    });

    const results = await Promise.all(balanceData);

    // 잔액이 있는 토큰만 필터링
    const holdTokens = results.filter((result) => result !== undefined);

    setHoldTokens(holdTokens);
    console.log("balanceData: ", holdTokens);
  }

  useEffect(() => {
    if (!signer) return;
    getArbitrumTokensAddress();
  }, [signer]);

  useEffect(() => {
    if (!tokenAddrs) return;
    getBalance(tokenAddrs);
  }, [tokenAddrs]);

  useEffect(() => {
    if (!holdTokens) return;
    // getTokenImage(holdTokens);
  }, [holdTokens]);

  // const tempSig = [
  //   "0xaa94e1803e7c60f47bb321d2bb42afc622076e939f65e7578ecc24b56cf2f5826797329d38efbf3189126f94f4593d8d2ed5b35a455d9b0e7d8593786aa24dac27",
  // ];

  // async function selectSig(count: number) {
  //   const { data } = await supabaseClient
  //     .from("signature")
  //     .select("*")
  //     .order("id", { ascending: true })
  //     .limit(count);

  //   return data;
  // }

  // async function insertSig(signatures: string[]) {
  //   const insertData = signatures.map(async (signature) => {
  //     const { error } = await supabaseClient
  //       .from("signature")
  //       .insert({ signature: signature });
  //     if (error) {
  //       console.error("saveSignature Error ", error);
  //     } else {
  //       console.log("insert success");
  //     }
  //   });

  //   try {
  //     await Promise.all(insertData);
  //   } catch (error) {
  //     console.error("insertSig Error,", error);
  //   }
  // }

  // async function countSig() {
  //   const { count, error } = await supabaseClient
  //     .from("signature")
  //     .select("*", { count: "exact", head: true });
  //   if (error) {
  //     console.error("selectSig Error ", error);
  //   } else {
  //     if (count! >= 10) {
  //       const data = await selectSig(count!);
  //       //서명 별 트랜잭션 처리 - contract 메서드 호출하면될 듯

  //       console.log(data);

  //       //count 개수만큼 row 삭제
  //       if (!data || data.length === 0) return;
  //       setDeleteDatas(data);
  //     }
  //   }
  // }

  // async function deleteSig(data: SelectData[]) {
  //   const deleteData = data?.map((row) => row.id);
  //   console.log("deleteData", deleteData);

  //   const { error } = await supabaseClient
  //     .from("signature")
  //     .delete()
  //     .in("id", deleteData!);

  //   if (error) {
  //     console.error("deleteData Error ", error);
  //   }
  // }

  // useEffect(() => {
  //   if (!deleteDatas) return;
  //   deleteSig(deleteDatas);
  // }, [deleteDatas]);

  return (
    <div>
      <div className="flex justify-center items-center">
        {holdTokens.map((token) => (
          <TokenInfo
            key={token.symbol}
            name={token.name}
            tokenCnt={token.amount}
            tokenSymbol={token.symbol}
          ></TokenInfo>
        ))}
      </div>
      {/* <button
        onClick={() => {
          //인자값에 signature 배열 넣기
          insertSig(tempSig).then(async () => {
            await countSig();
          });
        }}
      >
        지금 바로 기부하기
      </button> */}
    </div>
  );
};

export default TokenCollect;
