import React, { FC, useEffect, useState } from 'react';
import { ethers } from "ethers";
import "../styles/NftChart.css";

interface MergeToken {
  tokenAddress: string;
  amount: bigint;
  name: string;
  symbol: string;
  decimal: bigint;
  image: string;
  usd: string;
}

interface NftChartProps {
  tokens: MergeToken[];
}

const colorPalette = [
  '#FF6B6B', // Red
  '#6BCB77', // Green
  '#4D96FF', // Blue
  '#FFD93D', // Yellow
  '#845EC2', // Purple
  '#FF9671', // Orange
  '#00C9A7', // Teal
  '#C34A36', // Brown
  '#0081CF', // Dark Blue
  '#FFC75F', // Light Orange
];

const NftChart: FC<NftChartProps> = ({ tokens }) => {
  const [blocks, setBlocks] = useState<MergeToken[]>([]);

  useEffect(() => {
    setBlocks(tokens);
  }, [tokens]);

  return (
    <div className="nft-chart-container">
      <div className="nft-chart-logo">LOVEBLOCKS</div>
      {blocks.length === 0 ? (
        <div className="nft-chart-empty">
          <p>토큰을 선택하면 여기에서 시각화됩니다.</p>
        </div>
      ) : (
        <div className="nft-chart-blocks">
          {blocks.map((token, index) => (
            <div
              key={token.tokenAddress}
              className="lego-block"
              style={{
                backgroundColor: colorPalette[index % colorPalette.length],
              }}
            >
              <div className="lego-top">
                <div className="lego-stud"></div>
              </div>
              <div className="lego-content">
                <img src={token.image} alt={token.symbol} className="lego-token-image" />
                <span className="lego-token-symbol">{token.symbol.toUpperCase()}</span>
                <span className="lego-token-amount">
                  ${(Number(ethers.formatUnits(token.amount, token.decimal)) * Number(token.usd)).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NftChart;
