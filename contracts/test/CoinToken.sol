pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract TestERC20 is ERC20 {
    address m_addrOwner;

    constructor(string memory name, string memory symbol, uint256 mintAmount) ERC20(name, symbol) {
        m_addrOwner = msg.sender;
        _mint(msg.sender, mintAmount);
    }

    function getOwner() public view returns(address){
        return m_addrOwner;
    }
}
