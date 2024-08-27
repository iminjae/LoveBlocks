import React, { FC, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

interface MessageProps {
  images: {
    format: string;
    name: string;
  }[];
  requestId: string;
  version: string;
  timestamp: number;
}

interface receiptData {
  totalPrice: string;
  itemsData: {
    name: string;
    count: string;
    price: string;
  }[];
}

const ClovaOCR: FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MessageProps | null>(null);
  const [receiptData, setReceiptData] = useState<receiptData | null>(null);
  const [flag, setFlag] = useState<boolean>(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const strSplit = e.target.files[0].name.split(".");
      await dataConfig(strSplit);

      setImage(e.target.files[0]);
    }
  };

  const dataConfig = async (strSplit: string[]) => {
    const image = {
      format: strSplit[1],
      name: strSplit[0],
    };
    const requestId = crypto.randomUUID();
    const version = "V2";
    const timestamp = Date.now();
    setData({ images: [image], requestId, version, timestamp });
  };

  const sendData = async () => {
    const data = {
      pinataMetadata: {
        name: "Receipt Json Data",
      },
      pinataContent: receiptData,
      pinataOptions: {
        cidVersion: 1,
      },
    };

    // Pinata API로 JSON 업로드
    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.IpfsHash);
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    console.log("DATA ", data);
    console.log("FILE ", image);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("message", JSON.stringify(data));

    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/proxy/clova-ocr",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
      setError(null); // Reset any previous error
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Error: ${err.message}`);
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
        }
      } else {
        setError("Unexpected error occurred");
        console.error("Unexpected error:", err);
      }
    }
  };

  const getFileCount = async () => {
    const response = await fetch("https://api.pinata.cloud/data/pinList", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT_TOKEN}`,
        "Content-Type": `application/json`,
        pinata_api_key: `${import.meta.env.VITE_PINATA_API_KEY}`,
        pinata_secret_api_key: `${import.meta.env.VITE_PINATA_SECRET_API_KEY}`,
      },
    });

    console.log(response);
  };

  useEffect(() => {
    if (!result) return;

    const totalPrice = result.images[0].receipt.result.totalPrice.price.text;
    const items = result.images[0].receipt.result.subResults[0];
    console.log(totalPrice);
    console.log(result.images[0].receipt.result.subResults[0]);

    const itemsData = items.items.map((item: any) => {
      return {
        name: item.name.text,
        count: item.count.text,
        price: item.price.price.text,
      };
    });
    setReceiptData({ totalPrice, itemsData });
  }, [result]);

  useEffect(() => {
    if (flag) return;
    getFileCount();
    setFlag(true);
  }, [flag]);

  useEffect(() => {
    if (!receiptData) return;
    sendData();
  }, [receiptData]);

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleSubmit}>이미지 업로드 및 인식</button>

      {error && (
        <div style={{ color: "red" }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ClovaOCR;
