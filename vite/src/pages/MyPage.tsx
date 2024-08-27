import { FC, useState, useEffect } from "react";
import { ethers } from "ethers";
import mintNftAbi from "../abis/mintNftAbi.json";
import { mintNftContractAddress } from "../abis/contarctAddress";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";

interface NftMetadata {
  name: string;
  description: string;
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
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
        <h2 className="text-2xl font-bold mb-4">{nft.name}</h2>
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        <p className="text-gray-600 mb-4">{nft.description}</p>
        {nft.attributes && (
          <ul className="mb-4">
            {nft.attributes.map((attr, i) => (
              <li key={i} className="text-sm">
                <span className="font-semibold">{attr.trait_type}:</span>{" "}
                {attr.value}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const MyPage: FC = () => {
  const { signer, adminSigner } = useOutletContext<OutletContext>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nfts, setNfts] = useState<NftMetadata[]>([]);
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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">My NFTs</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.map((nft, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick(nft)}
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h2 className="text-xl font-semibold mt-4">{nft.name}</h2>
              <p className="text-gray-600">{nft.description}</p>
              {nft.attributes && (
                <ul className="mt-2">
                  {nft.attributes.map((attr, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-semibold">{attr.trait_type}:</span>{" "}
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
