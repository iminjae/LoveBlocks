// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenTransfer {
    mapping(address => uint256) public nonces;

    function transferWithSignature(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        bytes memory signature
    ) public {
        // 서명 재사용 방지를 위한 nonce 검증
        require(nonces[from] == nonce, "Invalid nonce");

        // 서명 데이터 해시화
        bytes32 message = keccak256(abi.encodePacked(amount, to, nonce));

        // 서명 유효성 검증
        require(recoverSigner(message, signature) == from, "Invalid signature");

        // 트랜잭션 실행 로직 (토큰 전송 등)
        // ...

        // nonce 증가
        nonces[from]++;
    }

    function recoverSigner(bytes32 message, bytes memory sig)
        public
        pure
        returns (address)
    {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (uint8, bytes32, bytes32)
    {
        require(sig.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }
}
