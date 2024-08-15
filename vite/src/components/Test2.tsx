import { FC } from "react";
import { ethers, JsonRpcSigner } from "ethers";

interface Test2Props {
  signer: JsonRpcSigner;
}

const Test2: FC<Test2Props> = ({ signer }) => {
  const addr = "0xaa714d140bE478e65C5D678c17a1B320FBe232Ab";
  const abi = ["function swapExactTokensForUSDT(address token, uint amountIn)"];
  const contract = new ethers.Contract(addr, abi, signer);

  const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
  const amount = ethers.parseUnits("0.01", "ether");

  const swap = async () => {
    var encodeData = contract.interface.encodeFunctionData(
      "swapExactTokensForUSDT",
      [DAI, amount]
    );
    await signer.sendTransaction({ to: addr, data: encodeData });
    // await con.swapExactTokensForUSDT(DAI, amount);
    // 어차피 관리자 계정, 로직인데 승인을 안 뜨게하고 동작하게는 못하나?
  };

  return (
    <div>
      <button onClick={swap}>Create Permit</button>
    </div>
  );
};

export default Test2;
