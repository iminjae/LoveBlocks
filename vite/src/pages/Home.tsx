import { FC, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import axios from "axios";
import { ethers } from "ethers";
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import silverCard from "../assets/silverCard.jpg"


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
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const [text] = useTypewriter({
    words: ['사용하지 못하는 잔돈을 이웃에게'],
    delaySpeed: 6000,
    onLoopDone: () => setShowNext(true),
  });
  

  const tokenAbi = [
    "function balanceOf(address _owner) view returns (uint256 balance)",
    "function symbol() view returns (string)",
    "function name() view returns (string)",
    "function decimals() view returns (uint8)",
  ];

  //1. 코인게코 api를 사용해서 아비트럼 체인 내의 토큰 주소를 전부 가져온다
  const getArbitrumTokensAddress = async () => {
    setIsLoading(true); 
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
      setIsButtonVisible(false);

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
      } catch (error) {
        // console.error(error);
      }
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
    }finally{
      setIsLoading(false);
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

    <div className="min-h-screen bg-toss-light flex flex-col font-sans ">

      {/* Hero Section */}
      <main className="flex-grow ">
      <section className="bg-contain bg-center bg-no-repeat text-black py-24 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-7xl font-bold leading-tight p-10">
              {text}
              <Cursor cursorColor="#000" />
            </h2>

            {showNext && (
              <>
                <p className="mt-7 text-2xl animate-fadeInMove"> 지금 바로 기부하세요 </p>
               
                {isButtonVisible ? (
                  <div>
                    <button
                      className="mt-20 bg-white text-toss-blue py-3 px-6 rounded-full shadow-md font-bold animate-bounce"
                      onClick={getArbitrumTokensAddress}
                    >
                      잔돈 조회하기
                    </button>
                  </div>
                ) : isLoading ? (
                  <div className="mt-8 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    <p className="text-lg mt-4">토큰을 조회중입니다...</p>
                  </div>
                ) : (
                  <div>
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-6 gap-3">
                      {holdTokens.length > 0 ? (
                        holdTokens.map((token) => (
                          <div
                            key={token.tokenAddress}
                            className="p-6 rounded-lg shadow-md text-center w-40"
                            style={{
                              backgroundImage: `url(${silverCard})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                              backgroundBlendMode: 'overlay',
                            }}
                          >
                            <img
                              src={token.image}
                              alt={token.name}
                              className="w-16 h-16 mx-auto"
                            />
                            <h3 className="text-xl font-bold mt-4">{token.symbol.toUpperCase()}</h3>
                            <p className="mt-2">
                              잔액: {ethers.formatUnits(token.amount, token.decimal)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="mt-4 text-lg text-center">
                          보유한 토큰이 없습니다.
                        </p>
                      )}
                    </div>

                    <button
                      className="mt-20 bg-white text-toss-blue py-3 px-6 shadow-md rounded-full font-bold animate-bounce"
                      onClick={() => navigate("/donation", { state: { holdTokens, tokenPrice } })}
                    >
                      기부하러 가기
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-toss-dark text-center">Features</h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-toss-light rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                <p>Make payments with confidence using our secure platform.</p>
              </div>
              <div className="p-6 bg-toss-light rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-2">Invest Easily</h3>
                <p>Grow your wealth with our easy-to-use investment tools.</p>
              </div>
              <div className="p-6 bg-toss-light rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold mb-2">Track Expenses</h3>
                <p>Keep track of your spending and stay on budget.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-toss-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-toss-dark text-center">About Toss</h2>
            <p className="mt-6 text-lg text-center text-toss-dark">
              LOVEBLOCKS is a leading fintech company focused on delivering a seamless financial experience.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
  
};

export default Home;
