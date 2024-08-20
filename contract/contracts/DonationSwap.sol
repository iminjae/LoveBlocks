// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";

contract TokenSwap {
    address private constant UNISWAP_V2_ROUTER = 0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24;
    address private constant USDT = 0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9;

    IUniswapV2Router02 public uniswapRouter;

    constructor() {
        uniswapRouter = IUniswapV2Router02(UNISWAP_V2_ROUTER);
    }

    function swapExactTokensForUSDT(address token, uint amountIn, uint amountOutMin, uint deadline) external {
        IERC20(token).approve(UNISWAP_V2_ROUTER, amountIn);

        address[] memory path;
        path[0] = token;
        path[1] = USDT;

        uint[] memory amountsOut = uniswapRouter.getAmountsOut(amountIn, path);
        uint amountOutMin = amountsOut[1];

        // Step 2: 슬리피지 허용 범위 적용
        amountOutMin = 1;

        // Step 3: 스왑 수행
        uniswapRouter.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            "0xd290C0d10F4Aebc213DdB0f73453321804Dfd423",
            deadline
        );
    }
}
