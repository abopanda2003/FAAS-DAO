// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "./ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract OpenDAO is ERC20, EIP712 {
    uint256 public constant MAX_SUPPLY = uint248(1e14 ether);

    // for DAO.
    uint256 public constant AMOUNT_DAO = MAX_SUPPLY / 100 * 20;
    address public constant ADDR_DAO = 0x06bB1467b38d726b3eb39eB2FBAE6021feAE935F;

    // for staking
    uint256 public constant AMOUNT_STAKING = MAX_SUPPLY / 100 * 20;
    address public constant ADDR_STAKING = 0x7d28988391034A4C756f0c3E1A3E033175B04C77;

    // for liquidity providers
    uint256 public constant AMOUNT_LP = MAX_SUPPLY / 100 * 10;
    address public constant ADDR_LP = 0x709CD2aAAe592930616720115b6a3Dbdf1407664;
    uint256 public _totalSupply;
    // for airdrop
    uint256 public constant AMOUNT_AIREDROP = MAX_SUPPLY - (AMOUNT_DAO + AMOUNT_STAKING + AMOUNT_LP);

    constructor(string memory _name, string memory _symbol, address _signer) ERC20(_name, _symbol) EIP712("OpenDAO", "1") {
        _mint(ADDR_DAO, AMOUNT_DAO);
        _mint(ADDR_STAKING, AMOUNT_STAKING);
        _mint(ADDR_LP, AMOUNT_LP);
        _totalSupply = AMOUNT_DAO + AMOUNT_STAKING + AMOUNT_LP;
        // _balances[msg.sender] = _totalSupply;
        cSigner = _signer;
        console.log("opendao deployed!!");
    }

    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    // Returns the address that signed a given string message
    function verifyString(string memory message, uint8 v, bytes32 r,
                 bytes32 s) public view returns (address signer) {

        // The message header; we will fill in the length next
        string memory header = "\x19Ethereum Signed Message:\n000000";

        uint256 lengthOffset;
        uint256 length;
        assembly {
            // The first word of a string is its length
            length := mload(message)
            // The beginning of the base-10 message length in the prefix
            lengthOffset := add(header, 57)
        }

        // Maximum length we support
        require(length <= 999999);

        // The length of the message's length in base-10
        uint256 lengthLength = 0;

        // The divisor to get the next left-most message length digit
        uint256 divisor = 100000;

        // Move one digit of the message length to the right at a time
        while (divisor != 0) {

            // The place value at the divisor
            uint256 digit = length / divisor;
            if (digit == 0) {
                // Skip leading zeros
                if (lengthLength == 0) {
                    divisor /= 10;
                    continue;
                }
            }

            // Found a non-zero digit or non-leading zero digit
            lengthLength++;

            // Remove this digit from the message length's current value
            length -= digit * divisor;

            // Shift our base-10 divisor over
            divisor /= 10;

            // Convert the digit to its ASCII representation (man ascii)
            digit += 0x30;
            // Move to the next character and write the digit
            lengthOffset++;

            assembly {
                mstore8(lengthOffset, digit)
            }
        }

        // The null string requires exactly 1 zero (unskip 1 leading 0)
        if (lengthLength == 0) {
            lengthLength = 1 + 0x19 + 1;
        } else {
            lengthLength += 1 + 0x19;
        }

        // Truncate the tailing zeros from the header
        assembly {
            mstore(header, lengthLength)
        }

        // Perform the elliptic curve recover operation
        bytes32 check = keccak256(abi.encodePacked(header, message));

        return ecrecover(check, v, r, s);
    }

    bytes32 constant public MINT_CALL_HASH_TYPE = keccak256("mint(address receiver,uint256 amount)");

    address public immutable cSigner;

    function claim(string memory message, uint256 amountV, bytes32 r, bytes32 s) external {
        uint256 amount = uint248(amountV);
        // uint8 v = uint8(amountV >> 248);
        uint8 v = uint8(amountV);
        uint256 total = _totalSupply + amount;
        require(total <= MAX_SUPPLY, "OpenDAO: Exceed max supply");
        require(balanceOf(msg.sender) == 0, "OpenDAO: Claimed");

        address checker = verifyString(message, uint8(amountV), r, s);
        console.log("ecrecover: %s, signer: %s", checker, cSigner);
        require(checker == cSigner, "OpenDAO: Invalid signer");
        _totalSupply = total;

        _mint(msg.sender, amount);
    }

    function test() external {
        
    }
}