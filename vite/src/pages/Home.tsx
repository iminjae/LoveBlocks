import React, { FC, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import axios from "axios";
import {  ethers } from "ethers";
import ClovaOCR from "../components/ClovaOCR";

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
  amount: bigint;
  name: string;
  symbol: string;
  decimal: bigint;
  image: string;
}

const Home: FC = () => {
  const navigate = useNavigate();

  const { signer } = useOutletContext<OutletContext>();

  const [tokenInfos, setTokenInfos] = useState<TokenCoinGecko[]>([]);
  const [tokenAddrs, setTokenAddrs] = useState<string[]>([]);
  const [holdTokens, setHoldTokens] = useState<HoldToken[]>([]);

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
        signer!.provider
      );

      try {
        const balance = await contract.balanceOf(signer!.address);

        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimal = await contract.decimals();

        const formattedBalance = balance;
        // const formattedBalance = ethers.formatUnits(balance, decimal);

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

  return (
    <div className="bg-red-200">
      <button onClick={() => navigate("/donation", { state: { holdTokens } })}>
        기부하러 가기
      </button>
      <ClovaOCR></ClovaOCR>
    </div>
  );
};

export default Home;
