// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReferral {
    function addReferral(
        address _referrer, // address that is referring user
        address _user, // user that is being refered
        uint256 _percent //percent of reward going to user
    ) external;

    function addAmount(address _referred, uint256 _amount) external;

    function getStatus() external returns (bool);

    function checkUserReferrer(address _user) external view returns (address);
}
