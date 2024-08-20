import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

interface TestProps {
  signer: ethers.Signer;
}

interface Token {
  address: string;
  symbol: string;
  balance: string;
  price: number;
}

interface PriceCache {
  [key: string]: { price: number; timestamp: number };
}

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

const ARBITRUM_TOKENS = [
  { address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', coingeckoId: 'usd-coin' }, // USDC
  { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', coingeckoId: 'weth' },     // WETH
  { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', coingeckoId: 'arbitrum' }, // ARB
  { address: '0xc87b37a581ec3257b734886d9d3a581f5a9d056c', coingeckoId: 'Aeither' }, // ATH
  { address: '0x25d887ce7a35172c62febfd67a1856f20faebb00', coingeckoId: 'PEPE' }, // ATH
  { address: '0x13ad51ed4f1b7e9dc168d8a00cb3f4ddd85efa60', coingeckoId: 'Ldo' }, // ATH
  { address: '0xb0ffa8000886e57f86dd5264b9582b2ad87b2b91', coingeckoId: 'Wormhole' }, // ATH
  { address: '0x0c880f6761f1af8d9aa9c466984b80dab9a8c9e8', coingeckoId: 'Pendle' }, // ATH

];

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

const Test: React.FC<TestProps> = ({ signer }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [priceCache, setPriceCache] = useState<PriceCache>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAccountAndProvider = useCallback(async () => {
    try {
      const address = await signer.getAddress();
      setAccount(address);
      const provider = signer.provider;
      if (provider) {
        setProvider(provider);
      } else {
        throw new Error("Provider not found in signer");
      }
    } catch (error) {
      setError("Failed to get account or provider");
      console.error("Failed to get account or provider:", error);
    }
  }, [signer]);

  const getTokenPrice = useCallback(async (coingeckoId: string): Promise<number> => {
    const now = Date.now();
    const cachedData = priceCache[coingeckoId];

    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.price;
    }

    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`);
      const price = response.data[coingeckoId].usd;

      setPriceCache(prev => ({
        ...prev,
        [coingeckoId]: { price, timestamp: now }
      }));

      return price;
    } catch (error) {
      console.error(`Failed to fetch price for ${coingeckoId}:`, error);
      return cachedData?.price || 0;
    }
  }, [priceCache]);

  const fetchTokenInfo = useCallback(async (tokenAddress: string, coingeckoId: string): Promise<Token | null> => {
    if (!account || !provider) return null;

    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const balance = await contract.balanceOf(account);
      const decimals = await contract.decimals();
      const symbol = await contract.symbol();
      const price = await getTokenPrice(coingeckoId);

      return {
        address: tokenAddress,
        symbol,
        balance: ethers.formatUnits(balance, decimals),
        price
      };
    } catch (error) {
      console.error(`Failed to fetch info for token ${tokenAddress}:`, error);
      return null;
    }
  }, [account, provider, getTokenPrice]);

  const updateAllTokens = useCallback(async () => {
    if (!account || !provider) return;

    setIsLoading(true);
    setError(null);

    try {
      const tokenInfoPromises = ARBITRUM_TOKENS.map(token =>
        fetchTokenInfo(token.address, token.coingeckoId)
      );
      const tokenInfos = await Promise.all(tokenInfoPromises);
      setTokens(tokenInfos.filter((token): token is Token => token !== null));
    } catch (error) {
      setError("Failed to update token information");
      console.error("Failed to update token information:", error);
    } finally {
      setIsLoading(false);
    }
  }, [account, provider, fetchTokenInfo]);

  useEffect(() => {
    getAccountAndProvider();
  }, [getAccountAndProvider]);

  useEffect(() => {
    if (account && provider) {
      updateAllTokens();
      const interval = setInterval(updateAllTokens, UPDATE_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [account, provider, updateAllTokens]);

  const formatBalance = (balance: string): string => {
    const numBalance = parseFloat(balance);
    if (numBalance < 0.0001) {
      return numBalance.toExponential(4);
    }
    return numBalance.toFixed(4);
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (isLoading) {
    return <p>Loading token information...</p>;
  }

  return (
    <div>
      <p>Connected Account: {account}</p>
      <h2 className="text-xl font-bold mt-4 mb-2">Token Balances</h2>
      <ul>
        {tokens.map((token) => (
          <li key={token.address} className="mb-2">
            <span className="font-semibold">{token.symbol}:</span> {formatBalance(token.balance)}
            <span className="ml-2">(Price: ${token.price.toFixed(2)})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Test;