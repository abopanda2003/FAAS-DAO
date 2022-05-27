// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "../escrow/uniswap/IUniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";


contract BabyDogeBurner is Ownable {
    address public tokenAddress;
    address public lpTokenAddress;

    mapping(address => bool) public whiteListed;

    address public immutable PancakeRouter;
    address public immutable WBNB;

    constructor() public {
        tokenAddress = 0xc748673057861a797275CD8A068AbB95A902e8de;
        lpTokenAddress = 0xc736cA3d9b1E90Af4230BD8F9626528B3D4e0Ee0;
        PancakeRouter = 0x10ED43C718714eb63d5aA57B78B54704E256024E;
        WBNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    }

    receive() external payable {}

    fallback() external payable {}

    function whiteList(address _address) public onlyOwner {
        whiteListed[_address] = true;
    }

    function depositLP(uint256 _amount) public {
        require(whiteListed[msg.sender] == true, "Not Allowed");
        IERC20(lpTokenAddress).transferFrom(msg.sender, address(this), _amount);
        IERC20(lpTokenAddress).approve(PancakeRouter, _amount);
        (, uint256 wbnbamount) = IUniswapV2Router02(PancakeRouter)
            .removeLiquidity(
                address(tokenAddress),
                WBNB,
                _amount,
                1,
                1,
                address(this),
                block.timestamp + 1200
            );

        IWETH(WBNB).withdraw(wbnbamount);

        (bool sent, bytes memory data) = msg.sender.call{
            value: address(this).balance
        }("");
        require(sent, "Failed to send Ether");
    }

    function transferTokens(uint256 _amount, address _address) public onlyOwner {
        IERC20(tokenAddress).transfer(
            _address,
            _amount
        );
    }
}

interface IWETH {
    function deposit() external payable;

    function transfer(address to, uint256 value) external returns (bool);

    function withdraw(uint256) external;
}