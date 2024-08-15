import React, { useState, useEffect } from "react";
// import Moralis from 'moralis';

type BalanceResponse = {
  balance: string;
};

const Test: React.FC = () => {
  const [balance, setBalance] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      // .env 파일에서 Moralis API 키를 불러옵니다.
      const MORALIS_API_KEY = import.meta.env.VITE_APP_MORALIS_API_KEY;

      if (!MORALIS_API_KEY) {
        console.error("err");
        return;
      }

      // Moralis API 키를 초기화합니다.
      // await Moralis.start({ apiKey: MORALIS_API_KEY });

      const address = "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022"; // 사용할 주소
      const chain = "0xa4b1"; // 사용할 체인의 ID

      // Moralis.EvmApi.balance.getNativeBalance 함수를 사용하여 잔액을 가져옵니다.
      // const response = await Moralis.EvmApi.balance.getNativeBalance({
      //   address,
      //   chain
      // });

      // BalanceResponse 타입을 사용하여 response의 타입을 정의합니다.
      // const balanceResponse: BalanceResponse = response.raw;

      // setBalance(balanceResponse.balance); // 잔액을 상태로 설정합니다.
    } catch (error) {
      console.error("잔액 정보를 가져오는 중 오류가 발생했습니다:", error);
      setBalance("오류 발생"); // 오류 상태를 설정합니다.
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div>
      {balance ? <p>잔액: {balance}</p> : <p>잔액 정보를 불러오는 중...</p>}
    </div>
  );
};

export default Test;
