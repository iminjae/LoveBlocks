import { FC, useEffect, useRef, useState } from 'react';
import "../styles/NftChart.css";

interface Token {
  id: number;
  name: string;
  color: string;
}
const tokens: Token[] = [
  { id: 1, name: 'Token 1', color: '#ff0000' },
  { id: 2, name: 'Token 2', color: '#00ff00' },
  { id: 3, name: 'Token 3', color: '#0000ff' },
];
// const [legoBlocks, setLegoBlocks] = useState<Token[]>([]);

  // const handleTokenClick = (token: Token) => {
  //   setLegoBlocks((prevBlocks) => [...prevBlocks, token]);
  // };

const MinjaePage: FC = () => {
 

  return (
    <div className="lego-builder-container">
      
    </div>
  );
};

export default MinjaePage;