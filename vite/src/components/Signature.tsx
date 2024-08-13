import { FC, useState } from 'react';
import { ethers } from 'ethers';
import { JsonRpcSigner } from 'ethers';
import donationAbi from "../abis/donationAbi.json";
import { donationContractAddress } from "../abis/contarctAddress";

interface Token {
    tokenAddress: string;
    amount: string;
}

interface TokenData {
    token: string;
    amount: number;
}

interface HeaderProps {
    signer: JsonRpcSigner | null;
}

interface SignatureData {
    owner: string;
    tokens: TokenData[];
    nonce: number;
    deadline: number;
    v: number;
    r: string;
    s: string;
}


const DonateComponent: FC<HeaderProps> = ({ signer }) => {
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [signatures, setSignatures] = useState<SignatureData[]>([]);
    const [deadline, setDeadline] = useState<number>(Math.floor(Date.now() / 1000) + 60 * 60); // 1시간 유효


    const getMultiPermitSignature = async (tokens: Token[], spender: string, deadline: number): Promise<SignatureData | null> => {
        if (!signer) return null;

        const chainId = (await signer.provider.getNetwork()).chainId;

        const domain = {
            name: "MultiTokenDonation",
            version: '1',
            chainId: chainId,
            verifyingContract: donationContractAddress,
        };

        const types = {
            MultiPermit: [
                { name: "owner", type: "address" },
                { name: "tokens", type: "TokenData[]" },
                { name: "nonce", type: "uint256" },
                { name: "deadline", type: "uint256" }
            ],
            TokenData: [
                { name: "token", type: "address" },
                { name: "amount", type: "uint256" }
            ]
        };

        const tokenContract = new ethers.Contract(donationContractAddress, donationAbi, signer);

        const nonce = await tokenContract.nonces(await signer.getAddress());

        const message = {
            owner: await signer.getAddress(),
            tokens: tokens.map(token => ({
                token: token.tokenAddress,
                amount: parseInt(ethers.parseUnits(token.amount, 18).toString())
            })),
            nonce: parseInt(nonce),
            deadline: Number(deadline),
        };

        

        try {
            const signature = await signer.signTypedData(domain, types, message);
            console.log("Signature:", signature);
            
            const sig = ethers.Signature.from(signature);

            // Calculate the hashes that are used in Solidity
            const domainSeparator = ethers.TypedDataEncoder.hashDomain(domain);
            const structHash = ethers.TypedDataEncoder.hashStruct("MultiPermit", types, message);

            console.log("Domain Separator:", domainSeparator);
            console.log("Struct Hash (tokenDataHashCombined):", structHash);
            console.log("v:", sig.v);
            console.log("r:", sig.r);
            console.log("s:", sig.s);

            return {
                owner: message.owner,
                tokens: tokens.map(token => ({
                    token: token.tokenAddress,
                    amount: parseInt(ethers.parseUnits(token.amount, 18).toString())
                })),
                nonce: parseInt(nonce),
                deadline: Number(deadline),
                v: sig.v,
                r: sig.r,
                s: sig.s
            };

        } catch (error) {
            console.error("Error signing permit:", error);
            return null;
        }
    };

    const handleCollectSignatures = async () => {
        const spender = donationContractAddress; // 서명 컨트랙트 주소

        const tokenInputs = [
            { tokenAddress: "0x9eA18De905e654F9FB98498109C60EdFE133C145", amount: "0.003" },
            { tokenAddress: "0x9eA18De905e654F9FB98498109C60EdFE133C145", amount: "0.005" }
        ];// 임시 데이터

        setTokens

        const signature = await getMultiPermitSignature(tokenInputs, spender, deadline);

        if (signature) {
            setSignatures([signature]);
            console.log("Collected Signature:", signature);
        } else {
            console.error("Failed to collect signatures.");
        }
    };

    const sendSignaturesToContract = async () => {
        if (signatures.length === 0) return;

        const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/4120a176f57d44b79a5f54b1b9cfc9fb'); // 세폴 테스트용

        const wallet = new ethers.Wallet(`${import.meta.env.VITE_SIG_WALLET_PRIVATE_KEY}`, provider); // test2 지갑(임시)

        const signatureContract = new ethers.Contract(donationContractAddress, donationAbi, wallet);        

        try {
            const tx = await signatureContract.executeBatch(signatures[0]);
            // const tx = await signatureContract.name(signatures[0]);

            await tx.wait();
            // console.log(tx);
            
            console.log("Batch executed and tokens transferred");
        } catch (error) {
            console.error("Error executing batch:", error);
        }
    };

    return (
        <div>
            <button onClick={handleCollectSignatures}>Donate</button>
            <br></br>
            <br></br>
            <button onClick={sendSignaturesToContract} disabled={signatures.length === 0}>
                Send Signatures
            </button>
        </div>
    );
};

export default DonateComponent;
