// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";

interface IERC20Permit {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract Donation {
    struct TokenData {
        address token;
        uint256 amount;
    }

    struct SignatureData {
        address owner;
        TokenData[] tokens;
        uint256 nonce;
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    struct MultiPermit {
        address owner;
        TokenData[] tokens;
        uint256 nonce;
        uint256 deadline;
    }

    mapping(address => uint256) public nonces;
    bytes32 public DOMAIN_SEPARATOR;
    bytes32 public constant TOKEN_DATA_TYPEHASH = keccak256("TokenData(address token,uint256 amount)");
    // bytes32 public constant MULTIPERMIT_TYPEHASH = keccak256("MultiPermit(address owner,TokenData[] tokens,uint256 nonce,uint256 deadline)");
    bytes32 public constant MULTIPERMIT_TYPEHASH = keccak256("MultiPermit(address owner,TokenData[] tokens,uint256 nonce,uint256 deadline)TokenData(address token,uint256 amount)");
    
    constructor() {
        DOMAIN_SEPARATOR = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256(bytes("MultiTokenDonation")),  // Domain Name
            keccak256(bytes("1")),                   // Version
            block.chainid,                           // Chain ID
            address(this)                            // Contract address
        ));
    }

    function name(SignatureData calldata signature) public pure returns(SignatureData memory){
        return signature;
    }

    function executeBatch(SignatureData calldata signature) external {
        require(signature.deadline >= block.timestamp, "Signature expired");

        // 여러 개의 토큰 데이터를 해시화하여 하나의 해시로 결합
        bytes32[] memory tokenDataHashes = new bytes32[](signature.tokens.length);
        for (uint256 i = 0; i < signature.tokens.length; i++) {
            tokenDataHashes[i] = keccak256(abi.encode(
                TOKEN_DATA_TYPEHASH,
                signature.tokens[i].token,
                signature.tokens[i].amount
            ));
        }

        // 모든 토큰 해시를 결합한 최종 토큰 데이터 해시 생성
        bytes32 tokenDataHashCombined = keccak256(abi.encodePacked(tokenDataHashes));

        // 최종 structHash 생성
        bytes32 structHash = keccak256(abi.encode(
            MULTIPERMIT_TYPEHASH,
            signature.owner,
            tokenDataHashCombined,
            signature.nonce,
            signature.deadline
        ));

        bytes32 hash = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            structHash
        ));


        

        address signer = ecrecover(hash, signature.v, signature.r, signature.s);

        // if (signer != signature.owner) {
        //     revert(string(abi.encodePacked(
        //         "Invalid signature. Recovered: ",
        //         Strings.toHexString(uint160(signer), 20),
        //         ", Expected: ",
        //         Strings.toHexString(uint160(signature.owner), 20),
        //         ", v: ", Strings.toString(signature.v),
        //         ", r: ", Strings.toHexString(uint256(signature.r)),
        //         ", s: ", Strings.toHexString(uint256(signature.s)),
        //         ", MULTIPERMIT_TYPEHASH: ", Strings.toHexString(uint256(MULTIPERMIT_TYPEHASH)),
        //         ", tokenDataHashCombined: ", Strings.toHexString(uint256(structHash)),
        //         ", nonce: ", Strings.toHexString(uint256(signature.nonce)),
        //         ", deadline: ", Strings.toHexString(uint256(signature.deadline)),
        //         ", DOMAIN_SEPARATOR: ", Strings.toHexString(uint256(DOMAIN_SEPARATOR))
        //     )));
        // }

        require(signer == signature.owner, "Invalid signature");
        require(nonces[signature.owner] == signature.nonce, "Invalid nonce");
        nonces[signature.owner]++;
        

        for (uint256 i = 0; i < signature.tokens.length; i++) {
            IERC20Permit token = IERC20Permit(signature.tokens[i].token);
            token.permit(
                signature.owner,
                address(this),
                signature.tokens[i].amount,
                signature.deadline,
                signature.v,
                signature.r,
                signature.s
            );

            try token.permit(
                signature.owner,
                address(this),
                signature.tokens[i].amount,
                signature.deadline,
                signature.v,
                signature.r,
                signature.s
            ) {
                require(
                    token.transferFrom(
                        signature.owner,
                        address(this),
                        signature.tokens[i].amount
                    ),
                    "Transfer failed"
                );
            } catch Error(string memory reason) {

                revert(string(abi.encodePacked("Permit failed: ", reason)));
            } 
        
        }
    }
}
