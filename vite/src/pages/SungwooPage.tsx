import React, { FC } from 'react';
import Test from '../components/Test';
import { useOutletContext } from 'react-router-dom';
import { OutletContext } from '../components/Layout';

const SungwooPage: FC = () => {
  const { signer } = useOutletContext<OutletContext>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Love Blocks</h1>
      <p className="mb-4">지갑잔액 보여주는 페이지</p>
      {signer ? (
        <Test signer={signer} />
      ) : (
        <p className="text-red-500">Please connect your wallet to view token balances.</p>
      )}
    </div>
  );
};

export default SungwooPage;