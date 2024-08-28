import { FC, useEffect, useState } from "react";
import { ethers, JsonRpcSigner, Wallet, Contract } from "ethers";
import donationAbi from "../abis/donationAbi.json";
import { donationContractAddress } from "../abis/contarctAddress";

interface HeaderProps {
  signer: JsonRpcSigner | null;
  adminSigner: Wallet | null;
}

const ApplyDonatePJ: FC<HeaderProps> = ({ signer, adminSigner }) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [donationContract, setDonationContract] = useState<Contract | null>(
    null
  );
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!adminSigner) return;
    const contract = new ethers.Contract(
      donationContractAddress,
      donationAbi,
      adminSigner
    );
    setDonationContract(contract);
  }, [adminSigner]);

  useEffect(() => {
    if (!donationContract || !signer) return;
    checkProject();
  }, [donationContract, signer]);

  const checkProject = async () => {
    if (!donationContract || !signer) return;
    const getProject = await donationContract.getApplyDonationPJInfo(
      signer.address
    );
    if (getProject !== "") setIsSubmit(true);
  };

  const applyDonationPJ = async () => {
    if (!donationContract || !signer) return;
    setIsLoading(true);
    try {
      const imgIPFS = await pinFileToIPFS();
      const jsonIPFS = await pinJsonToIPFS(imgIPFS);
      const response = await donationContract.setApplyDonationPJInfo(
        signer.address,
        jsonIPFS
      );
      await response.wait();
      setIsSubmit(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const pinFileToIPFS = async (): Promise<string> => {
    if (!image) throw new Error("No image selected");
    try {
      const data = new FormData();
      data.append("file", image);

      const metadata = JSON.stringify({
        name: "donation_pj_img",
      });
      data.append("pinataMetadata", metadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });
      data.append("pinataOptions", pinataOptions);

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_APP_PINATA_JWT}`,
          },
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file: " + response.statusText);
      }
      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const pinJsonToIPFS = async (imgIPFS: string): Promise<string> => {
    const jsonData = {
      title: title,
      organizationName: organizationName,
      content: content,
      image: "https://gateway.pinata.cloud/ipfs/" + imgIPFS,
    };

    const apiKey = `${import.meta.env.VITE_APP_PINATA_API_KEY}`;
    const secretApiKey = `${import.meta.env.VITE_APP_PINATA_API_SECRET_KEY}`;

    try {
      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: apiKey,
            pinata_secret_api_key: secretApiKey,
          },
          body: JSON.stringify(jsonData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to pin JSON to IPFS");
      }

      const data = await response.json();
      return data.IpfsHash;
    } catch (error) {
      console.error("Error pinning JSON to IPFS:", error);
      throw error;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyDonationPJ();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-[#2D3748]">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 bg-white rounded-xl shadow-lg p-8">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <div className="w-full h-[360px] bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">이미지를 선택해주세요</p>
            </div>
          )}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4 ml-2 text-[#4A5568]">
              기부프로젝트 안내문
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-[#4A5568]">
              <li>프로젝트당 한 번에 한 번 신청 가능합니다.</li>
              <li>기부내용은 신청 후에는 수정할 수 없습니다.</li>
              <li>허위 정보 기재 시 프로젝트가 취소될 수 있습니다.</li>
              <li>모든 항목을 정확히 작성해주세요.</li>
            </ul>
          </div>
        </div>
        <div className="md:w-1/2 bg-white rounded-xl shadow-lg p-8 relative">
          {!isSubmit ? (
            <form onSubmit={handleSubmit} className="w-full">
              <h2 className="text-3xl font-semibold mb-8 text-center text-[#4A5568]">
                기부 프로젝트 신청
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-[#4A5568]">
                  제목
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#EDF2F7] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4299E1] transition duration-200 text-[#2D3748]"
                  placeholder="프로젝트 제목을 입력하세요"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-[#4A5568]">
                  기부단체명
                </label>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#EDF2F7] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4299E1] transition duration-200 text-[#2D3748]"
                  placeholder="기부단체명을 입력하세요"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-[#4A5568]">
                  내용
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#EDF2F7] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4299E1] transition duration-200 h-32 resize-none text-[#2D3748]"
                  placeholder="기부내용을 입력하세요"
                  required
                ></textarea>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold mb-2 text-[#4A5568]">
                  이미지 업로드
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full text-sm text-[#4A5568] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition duration-200"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4299E1] focus:ring-opacity-50 transition duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  "프로젝트 제출"
                )}
              </button>
            </form>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4299E1] to-[#38B2AC]">
                  알림
                </h2>
                <p className="text-[#4A5568]">이미 제출되었습니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyDonatePJ;
