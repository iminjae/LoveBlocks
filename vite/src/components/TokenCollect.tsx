import React, { FC } from 'react'
import { ethers } from "ethers";

const TokenCollect:FC = () => {
    // const arbitrumRpcUrl = "https://arb1.arbitrum.io/rpc";
    const provider = new ethers.InfuraProvider("arbitrum",'2a34b908696f4275b84ae15338cc6b8a');
    console.log(provider)
  return (
    <div>Component</div>
  )
}

export default TokenCollect



// // 지갑 주소
// const walletAddress = "YOUR_WALLET_ADDRESS";

// // 블록 범위 설정
// const fromBlock = 20330300;
// const toBlock = "latest";

// // ERC20 ABI
// const erc20Abi = [
//   "event Transfer(address indexed from, address indexed to, uint amount)"
// ];

// async function getTokenTransfers() {
//   const logs = await provider.getLogs({
//     fromBlock: fromBlock,
//     toBlock: toBlock,
//     topics: [
//       ethers.id("Transfer(address,address,uint256)"),
//       null,
//       ethers.encode(["address"], [walletAddress])
//     ]
//   });

//   const iface = new ethers.Interface(erc20Abi);

//   const tokenTransfers = logs.map(log => {
//     const parsedLog = iface.parseLog(log);
//     return {
//       tokenAddress: log.address,
//       from: parsedLog.args[0],
//       to: parsedLog.args[1],
//       amount: parsedLog.args[2].toString()
//     };
//   });

//   // 중복된 토큰 주소를 제거
//   const uniqueTokenAddresses = [...new Set(tokenTransfers.map(transfer => transfer.tokenAddress))];

//   // ABI와 토큰 주소를 출력
//   uniqueTokenAddresses.forEach(address => {
//     console.log(`Token Address: ${address}`);
//     console.log(`Token ABI: ${JSON.stringify(erc20Abi)}`);
//   });

//   process.exit();
// }

// getTokenTransfers().catch(console.error);
