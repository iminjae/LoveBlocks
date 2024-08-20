import { FC } from 'react';
import { OutletContext } from '../components/Layout';
import { useOutletContext } from 'react-router-dom';
import ApplyDonatePJ from '../components/ApplyDonatePJ';


const ApplyDonationPJPage: FC = () => {
  
  const { signer } = useOutletContext<OutletContext>();

  return (
    <div style={{ padding: '20px' }}>
        <ApplyDonatePJ signer={signer} />
    </div>
  );
};

export default ApplyDonationPJPage;
