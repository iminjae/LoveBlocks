import { FC } from 'react';
import { OutletContext } from '../components/Layout';
import { useOutletContext } from 'react-router-dom';
import ClovaOCR from '../components/ClovaOCR';




const MinjaePage: FC = () => {
  
  const { signer } = useOutletContext<OutletContext>();

  return (
    <div style={{ padding: '20px' }}>
        <ClovaOCR />
    </div>
  );
};

export default MinjaePage;
