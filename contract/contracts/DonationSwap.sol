// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";

contract TokenSwap {
    address private constant UNISWAP_V2_ROUTER =
        0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24;
    address private constant USDT = 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9;
    address private constant WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;
    address private constant UNISWAP_V2_FACTORY =
        0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9;

    IUniswapV2Router02 public uniswapRouter;
    IUniswapV2Factory public uniswapFactory;

    constructor() {
        uniswapRouter = IUniswapV2Router02(UNISWAP_V2_ROUTER);
        uniswapFactory = IUniswapV2Factory(UNISWAP_V2_FACTORY);
    }

    receive() external payable {}
    function swapExactTokensForUSDT(
        address token,
        uint amountIn,
        address multisigCA
    ) public {
        require(approveTokensForSwap(token, amountIn), "approve failed");

        uint amountOutMin = 1;

        if (uniswapFactory.getPair(token, USDT) != address(0)) {
            address[] memory path = new address[](2);
            path[0] = token;
            path[1] = USDT;

            uniswapRouter.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                multisigCA, //기부단체 지갑주소로 설정
                block.timestamp + 10 minutes
            );
        } else {
            address[] memory path = new address[](3);
            path[0] = token;
            path[1] = WETH;
            path[2] = USDT;

            uniswapRouter.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                multisigCA, //기부단체 지갑주소로 설정
                block.timestamp + 10 minutes
            );
        }
    }

    function getPath(address token) public view returns (address) {
        return uniswapFactory.getPair(token, USDT);
    }

    function approveTokensForSwap(
        address token,
        uint amountIn
    ) public returns (bool) {
        bool success = IERC20(token).approve(UNISWAP_V2_ROUTER, amountIn);
        require(success, "Token approval failed");
        return success;
    }
}
