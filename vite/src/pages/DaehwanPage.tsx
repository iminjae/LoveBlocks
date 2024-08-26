import { Contract, ethers } from "ethers";
import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import { donationContractAddress } from "../abis/contarctAddress";
import donationAbi from "../abis/donationAbi.json";
import SelectedCharity from "../components/SelectedCharity";
import OrganizationMypage from "../components/OrganizationMypage";

interface Organization {
  orgAddr: string;
  cid: string;
}

const DaehwanPage: FC = () => {
  const { signer, adminSigner } = useOutletContext<OutletContext>();

  const [donationContract, setDonationContract] = useState<Contract>();
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    const donationContract = new ethers.Contract(
      donationContractAddress,
      donationAbi,
      adminSigner
    );

    setDonationContract(donationContract);
  }, []);

  useEffect(() => {
    if (!donationContract) return;
    getSelected();
  }, [donationContract]);

  const getSelected = async () => {
    const data = await donationContract!.getSelectedCharity();
    if (data.cid !== "") setOrganization(data);

    //ipfs 데이터 불러와서 화면에 뿌리기
  };

  const selectCharity = async () => {
    await donationContract!.selectRandomCharity();
    getSelected();
  };

  return (
    <>
      {!organization ? (
        <>
        <button onClick={selectCharity}>Select Random Charity</button>
        <OrganizationMypage></OrganizationMypage>
        </>
      ) : (
        <SelectedCharity
          signer={signer}
          organization={organization}
        ></SelectedCharity>
      )}
    </>
  );
};

export default DaehwanPage;
