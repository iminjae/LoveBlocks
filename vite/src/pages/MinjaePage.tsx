import { FC } from 'react';
import { OutletContext } from '../components/Layout';
import { useOutletContext } from 'react-router-dom';





const MinjaePage: FC = () => {
  
  const { signer } = useOutletContext<OutletContext>();

  return (
    <div style={{ padding: '20px' }}>

    </div>
  );
};

export default MinjaePage;
