// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";

contract TokenSwap {
    address private constant UNISWAP_V2_ROUTER =
        0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24;
    address private constant USDT = 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9;

    IUniswapV2Router02 public uniswapRouter;

    constructor() {
        uniswapRouter = IUniswapV2Router02(UNISWAP_V2_ROUTER);
    }

    receive() external payable {}
    function swapExactTokensForUSDT(address token, uint amountIn) external {
        require(approveTokensForSwap(token, amountIn), "approve failed");

        address[] memory path = new address[](2);
        path[0] = token;
        path[1] = USDT;

        uint[] memory amountsOut = uniswapRouter.getAmountsOut(amountIn, path);
        uint amountOutMin = amountsOut[1];

        // Apply slippage tolerance
        amountOutMin = 1;

        // Perform the swap
        uniswapRouter.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            0x2491c2bf81b2B3a32D1a474220C64b2D85EB6Db6, //기부단체 지갑주소로 설정
            block.timestamp + 10 minutes
        );
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
