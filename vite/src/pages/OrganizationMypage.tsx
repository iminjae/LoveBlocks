import { Contract, ethers } from "ethers";
import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import { donationContractAddress } from "../abis/contarctAddress";
import donationAbi from "../abis/donationAbi.json";
import SelectedCharity from "../components/SelectedCharity";
import OrganizationMypageComp from "../components/OrganizationMypageComp";
import OrganizationFail from "../components/OrganizationFail";

interface Organization {
  orgAddr: string;
  cid: string;
}

const OrganizationMyPage: FC = () => {
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
          <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center relative">
            {/* Title and Buttons */}
            <h1 className="text-center text-4xl font-semibold mb-4">
              지금은 프로젝트 신청 기간입니다.
            </h1>
            <h2 className="text-center text-2xl font-semibold mb-4">
              24.08.14 - 24.08.30
            </h2>
          </div>
          {/* <SelectedCharity
           signer={signer!}
           organization={organization}></SelectedCharity> */}
        </>
      ) : (
        <>
          {organization.orgAddr === signer!.address ? (
            <OrganizationMypageComp
              projectInfo={organization}
            ></OrganizationMypageComp>
          ) : (
            <OrganizationFail></OrganizationFail>
          )}
        </>
      )}
    </>
  );
};

export default OrganizationMyPage;
