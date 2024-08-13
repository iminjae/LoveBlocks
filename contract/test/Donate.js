const { expect } = require("chai");

describe("testing --------", function () {
  it("testing1", async function () {
    // const con = await ethers.deployContract("Donation");
    
    const [cpmmDeployer] = await ethers.getSigners();
    
    const conA = await ethers.getContractFactory("Donation");
    const Donation = await conA.connect(cpmmDeployer).deploy();



    // 3. 필요한 데이터 설정
    const tokens = [
      { token: '0x9eA18De905e654F9FB98498109C60EdFE133C145', amount: 3000000000000000 },
      { token: '0x9eA18De905e654F9FB98498109C60EdFE133C145', amount: 5000000000000000 }
    ];
    
    const owner = cpmmDeployer;
    const nonce = 0;
    const deadline = 1723479911;
    const v = 27;
    const r = "0x4690c581520583fe4db107e2d1fece7a02e08433ae514c780a741c5c06072b32";
    const s = "0x2ee626792dae2141469b43515f67a303b3e23aef9f2b3e33453295662db6cb36";
    
    // 4. executeBatch 함수를 호출합니다. 이 함수는 계약 내에 정의된 함수이어야 합니다.
    // 예시로는 다음과 같이 호출할 수 있습니다. 계약의 ABI와 함수 정의에 따라 호출 방식이 달라질 수 있습니다.
    await Donation.executeBatch({owner , tokens, nonce, deadline, v, r, s});








    // expect(await con.len()).to.equal(3);
  });

  

});