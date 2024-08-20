import { FC, useRef, useState } from "react";
import { ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import donationAbi from "../abis/donationAbi.json";
import { donationContractAddress } from "../abis/contarctAddress";





interface HeaderProps {
    signer: JsonRpcSigner | null;
}


const ProgressDonate: FC<HeaderProps> = ({ signer }) => {

// const jsonData = await fetchJsonFromIPFS(jsonIPFS); 나중에 쓰럭
    const [image, setImage] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [organizationName, setOrganizationName] = useState<string>("");
    const [content, setContent] = useState<string>("");



    const applyDonationPJ = async () => {

        // const provider = new ethers.JsonRpcProvider(
        //     "https://arbitrum-mainnet.infura.io/v3/4120a176f57d44b79a5f54b1b9cfc9fb"
        // );
        // const wallet = new ethers.Wallet(
        //     `${import.meta.env.VITE_SIG_WALLET_PRIVATE_KEY}`,
        //     provider
        // );


        //세폴리아 테스트용
        const provider = new ethers.JsonRpcProvider(
            "https://sepolia.infura.io/v3/4120a176f57d44b79a5f54b1b9cfc9fb"
        );
        const wallet = new ethers.Wallet(
            `${import.meta.env.VITE_MY_PRIVATE_KEY}`,
            provider
        );

        const donationContract = new ethers.Contract(
            donationContractAddress,
            donationAbi,
            wallet
        );


        try {

            const response = await donationContract.getApplyDonationPJInfo(signer?.address);
            // await response.wait();

            const jsonData = await fetchJsonFromIPFS(response);
            console.log(jsonData);
            
            setTitle(jsonData.title);
            setOrganizationName(jsonData.organizationName);
            setContent(jsonData.content);
            setImage(jsonData.image);

        } catch (error) {
            console.error(error);
        }
    };



    const fetchJsonFromIPFS = async (ipfsHash: string) => {// IPFS 불러오는기능
        try {
            const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
            if (!response.ok) {
                throw new Error('Failed to fetch JSON from IPFS');
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching JSON from IPFS:', error);
            return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100">
            
            <button onClick={applyDonationPJ}>진행중인 기부 나올거</button>
            {title && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                    <h2 className="text-2xl font-bold mb-4">{title}</h2>
                    <p className="text-lg mb-2"><strong>Organization Name: </strong>{organizationName}</p>
                    <p className="text-lg mb-4"><strong>Content: </strong>{content}</p>
                    {image && <img src={`https://gateway.pinata.cloud/ipfs/${image}`} alt="Donation" className="w-full h-auto" />}
                </div>
            )}
        </div>
    );
};

export default ProgressDonate;
