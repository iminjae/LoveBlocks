import { FC, useState } from "react";
import { ethers } from 'ethers';
import SimpleWalletABI from '../abis/transferWithSignature.json'
import { JsonRpcSigner } from "ethers";

const MinjaePage: FC = () => {

  const [amount, setAmount] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [nonce, setNonce] = useState('');
  const [signature, setSignature] = useState('');

  const handleSignMessage = async () => {
    // A 지갑의 비밀 키 (테스트용으로만 사용, 실제 환경에서는 안전하게 관리 필요)
    const privateKey = '';
    const wallet = new ethers.Wallet(privateKey);

    // 서명할 데이터 구조
    const domain = {
      name: 'TokenTransfer',
      version: '1',
      chainId: 1,  // Mainnet: 1, Ropsten: 3, Rinkeby: 4, etc.
      verifyingContract: '0xYourContractAddress'
    };

    const types = {
      Transfer: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'nonce', type: 'uint256' }
      ]
    };

    const value = {
      from: wallet.address,
      to: toAddress,
      amount: ethers.utils.parseUnits(amount, 'wei'),
      nonce: parseInt(nonce)
    };

    // EIP-712 데이터 서명
    const signature = await wallet._signTypedData(domain, types, value);

    setSignature(signature);
  };


  return (
    <div style={{ padding: '20px' }}>
    <h1>디지털 서명 생성기</h1>
    <div>
      <label>
        금액 (Wei):
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </label>
    </div>
    <div>
      <label>
        수신자 주소:
        <input type="text" value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
      </label>
    </div>
    <div>
      <label>
        Nonce:
        <input type="text" value={nonce} onChange={(e) => setNonce(e.target.value)} />
      </label>
    </div>
    <button onClick={handleSignMessage}>서명 생성</button>
    {signature && (
      <div>
        <h2>생성된 서명:</h2>
        <p>{signature}</p>
      </div>
    )}
  </div>
  );
};


export default MinjaePage;