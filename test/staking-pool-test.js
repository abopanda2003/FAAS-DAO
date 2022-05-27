const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Verify", function () {
    it("Should return the new greeting once it's changed", async function () {
        const Verifier = await ethers.getContractFactory("Verifier");
        const verify = await Verifier.deploy();
        let contract = await verify.deployed();
        console.log("deployed verify token: ", contract.address);

        let privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
        let wallet = new ethers.Wallet(privateKey);

        console.log(wallet.address);

        let message = "Hello World";

        // Sign the string message
        let flatSig = await wallet.signMessage(message);

        console.log("flat signature:", flatSig);
        
        // For Solidity, we need the expanded-format of a signature
        let sig = ethers.utils.splitSignature(flatSig);
        console.log("info: ", sig);
        // Call the verifyString function
        let recovered = await contract.verifyString(message, sig.v, sig.r, sig.s);

        console.log(recovered);
    });
});

// describe("Greeter", function () {
//     it("Should return the new greeting once it's changed", async function () {
//       const Greeter = await ethers.getContractFactory("Greeter");
//       const greeter = await Greeter.deploy("Hello, world!");
//       await greeter.deployed();
  
//       expect(await greeter.greet()).to.equal("Hello, world!");
  
//       const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
  
//       // wait until the transaction is mined
//       await setGreetingTx.wait();
  
//       expect(await greeter.greet()).to.equal("Hola, mundo!");
//     });
// });

describe("OpenDao Testing... ...", function () {

    let g_addrOwner, g_addrAccount1;
    let g_insStakingToken, g_insRewardToken;
    const fs = require('fs');
    it("Should deploy the open dao token", async function () {
        [ownerAccount, account1, _] = await ethers.getSigners();
        g_addrOwner = ownerAccount;
        g_addrAccount1 = account1;
        const openDaoTokenContract = await ethers.getContractFactory("OpenDAO");
        openDaoToken = await openDaoTokenContract.deploy("OpenDao Test Token", "ODTT", ownerAccount.address);
        let deployedToken = await openDaoToken.deployed();
        console.log("address:", deployedToken.address);
        let tokenName = await deployedToken.name();
        let tokenSymbol = await deployedToken.symbol();
        let dec = await deployedToken.decimals();
        let total = await deployedToken.totalSupply();
        console.log("token name:", tokenName);
        console.log("token symbol:", tokenSymbol);
        console.log("token decimal:", dec.toString());
        console.log("total supply:", total.toString());

        const privateKey = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        let wallet = new ethers.Wallet(privateKey);
        console.log("wallet:", wallet.address);

        let message = "hello";
        let signature = await wallet.signMessage(message);
        console.log(signature);
        let vrsInfo = ethers.utils.splitSignature(signature);
        console.log("v info: ", vrsInfo.v);
        console.log("r info: ", vrsInfo.r);
        console.log("s info: ", vrsInfo.s);
        // let addr = await deployedToken.verifyString(message, vrsInfo.v, vrsInfo.r, vrsInfo.s);
        // console.log("result:", addr);
        await deployedToken.claim(message, vrsInfo.v, vrsInfo.r, vrsInfo.s);
    });

    // it("Should deploy the staking token", async function () {
    //     [ownerAccount, account1, _] = await ethers.getSigners();
    //     g_addrOwner = ownerAccount;
    //     g_addrAccount1 = account1;
    //     const stakingTokenContract = await ethers.getContractFactory("TestERC20");
    //     stakingToken = await stakingTokenContract.deploy("Staking Token", "ST", 10**9);
    //     let deployedToken = await stakingToken.deployed();
    //     g_insStakingToken = deployedToken;
    //     console.log("address:", deployedToken.address);
    //     let tokenName = await deployedToken.name();
    //     let tokenSymbol = await deployedToken.symbol();
    //     let dec = await deployedToken.decimals();
    //     let owner = await deployedToken.getOwner();
    //     let total = await deployedToken.totalSupply();
    //     console.log("token name:", tokenName);
    //     console.log("token symbol:", tokenSymbol);
    //     console.log("token decimal:", dec.toString());
    //     console.log("total supply:", total.toString());
    //     console.log("owner address:", owner);
    // });

    // it("Should deploy the reward token", async function () {
    //     [ownerAccount, account1, _] = await ethers.getSigners();
    //     g_addrOwner = ownerAccount;
    //     g_addrAccount1 = account1;
    //     const rewardTokenContract = await ethers.getContractFactory("TestERC20");
    //     rewardToken = await rewardTokenContract.deploy("Reward Token", "RT", 2*(10**9));
    //     let deployedToken = await rewardToken.deployed();
    //     g_insRewardToken = deployedToken;
    //     console.log("address:", deployedToken.address);
    //     let tokenName = await deployedToken.name();
    //     let tokenSymbol = await deployedToken.symbol();
    //     let dec = await deployedToken.decimals();
    //     let owner = await deployedToken.getOwner();
    //     let total = await deployedToken.totalSupply();
    //     console.log("token name:", tokenName);
    //     console.log("token symbol:", tokenSymbol);
    //     console.log("token decimal:", dec.toString());
    //     console.log("total supply:", total.toString());
    //     console.log("owner address:", owner);
    // });

    // it("Should deploy the token pool", async function () {

    // });   

});