import { FC } from 'react';
import { OutletContext } from '../components/Layout';
import { useOutletContext } from 'react-router-dom';
import Signature from '../components/Signature';




const MinjaePage: FC = () => {
  
  const { signer } = useOutletContext<OutletContext>();

  return (
    <div style={{ padding: '20px' }}>
      <Signature signer={signer} />
    </div>
  );
};

export default MinjaePage;
