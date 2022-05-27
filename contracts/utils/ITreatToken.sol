pragma solidity 0.8.0;

interface IBabyDogeGoldenTreat {
    function getPriorVotes(address account, uint256 blockNumber)
        external
        view
        returns (uint256);

    function balanceOf(address account) external view returns (uint256);
}
