import { FC, useEffect, useRef, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import SignatureButton from "../components/SignatureButton";
import { OutletContext } from "../components/Layout";
import logo from "../assets/logo.png";
import { ethers } from "ethers";
import "../styles/TokenCardAnimation.css";
import "../styles/DonationModal.css";
import mintNftAbi from "../abis/mintNftAbi.json";
import donationAbi from "../abis/donationAbi.json";
import { mintNftContractAddress, donationContractAddress } from "../abis/contarctAddress";
import DonationModal from "../components/DonationCompleModal";
import * as htmlToImage from "html-to-image";
import NftChart from "../components/NftChart";

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

interface DonationInfo {
  title : string;
  organizationName: string;
  content: string;
  image: string;
}

const DonationPage: FC = () => {
  const { signer, adminSigner } = useOutletContext<OutletContext>();
  const location = useLocation();
  const { holdTokens, tokenPrice } = location.state || {
    holdTokens: [],
    tokenPrice: [],
  };
  const [mergeTokens, setMergeTokens] = useState<MergeToken[]>();
  const [selectedTokens, setSelectedTokens] = useState<MergeToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDonationComplete, setIsDonationComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mention, setMention] = useState("");
  const [donationInfo, setDonationInfo] = useState<DonationInfo>()

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

  const roundToTwo = (num: number) => {
    return Math.round(num * 100) / 100;
  };

  const totalSelectedAmount = selectedTokens.reduce(
    (total, token) =>
      total +
      roundToTwo(
        Number(ethers.formatUnits(token.amount, token.decimal)) *
        Number(token.usd)
      ),
    0
  );

  const onSignatureSuccess = async () => {

    await mintNft();

    setIsLoading(false);
    setMention("기부 완료!");
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

      const response = await mintNftContract.mintNft(
        "https://rose-top-beetle-859.mypinata.cloud/ipfs/" + jsonIPFS,
        signer!.address
      );
      await response.wait();
    } catch (error) {
      console.error(error);
      setMention("NFT 생성에 실패했습니다.");
    }
  };

  const pinFileToIPFS = async (): Promise<string> => {
    if (chartContainerRef.current === null) {
      return "";
    }

    const dataUrl = await htmlToImage.toPng(chartContainerRef.current, {
      backgroundColor: "white",
    });
    const blob = await (await fetch(dataUrl)).blob();

    try {
      const data = new FormData();
      data.append("file", blob, "tokenInfo.png");

      const metadata = JSON.stringify({
        name: "DONATION_NFT",
      });

      data.append("pinataMetadata", metadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });

      data.append("pinataOptions", pinataOptions);

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_APP_PINATA_JWT}`,
          },
          body: data,
        }
      );

      if (!response.ok) {
        console.error("Failed to upload file:", response.statusText);
        setMention("파일 업로드에 실패했습니다.");
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error("Error uploading file:", error);
      setMention("파일 업로드 중 오류가 발생했습니다.");
      throw error;
    }
  };

  const pinJsonToIPFS = async (imgIPFS: string): Promise<string> => {
    const jsonData = {
      image: "https://gateway.pinata.cloud/ipfs/" + imgIPFS,
      attributes: [
        {
          trait_type: "기부일",
          value: "123123",
        },
        {
          trait_type: "기부단체명",
          value: "55555",
        },
      ],
    };

    const apiKey = `${import.meta.env.VITE_APP_PINATA_API_KEY}`;
    const secretApiKey = `${import.meta.env.VITE_APP_PINATA_API_SECRET_KEY}`;

    try {
      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: apiKey,
            pinata_secret_api_key: secretApiKey,
          },
          body: JSON.stringify(jsonData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to pin JSON to IPFS");
      }

      const data = await response.json();
      return data.IpfsHash;
    } catch (error) {
      console.error("Error pinning JSON to IPFS:", error);
      setMention("JSON 업로드에 실패했습니다.");
      throw error;
    }
  };

  /* 랜덤 선정된 기부 프로잭트 가져오기*/
  const getDonationInfo = async () => {
    const donationContract = new ethers.Contract(
      donationContractAddress,
      donationAbi,
      adminSigner
    );
  
    try {
      const response = await donationContract.getSelectedCharity();
      const ipfsHash = response[1]; // IPFS 해시 가져오기
      const donationData = await fetchJsonFromIPFS(ipfsHash);
  
      if (donationData) {
        setDonationInfo(donationData); // 상태 업데이트

      } else {
        console.error('Failed to fetch donation data');
      }
    } catch (error) {
      console.error('Error getting donation info:', error);
    }
  };

  const fetchJsonFromIPFS = async (ipfsHash: string): Promise<DonationInfo | null> => {
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      if (!response.ok) {
        throw new Error('Failed to fetch JSON from IPFS');
      }
      const data: DonationInfo = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching JSON from IPFS:', error);
      return null;
    }
  };

  useEffect(() => {
    const mergedTokens = holdTokens.map((token: HoldToken) => {
      const matchingPrice = tokenPrice.find((price: TokenPrice) => {
        return price.id.includes(token.symbol.toLowerCase());
      });

      return {
        ...token,
        usd: matchingPrice ? matchingPrice.usd : null,
      };
    });

    setMergeTokens(mergedTokens);
  }, [tokenPrice]);


  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden"; // 서명 중 스크롤 방지
    } else {
      document.body.style.overflow = "auto"; // 서명 완료 후 스크롤 재활성화
    }
  }, [isLoading]);

  useEffect(() => {
    getDonationInfo();

  }, []);

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
    >
      <main className="flex-grow">
        <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 shadow-md rounded-lg mt-10 mx-4">
          <div className="max-w-7xl mx-auto">
            {/* 기부 단체 설명 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center">
              {/* 좌측 이미지 */}
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={donationInfo?.image}
                  alt="Donation Organization"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 우측 설명 */}
              <div className="flex flex-col justify-center text-left space-y-4">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  {donationInfo?.title}
                </h2>
                <h3 className="text-xl text-gray-700">
                  {donationInfo?.organizationName}
                </h3>
                <div className="text-gray-600 leading-relaxed max-h-40 overflow-y-auto pr-2">
                  {donationInfo?.content}
                </div>
                <div className="text-gray-800 font-medium space-y-1">
                  <p>
                    모금액:{" "}
                    <span className="font-bold text-gray-900">
                      {/* {donationInfo?.totalAmount} */}
                      67.13 $
                    </span>
                  </p>
                  <p>
                    기부자 수:{" "}
                    <span className="font-bold text-gray-900">
                      {/* {donationInfo?.totalDonors}명 */}
                      47명
                    </span>
                  </p>
                  <p>
                    기부 기간:{" "}
                    <span className="font-bold text-gray-900">
                      {/* {formattedStartDate} ~ {formattedEndDate} */}
                      2024-08-01 ~ 2024-08-29
                    </span>
                  </p>
                  <p>
                    D-Day:{" "}
                    <span className="font-bold text-red-500">
                      {/* {dDay >= 0 ? `D-${dDay}` : "종료됨"} */}
                      4
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
                      잔액:{" "}
                      {roundToTwo(
                        Number(
                          ethers.formatUnits(token.amount, token.decimal)
                        ) * Number(token.usd)
                      )}
                      $
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
            <div
              ref={chartContainerRef}
              className="w-2/5 flex flex-col justify-between items-center h-60 relative rounded-md bg-gray-700"
            >
              {/* 로고와 텍스트 */}
              <div className="absolute top-0 left-0 flex items-center space-x-2 p-2">
                <img src={logo} alt="LoveBlocks Logo" className="h-5 w-5" />
                <span className="text-sm font-bold text-gray-100">
                  LOVEBLOCKS
                </span>
              </div>

              {/* 명함 크기의 그래프 자리 */}
              <div className="flex-grow flex items-end justify-center w-full mb-4">
                <NftChart tokens={selectedTokens} />
              </div>
            </div>

            {/* 오른쪽: 선택된 토큰들 및 총량/버튼 */}
            <div className="w-3/5 flex flex-col justify-between h-60 overflow-hidden">
              <div className="flex flex-wrap items-center space-x-2 overflow-x-auto">
                {selectedTokens.map((token) => (
                  <div
                    key={token.tokenAddress}
                    className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 shadow-sm mb-2"
                  >
                    <img
                      src={token.image}
                      className="w-8 h-8 rounded-full"
                      alt={token.name}
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {token.symbol.toUpperCase()}:{" "}
                      {roundToTwo(
                        Number(
                          ethers.formatUnits(token.amount, token.decimal)
                        ) * Number(token.usd)
                      )}
                      $
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 p-4 shadow-md">
                <div className="text-gray-900 font-bold text-lg">
                  예상 기부 량 : {roundToTwo(totalSelectedAmount)}$
                </div>
                {totalSelectedAmount != 0 ? (
                  <SignatureButton
                    signer={signer}
                    selectedTokens={selectedTokens}
                    adminSigner={adminSigner}
                    onSuccess={onSignatureSuccess}
                    setLoading={setIsLoading}
                    setProgress={setProgress}
                    setMention={setMention}
                  ></SignatureButton>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {isDonationComplete && (
        <DonationModal
          onClose={() => setIsDonationComplete(false)}
          className="z-60"
        />
      )}

      {isLoading && (
        <div className="overlay">
          <div className="donation-modal-overlay">
            <div className="donation-modal-content">
              <div className="spinner"></div>
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold">{mention}</h2>
                <p>진행률: {roundToTwo(progress)}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{ width: `${roundToTwo(progress)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationPage;
