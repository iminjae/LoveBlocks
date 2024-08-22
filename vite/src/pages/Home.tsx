import { FC, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import axios from "axios";
import { ethers } from "ethers";
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
interface TokenPrice {
  id: string;
  usd: string;
}

const Home: FC = () => {
  const navigate = useNavigate();

  const { signer } = useOutletContext<OutletContext>();

  const [tokenInfos, setTokenInfos] = useState<TokenCoinGecko[]>([]);
  const [tokenAddrs, setTokenAddrs] = useState<TokenCoinGecko[]>([]);
  const [holdTokens, setHoldTokens] = useState<HoldToken[]>([]);
  const [tokenPrice, setTokenPrice] = useState<TokenPrice[]>([]);

  const tokenAbi = [
    "function balanceOf(address _owner) view returns (uint256 balance)",
    "function symbol() view returns (string)",
    "function name() view returns (string)",
    "function decimals() view returns (uint8)",
  ];

  //1. 코인게코 api를 사용해서 아비트럼 체인 내의 토큰 주소를 전부 가져온다
  const getArbitrumTokensAddress = async () => {
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

      setTokenAddrs(tokens);

      console.log("getArbitrumTokensAddress success");
    } catch (error) {
      console.error("getArbitrumTokensAddress, ", error);
    }
  };

  const checkToken = async () => {
    const data = tokenAddrs.map(async (token) => {
      const contract = new ethers.Contract(
        token.platforms["arbitrum-one"]!,
        tokenAbi,
        signer!.provider
      );

      try {
        const balance = await contract.balanceOf(signer!.address);
        const decimal = await contract.decimals();

        const formattedBalance = ethers.formatUnits(balance, decimal);
        if (Number(formattedBalance) > 0) {
          return token;
        }
      } catch (error) {}
    });
    const results = await Promise.all(data);
    const tokenInfos = results.filter((result) => result !== undefined);
    setTokenInfos(tokenInfos);
  };

  const fetchData = async () => {
    const ids = tokenInfos.map((token) => token.id).join(",");
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd", // 기준 통화 설정
            ids: ids,
          },
        }
      );

      const resPrice = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
      );
      console.log(resPrice)
      const priceArray = Object.keys(resPrice.data).map((key) => {
        return {
          id: key,
          usd: resPrice.data[key].usd,
        };
      });
      console.log(priceArray)
      setTokenPrice(priceArray);

      const holdTokens: HoldToken[] = response.data
        .map(async (item: any) => {
          const tokenInfo = tokenInfos.find((token) => token.id === item.id);

          const contract = new ethers.Contract(
            tokenInfo!.platforms["arbitrum-one"]!,
            tokenAbi,
            signer!.provider
          );

          const balance = await contract.balanceOf(signer!.address);
          const decimal = await contract.decimals();

          if (tokenInfo) {
            return {
              tokenAddress: tokenInfo.platforms["arbitrum-one"], // 플랫폼에 따라 주소 선택
              amount: balance, // 실제 값으로 대체 필요
              name: item.name,
              symbol: item.symbol,
              decimal: decimal, // 실제 값으로 대체 필요
              image: item.image,
            };
          }

          return null;
        })
        .filter((item: any): item is HoldToken => item !== null); // null 필터링

      const results = await Promise.all(holdTokens);
      setHoldTokens(results);
    } catch (err) {
      console.error("Error fetching market data:", err);
    }
  };

  useEffect(() => {
    if (tokenAddrs.length === 0) return;
    checkToken();
  }, [tokenAddrs]);

  useEffect(() => {
    if (tokenInfos.length === 0) return;
    fetchData();
  }, [tokenInfos]);

  useEffect(() => {
    if (tokenInfos.length === 0) return;
    console.log(holdTokens);
  }, [holdTokens]);

  return (
    <div className="bg-red-200">
      <div>
        <button onClick={getArbitrumTokensAddress}>시작하자</button>
      </div>
      <button
        onClick={() =>
          navigate("/donation", { state: { holdTokens, tokenPrice } })
        }
      >
        기부하러 가기
      </button>
      <ClovaOCR></ClovaOCR>
    </div>
  );
};

export default Home;
