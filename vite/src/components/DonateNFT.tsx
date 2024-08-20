import { FC, useRef, useState } from "react";
import { ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import mintNftAbi from "../abis/mintNftAbi.json";
import { donationContractAddress, mintNftContractAddress } from "../abis/contarctAddress";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import * as htmlToImage from 'html-to-image';




interface HeaderProps {
    signer: JsonRpcSigner | null;
    holdTokens: {
        tokenAddress: string;
        amount: string;
        name: string;
        symbol: string;
        decimal: bigint;
        image: string;
    }[];
}

interface SignatureData {
    owner: string;
    token: string;
    amount: string;
    deadline: number;
    v: number;
    r: string;
    s: string;
}

interface HoldToken {
    tokenAddress: string;
    amount: number;
    name: string;
    symbol: string;
    decimal: bigint;
    image: string;
}

interface nftInfo {
    day: string;
    organization: string;
}

const DonateNFT: FC<HeaderProps> = ({ signer, holdTokens }) => {

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56'];
    const RADIAN = Math.PI / 180;

    const [imgIpfsHash, setImgIpfsHash] = useState<string | null>(null);
    const [jsonIpfsHash, setJsonIpfsHash] = useState<string | null>(null);

    const renderCustomizedLabel = (props: any) => {
        const { cx, cy, midAngle, innerRadius, outerRadius } = props;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize="14px"
                fontWeight="bold"
            >
                {props.payload.symbol}
            </text>
        );
    };



    const chartContainerRef = useRef<HTMLDivElement>(null);
    //   const handleDownloadImage = () => {
    //     if (chartContainerRef.current === null) {
    //       return;
    //     }

    //     const dataUrl = await htmlToImage.toPng(chartContainerRef.current, { backgroundColor: 'white' })
    //       .then((dataUrl) => {
    //         download(dataUrl, 'token-distribution.png');
    //       })
    //       .catch((err) => {
    //         console.error('Could not generate image', err);
    //       });
    //   };

    const mintNft = async () => {

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

        const mintNftContract = new ethers.Contract(
            mintNftContractAddress,
            mintNftAbi,
            wallet
        );


        try {

            const imgIPFS = await pinFileToIPFS();

            const jsonIPFS = await pinJsonToIPFS(imgIPFS);

            const jsonData = await fetchJsonFromIPFS(jsonIPFS);


            const response = await mintNftContract.mintNft("https://rose-top-beetle-859.mypinata.cloud/ipfs/" + jsonIPFS);
            await response.wait();

        } catch (error) {
            console.error(error);
        }
    };



    //imageFile to IPFS
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
            }

            const result = await response.json();

            return result.IpfsHash;


        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    //jsonfile to IPFS
    const pinJsonToIPFS = async (imgIPFS: string): Promise<string> => {

        const nftInfo = {
            day: "2024-08-19",
            organization: "러브블록"
        }

        const jsonData = {

            image: "https://gateway.pinata.cloud/ipfs/" + imgIPFS,
            attributes: [
                {
                    "trait_type": "기부일",
                    "value": nftInfo.day
                },
                {
                    "trait_type": "기부단체명",
                    "value": nftInfo.organization
                }
            ]
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

    const fetchJsonFromIPFS = async (ipfsHash: string) => {
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            {/* 전체 컨테이너를 감싸는 div */}
            <div ref={chartContainerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PieChart width={400} height={400}>
                    <Pie
                        data={holdTokens.map(token => ({ ...token, amount: parseFloat(token.amount) }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="amount"
                    >
                        {holdTokens.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '1px' }}>
                    {holdTokens.map((token, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                            <div style={{ width: '20px', height: '20px', marginRight: '10px' }}>
                                {/* <img src={token.image} alt={token.symbol} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> */}

                                <img src="https://assets.coingecko.com/coins/images/38301/thumb/altr.jpg?1717034749" alt={token.symbol} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS[index % COLORS.length] }}>
                                {token.symbol}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={mintNft} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
                upload IPFS
            </button>
        </div>
    );
};

export default DonateNFT;
