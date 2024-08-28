import { FC, useState, useEffect } from "react";
import { ethers } from "ethers";
import mintNftAbi from "../abis/mintNftAbi.json";
import { mintNftContractAddress } from "../abis/contarctAddress";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";

interface NftMetadata {
  title: string;
  name: string;
  content: string;
  image: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}

interface ModalProps {
  nft: NftMetadata | null;
  onClose: () => void;
}

const NftModal: FC<ModalProps> = ({ nft, onClose }) => {
  if (!nft) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">{nft.name}</h2>
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-72 object-cover rounded-lg mb-4"
        />
        <p className="text-gray-700 text-lg mb-4">{nft.content}</p>
        {nft.attributes && (
          <ul className="mb-4 space-y-2">
            {nft.attributes.map((attr, i) => (
              <li key={i} className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">{attr.trait_type}:</span>{" "}
                {attr.value}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const MyPage: FC = () => {
  const { signer } = useOutletContext<OutletContext>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nfts, setNfts] = useState<NftMetadata[]>([]);
  const [totalDonation, setTotalDonation] = useState<number>(0);
  const [selectedNft, setSelectedNft] = useState<NftMetadata | null>(null);

  const getNftMetadata = async (tokenId: number): Promise<NftMetadata> => {
    const mintNftContract = new ethers.Contract(
      mintNftContractAddress,
      mintNftAbi,
      signer
    );

    const tokenUri = await mintNftContract.tokenURI(tokenId);
    const metadata = await axios.get(tokenUri);
    return metadata.data;
  };

  const extractDonationAmount = (attributes: { trait_type: string; value: string }[]): number => {
    const donationAttr = attributes.find(attr => attr.trait_type === "기부금액");
    if (donationAttr) {
      // 문자열에서 숫자 부분만 추출
      const amountString = donationAttr.value.replace(/[^\d.-]/g, '');
      return parseFloat(amountString) || 0;
    }
    return 0;
  };

  const loadNfts = async () => {
    if (!signer) return;

    setIsLoading(true);

    try {
      const mintNftContract = new ethers.Contract(
        mintNftContractAddress,
        mintNftAbi,
        signer
      );

      const balance = await mintNftContract.balanceOf(
        await signer.getAddress()
      );

      const nftPromises = [];

      for (let i = 0; i < balance; i++) {
        const tokenId = await mintNftContract.tokenOfOwnerByIndex(
          await signer.getAddress(),
          i
        );

        nftPromises.push(getNftMetadata(tokenId));
      }

      const nftData = await Promise.all(nftPromises);
      setNfts(nftData);

      // 총 기부금액 계산
      const totalDonationAmount = nftData.reduce((total, nft) => {
        const donation = nft.attributes ? extractDonationAmount(nft.attributes) : 0;
        return total + donation;
      }, 0);
      setTotalDonation(totalDonationAmount);

    } catch (error) {
      console.error("Failed to load NFTs", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (nft: NftMetadata) => {
    setSelectedNft(nft);
  };

  const handleCloseModal = () => {
    setSelectedNft(null);
  };

  useEffect(() => {
    loadNfts();
  }, [signer]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">My NFTs</h1>
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-lg font-semibold">Total Donation</p>
          <p className="text-2xl font-bold">${totalDonation.toLocaleString()}</p>
        </div>
      </div>
      {isLoading ? (
        <p className="text-xl text-gray-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {nfts.map((nft, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(nft)}
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-52 object-cover rounded-t-lg mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-800">{nft.name}</h2>
              <p className="text-gray-600 mt-2">{nft.content}</p>
              {nft.attributes && (
                <ul className="mt-4 space-y-1">
                  {nft.attributes.map((attr, i) => (
                    <li key={i} className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">{attr.trait_type}:</span>{" "}
                      {attr.value}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {selectedNft && <NftModal nft={selectedNft} onClose={handleCloseModal} />}
    </div>
  );
};

export default MyPage;
