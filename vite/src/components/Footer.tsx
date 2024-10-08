import { FC } from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { SiNaver } from "react-icons/si";

const Footer: FC = () => {
  return (
    <footer className="bg-toss-dark text-gray-400 py-10">
      <div className="container mx-auto px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold mb-2">Company Info</h3>
            <p>Company Name: Loveblocks</p>
            <p>대표자: 양현용</p>
            <p>사업자 등록번호: 140-05-00830</p>
            <p>주소: 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</p>
            <p>전화: 02-7608-0212</p>
            <p>이메일: Loveblocks@contact.com</p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Donors Guide */}
            <div>
              <h3 className="text-white font-bold mb-2">
                기부자들을 위한 안내
              </h3>
              <p>
                신뢰할 수 있는 기부단체와 함께 소중한 기부금을 관리하고 세상을
                변화시키세요.
              </p>
              <a href="/donors-guide" className="text-blue-400 hover:underline">
                더 알아보기
              </a>
            </div>

            {/* Organizations Guide */}
            <div>
              <h3 className="text-white font-bold mb-2">
                기부단체들을 위한 안내
              </h3>
              <p>
                더 많은 기부자들에게 다가가고 지원을 확대하세요. LoveBlocks와
                함께 성장하세요.
              </p>
              <a
                href="/organizations-guide"
                className="text-blue-400 hover:underline"
              >
                더 알아보기
              </a>
            </div>
          </div>
        </div>

        {/* 하단 로고 및 링크 */}
        <div className="border-t border-gray-700 pt-8 flex flex-col items-center sm:flex-row sm:justify-between">
          <div className="text-white text-xl font-bold mb-4 sm:mb-0 flex items-center">
            LoveBlocks
            <div className="flex ml-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 hover:text-blue-500"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 hover:text-pink-500"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 hover:text-blue-400"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://naver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 hover:text-green-500"
              >
                <SiNaver size={24} />
              </a>
            </div>
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} LoveBlocks. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
