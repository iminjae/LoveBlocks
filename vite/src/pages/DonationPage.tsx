import { FC, useEffect, useRef, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import SignatureButton from "../components/SignatureButton";
import { OutletContext } from "../components/Layout";
import silverCard from "../assets/silverCard.jpg";
import commonCard from "../assets/common.jpeg";
import black from "../assets/black.jpg";
import { ethers } from "ethers";
import { format, differenceInDays } from "date-fns";
import "../styles/TokenCardAnimation.css";
import "../styles/DonationModal.css";
import mintNftAbi from "../abis/mintNftAbi.json";
import { mintNftContractAddress } from "../abis/contarctAddress";
import * as htmlToImage from 'html-to-image';
import DonationModal from "../components/DonationCompleModal";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
interface MergeToken {
  tokenAddress: string;
  amount: bigint;
  name: string;
  symbol: string;
  decimal: bigint;
  image: string;
  usd: string;
}

const DonationPage: FC = () => {
  const { signer, adminSigner } = useOutletContext<OutletContext>();
  const location = useLocation();
  const { holdTokens, tokenPrice } = location.state || { holdTokens: [], tokenPrice: [] };
  const [mergeTokens, setMergeTokens] = useState<MergeToken[]>();
  const [selectedTokens, setSelectedTokens] = useState<MergeToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDonationComplete, setIsDonationComplete] = useState(false);
  const [progress, setProgress] = useState(0); // 진행률
  const [mention, setMention] = useState(''); // 현재 단계에 맞는 메시지

  const getRainbowColors = (numColors: number) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = (i * 360 / numColors) % 360; // 0도에서 360도까지 색상을 생성
      colors.push(`hsl(${hue}, 100%, 50%)`);
    }
    return colors;
  };


  const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
    { name: 'Group D', value: 200 },
    { name: 'Group D', value: 200 },
    { name: 'Group D', value: 200 },
    { name: 'Group D', value: 200 },
  ];




  const colors = getRainbowColors(data.length);

  const donationInfo = {
    title: "기부 제목",
    organizationName: "기부 단체 이름",
    description:
      "이 글은 기부의 목적과 기부금의 사용처에 대한 내용을 담고 있습니다. 기부해주신 분들께 깊이 감사드립니다.",
    totalAmount: "100 ETH",
    totalDonors: 50,
    startDate: new Date(2024, 7, 1),
    endDate: new Date(2024, 8, 30),
  };

  const today = new Date();
  const dDay = differenceInDays(donationInfo.endDate, today);
  const formattedStartDate = format(donationInfo.startDate, "yyyy-MM-dd");
  const formattedEndDate = format(donationInfo.endDate, "yyyy-MM-dd");

  const toggleTokenSelection = (token: MergeToken) => {
    setSelectedTokens((prevSelectedTokens) => {
      const isSelected = prevSelectedTokens.some(
        (selectedToken) => selectedToken.tokenAddress === token.tokenAddress
      );
      if (isSelected) {
        return prevSelectedTokens.filter(
          (selectedToken) => selectedToken.tokenAddress !== token.tokenAddress
        );
      } else {
        return [...prevSelectedTokens, token];
      }
    });
  };

  const totalSelectedAmount = selectedTokens.reduce(
    (total, token) => total + parseFloat((Number(ethers.formatUnits(token.amount,token.decimal))*Number(token.usd)).toFixed(2)),
    0
  );

  const onSignatureSuccess = async () => {
    console.log("Signature was successful!");
    setProgress(33);  // 초기 진행률 설정
    setMention('NFT 생성 중...');
    await mintNft()
    setProgress(66);  // 중간 진행률 설정
    setMention('NFT 업로드 중...');

    setIsLoading(false);
    setProgress(100);  // 완료 시 진행률 설정
    setMention('기부 완료!');
    setIsDonationComplete(true);
  };

  const chartContainerRef = useRef<HTMLDivElement>(null);

  const mintNft = async () => {
    const mintNftContract = new ethers.Contract(
      mintNftContractAddress,
      mintNftAbi,
      adminSigner
    );

    try {
      const imgIPFS = await pinFileToIPFS();
      const jsonIPFS = await pinJsonToIPFS(imgIPFS);
      const response = await mintNftContract.mintNft("https://rose-top-beetle-859.mypinata.cloud/ipfs/" + jsonIPFS);
      await response.wait();
    } catch (error) {
      console.error(error);
      setMention('NFT 생성에 실패했습니다.');
    }
  };

  const pinFileToIPFS = async (): Promise<string> => {
    if (chartContainerRef.current === null) {
      return "";
    }

    const dataUrl = await htmlToImage.toPng(chartContainerRef.current, { backgroundColor: 'black' });
    const blob = await (await fetch(dataUrl)).blob();

    try {
      const data = new FormData();
      data.append('file', blob, 'tokenInfo.png');

      const metadata = JSON.stringify({
        name: "DONATION_NFT",
      });

      data.append('pinataMetadata', metadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });

      data.append('pinataOptions', pinataOptions);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_APP_PINATA_JWT}`,
        },
        body: data,
      });

      if (!response.ok) {
        console.error('Failed to upload file:', response.statusText);
        setMention('파일 업로드에 실패했습니다.');
      }

      const result = await response.json();
      return result.IpfsHash;

    } catch (error) {
      console.error('Error uploading file:', error);
      setMention('파일 업로드 중 오류가 발생했습니다.');
      throw error;
    }
  };

  const pinJsonToIPFS = async (imgIPFS: string): Promise<string> => {
    const jsonData = {
      image: "https://gateway.pinata.cloud/ipfs/" + imgIPFS,
      attributes: [
        {
          "trait_type": "기부일",
          "value": "123123"
        },
        {
          "trait_type": "기부단체명",
          "value": "55555"
        }
      ]
    };

    const apiKey = `${import.meta.env.VITE_APP_PINATA_API_KEY}`;
    const secretApiKey = `${import.meta.env.VITE_APP_PINATA_API_SECRET_KEY}`;

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': apiKey,
          'pinata_secret_api_key': secretApiKey,
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error('Failed to pin JSON to IPFS');
      }

      const data = await response.json();
      return data.IpfsHash;

    } catch (error) {
      console.error('Error pinning JSON to IPFS:', error);
      setMention('JSON 업로드에 실패했습니다.');
      throw error;
    }
  };

  useEffect(() => {
    const mergedTokens = holdTokens.map((token:HoldToken) => {
      // 모든 가격 데이터에서 토큰의 symbol과 매칭되는 id를 찾음
      const matchingPrice = tokenPrice.find((price:TokenPrice) => {
          // symbol과 id를 비교할 때, 소문자로 변환하여 비교
          return price.id.includes(token.symbol.toLowerCase());
      });
  
      // 토큰 객체에 가격을 추가하여 반환
      return {
          ...token,
          usd: matchingPrice ? matchingPrice.usd : null
      };
  });
  
  setMergeTokens(mergedTokens);
  }, [tokenPrice])
  
  return (
    <div className={`min-h-screen flex flex-col font-sans ${isLoading ? 'opacity-50' : ''}`}>
      <main className="flex-grow">
        <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 shadow-md rounded-lg mt-10 mx-4">
          <div className="max-w-7xl mx-auto">
            {/* 기부 단체 설명 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center">
              {/* 좌측 이미지 */}
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={commonCard}
                  alt="Donation Organization"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 우측 설명 */}
              <div className="flex flex-col justify-center text-left space-y-4">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  {donationInfo.title}
                </h2>
                <h3 className="text-xl text-gray-700">
                  {donationInfo.organizationName}
                </h3>
                <div className="text-gray-600 leading-relaxed max-h-40 overflow-y-auto pr-2">
                  {donationInfo.description}
                </div>
                <div className="text-gray-800 font-medium space-y-1">
                  <p>
                    모금액: <span className="font-bold text-gray-900">{donationInfo.totalAmount}</span>
                  </p>
                  <p>
                    기부자 수: <span className="font-bold text-gray-900">{donationInfo.totalDonors}명</span>
                  </p>
                  <p>
                    기부 기간:{" "}
                    <span className="font-bold text-gray-900">
                      {formattedStartDate} ~ {formattedEndDate}
                    </span>
                  </p>
                  <p>
                    D-Day:{" "}
                    <span className="font-bold text-red-500">
                      {dDay >= 0 ? `D-${dDay}` : "종료됨"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* 토큰 목록 */} 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-60">
              {mergeTokens! ? (
                mergeTokens!.map((token: MergeToken) => (
                  <div
                    key={token.tokenAddress}
                    className={`p-6 rounded-lg shadow-md text-center cursor-pointer transition-transform transform hover:scale-105 ${selectedTokens.some(
                      (selectedToken) =>
                        selectedToken.tokenAddress === token.tokenAddress
                    )
                      ? "selected-token-card"
                      : "border border-gray-200"
                      }`}
                    style={{
                      backgroundImage: `url(${silverCard})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundBlendMode: "overlay",
                    }}
                    onClick={() => toggleTokenSelection(token)}
                  >
                    <img
                      src={token.image}
                      alt={token.name}
                      className="w-16 h-16 mx-auto rounded-full"
                    />
                    <h3 className="text-xl font-bold mt-4 text-gray-800">
                      {token.symbol.toUpperCase()}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      잔액: {(Number(ethers.formatUnits(token.amount,token.decimal))*Number(token.usd)).toFixed(2)}$
                    </p>
                  </div>
                ))
              ) : (
                <p className="mt-4 text-lg text-center text-gray-600">
                  보유한 토큰이 없습니다.
                </p>
              )}
              
            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg py-4 px-6 flex justify-between items-center space-x-4 border-t border-gray-200">
            {/* 왼쪽: 그래프 */}
            <div className="w-2/5 flex justify-center items-center h-60">
              {/* 명함 크기의 그래프 자리 */}
              <div
                ref={chartContainerRef}
                className="w-[450px] h-[230px] bg-gray-100 flex justify-center items-center"
                style={{
                  backgroundImage: `url(${black})`,
                  backgroundSize: 'cover',  // 배경 이미지를 요소에 꽉 차게 조정
                  backgroundPosition: 'center',  // 이미지가 중앙에 위치하도록 설정
                  // backgroundRepeat: 'no-repeat'  // 배경 이미지 반복 방지
                }}
              >
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={30}
                      outerRadius={50}
                      fill="#8884d8"
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 오른쪽: 선택된 토큰들 및 총량/버튼 */}
            <div className="w-3/5 flex flex-col justify-between h-60 overflow-hidden">
              <div className="flex flex-wrap items-center space-x-2 overflow-x-auto">
                {selectedTokens.map((token) => (
                  <div
                    key={token.tokenAddress}
                    className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 shadow-sm"
                  >
                    <img
                      src={token.image}
                      className="w-8 h-8 rounded-full"
                      alt={token.name}
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {token.symbol.toUpperCase()}: {(Number(ethers.formatUnits(token.amount,token.decimal))*Number(token.usd)).toFixed(2)}$
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 p-4 rounded-lg shadow-md">
                <div className="text-gray-900 font-bold text-lg">
                  예상 기부 량 : {totalSelectedAmount}$
                </div>
                <SignatureButton
                  signer={signer}
                  selectedTokens={selectedTokens}
                  adminSigner={adminSigner}
                  onSuccess={onSignatureSuccess}
                  setLoading={setIsLoading}
                  setProgress={setProgress} // 진행률 업데이트 함수 전달
                  setMention={setMention}   // 메시지 업데이트 함수 전달
                ></SignatureButton>
              </div>
            </div>
          </div>

        </section>
      </main>

      {isDonationComplete && (
        <DonationModal
          onClose={() => setIsDonationComplete(false)}
          className="z-60"  // 모달이 가장 위에 표시되도록 z-index를 높게 설정
        />
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 h-25">  {/* 창 크기 고정 */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">{mention}</h2>
              <p>진행률: {progress}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationPage;
