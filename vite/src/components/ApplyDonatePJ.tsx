import { FC, useRef, useState } from "react";
import { ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import donationAbi from "../abis/donationAbi.json";
import { donationContractAddress } from "../abis/contarctAddress";





interface HeaderProps {
    signer: JsonRpcSigner | null;
}


const ApplyDonatePJ: FC<HeaderProps> = ({ signer }) => {


    const [image, setImage] = useState<File | null>(null);
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

            const imgIPFS = await pinFileToIPFS();

            const jsonIPFS = await pinJsonToIPFS(imgIPFS);

            // const jsonData = await fetchJsonFromIPFS(jsonIPFS); 나중에 쓰럭


            const response = await donationContract.setApplyDonationPJInfo(signer?.address, jsonIPFS);
            await response.wait();

        } catch (error) {
            console.error(error);
        }
    };



    //imageFile to IPFS
    const pinFileToIPFS = async (): Promise<string> => {

        try {
            const data = new FormData();
            data.append('file', image!);

            const metadata = JSON.stringify({
                name: "donation_pj_img",
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
            }

            const result = await response.json();

            return result.IpfsHash


        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    //jsonfile to IPFS
    const pinJsonToIPFS = async (imgIPFS: string): Promise<string> => {



        const jsonData = {
            title:title,
            organizationName: organizationName,
            content: content,
            image: "https://gateway.pinata.cloud/ipfs/" + imgIPFS
        }

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
            throw error;
        }

    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyDonationPJ();
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Apply for Donation Project</h2>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter project title"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Organization Name
                    </label>
                    <input
                        type="text"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter organization name"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Content
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter project content"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Upload Image
                    </label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ApplyDonatePJ;
