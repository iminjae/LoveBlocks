import { FC } from "react";
import { OutletContext } from "../components/Layout";
import { useOutletContext } from "react-router-dom";
import ApplyDonatePJ from "../components/ApplyDonatePJ";

const ApplyDonationPJPage: FC = () => {
  const { signer, adminSigner } = useOutletContext<OutletContext>();

  return (
    <div style={{ padding: "20px" }}>
      <ApplyDonatePJ signer={signer} adminSigner={adminSigner} />
    </div>
  );
};

export default ApplyDonationPJPage;
