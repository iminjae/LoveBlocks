import { FC } from "react";

const SignUpOrganization: FC = () => {
  const coins = [
    {
      name: "ETH",
      logoUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    },
    {
      name: "USDT",
      logoUrl: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    },
    {
      name: "USDC",
      logoUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    },
    {
      name: "MAGIC",
      logoUrl:
        "https://assets.coingecko.com/coins/images/18623/small/magic.png",
    },
    {
      name: "COMP",
      logoUrl: "https://cryptologos.cc/logos/compound-comp-logo.png",
    },
    {
      name: "SUSHI",
      logoUrl: "https://cryptologos.cc/logos/sushiswap-sushi-logo.png",
    },
    {
      name: "ARB",
      logoUrl:
        "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg",
    },
    {
      name: "CRV",
      logoUrl: "https://cryptologos.cc/logos/curve-dao-token-crv-logo.png",
    },
    {
      name: "LDO",
      logoUrl:
        "https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png",
    },
    {
      name: "PEPE",
      logoUrl:
        "https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg",
    },
    {
      name: "PENDLE",
      logoUrl:
        "https://assets.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png",
    },
    {
      name: "GMX",
      logoUrl:
        "https://assets.coingecko.com/coins/images/18323/small/arbit.png",
    },
    {
      name: "YFI",
      logoUrl: "https://cryptologos.cc/logos/yearn-finance-yfi-logo.png",
    },
    {
      name: "UNI",
      logoUrl: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
    },
    {
      name: "BONK",
      logoUrl: "https://assets.coingecko.com/coins/images/28600/small/bonk.jpg",
    },
    {
      name: "BAL",
      logoUrl: "https://cryptologos.cc/logos/balancer-bal-logo.png",
    },
    {
      name: "GRT",
      logoUrl: "https://cryptologos.cc/logos/the-graph-grt-logo.png",
    },
    { name: "MKR", logoUrl: "https://cryptologos.cc/logos/maker-mkr-logo.png" },
    {
      name: "FRAX",
      logoUrl: "https://cryptologos.cc/logos/frax-frax-logo.png",
    },
    {
      name: "GNO",
      logoUrl: "https://cryptologos.cc/logos/gnosis-gno-gno-logo.png",
    },
  ];

  const innerCoins = coins.slice(0, 6);
  const outerCoins = coins.slice(7, 22);

  return (
    <div className="flex items-center justify-between p-8 bg-gradient-to-r from-blue-50 h-[640px] to-purple-50 pl-20">
      {/* 왼쪽 텍스트 영역 */}
      <div className="max-w-lg">
        <h2 className="text-xl font-bold text-blue-600 mb-2">
          지갑에 있는 잔액을 기부하세요
        </h2>
        <h1 className="text-3xl font-bold mb-4">
          블록체인기부 생태계를 확장해 나가는
          <br />
          LOVEBLOCKS의 도전
        </h1>
        <p className="text-lg mb-6">
          LOVEBLOCKS는 블록체인 생태계와 유기적으로 연동하여
          <br />
          잔액들을 필요한 이웃에게 전달합니다.
          <br />
          블록체인의 가능성을 확장해 나가는 우리의 여정에 함께해 보세요.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300">
          기부 단체 신청 →
        </button>
      </div>

      {/* 오른쪽 원형 그라데이션 섹션 */}
      <div className="w-1/2">
        <div className="relative w-[500px] h-[500px] mb-10 ml-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full shadow-lg">
          {/* 외부 원 */}
          <div className="absolute inset-[20px] rounded-full bg-gradient-to-br from-purple-400 to-blue-400">
            <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-blue-100 to-purple-100"></div>
          </div>

          {/* 내부 원 */}
          <div className="absolute inset-[100px] rounded-full bg-gradient-to-br from-blue-300 to-purple-400">
            <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-blue-100 to-purple-100"></div>
          </div>

          <div className="absolute inset-0 animate-spin-slow">
            {outerCoins.map((coin, index) => {
              const angle = (index / outerCoins.length) * 2 * Math.PI;
              const x = 250 + 230 * Math.cos(angle);
              const y = 252 + 235 * Math.sin(angle);
              return (
                <div
                  key={coin.name}
                  className="absolute"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: `translate(-50%, -50%) rotate(${angle}rad)`,
                  }}
                >
                  <div
                    className="flex flex-col items-center justify-center"
                    style={{ transform: `rotate(-${angle}rad)` }}
                  >
                    <img
                      src={coin.logoUrl}
                      alt={coin.name}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="absolute inset-0">
            {innerCoins.map((coin, index) => {
              const angle = (index / innerCoins.length) * 2 * Math.PI;
              const x = 250 + 150 * Math.cos(angle);
              const y = 255 + 155 * Math.sin(angle);
              return (
                <div
                  key={coin.name}
                  className="absolute"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: `translate(-50%, -50%) rotate(${angle}rad)`,
                  }}
                >
                  <div
                    className="flex flex-col items-center justify-center"
                    style={{ transform: `rotate(-${angle}rad)` }}
                  >
                    <img
                      src={coin.logoUrl}
                      alt={coin.name}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 중앙 로고 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold mt-3 text-black-600 tracking-wider">
                LOVEBLOCKS
              </h1>
              <p className="text-xs text-gray-600 mt-2">Powered by Arbitrum</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpOrganization;
