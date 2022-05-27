const { expect } = require("chai");
const { ethers, provider } = require("hardhat");
const { formatEther, parseEther } = require("@ethersproject/units");

describe("PoolFactory", function () {
  let owner,
    addr1,
    addr2,
    addr3,
    addr4,
    poolFactory,
    smartChefFactory,
    babyDoge;
  let fakeBD = "0xAD3B7ffD749678FD025704588ab2EB9DFe74B025";
  let bnb = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  let router, factory;

  it("Should deploy the pool factory", async function () {
    [owner, addr1, addr2, addr3, addr4, _] = await ethers.getSigners();

    // const PoolFactory = await ethers.getContractFactory(
    //   "contracts/PoolFactory.sol:SmartChefFactory"
    // );
    // poolFactory = await PoolFactory.deploy(fakeBD, addr1.address);
    // await poolFactory.deployed();

    // expect(await poolFactory.owner()).to.equal(owner.address);
  });

  it("Should deploy fake BabyDoge token  ", async function () {
    const BabyDoge = await ethers.getContractFactory("TestERC20");
    let amount = "50000000000000000000000";
    babyDoge = await BabyDoge.deploy(amount);

    console.log(
      "Owner BabyDoge Balance",
      formatEther(await babyDoge.balanceOf(owner.address))
    );

    await babyDoge.transfer(addr2.address, ethers.utils.parseUnits("7500", 18));
    console.log(
      "Addr2 BabyDoge Balance",
      formatEther(await babyDoge.balanceOf(addr2.address))
    );

    console.log("BabyDooge Address", babyDoge.address);
    //expect(await babyDoge.balanceOf(addr2.address)).to.equal("7500.0");
  });

  it("Should deploy reward and stake token ", async function () {
    const RewardToken = await ethers.getContractFactory("TestERC20");
    let amount = "50000000000000000000000";
    rewardToken = await RewardToken.deploy(amount);
    await rewardToken.deployed();

    const StakedToken = await ethers.getContractFactory("TestERC20");

    stakedToken = await StakedToken.deploy(amount);
    await stakedToken.deployed();

    console.log("Owner Balance", await rewardToken.balanceOf(owner.address));
    console.log("Owner Balance", await stakedToken.balanceOf(owner.address));
    expect(formatEther(await rewardToken.balanceOf(owner.address))).to.equal(
      "50000.0"
    );
  });

  it("Should deploy reward and stake token ", async function () {
    const RewardToken2 = await ethers.getContractFactory("TestERC20");
    let amount = "50000000000000000000000";
    rewardToken2 = await RewardToken2.deploy(amount);
    await rewardToken2.deployed();

    const StakedToken2 = await ethers.getContractFactory("TestERC20");

    stakedToken2 = await StakedToken2.deploy(amount);
    await stakedToken2.deployed();

    console.log("Owner Balance", await rewardToken2.balanceOf(owner.address));
    console.log("Owner Balance", await stakedToken2.balanceOf(owner.address));
    expect(formatEther(await rewardToken2.balanceOf(owner.address))).to.equal(
      "50000.0"
    );
  });

  it("Should users have staked tokens", async function () {
    await stakedToken
      .connect(owner)
      .transfer(addr1.address, parseEther("1000.0"));
    await stakedToken
      .connect(owner)
      .transfer(addr2.address, parseEther("1000.0"));

    expect(await stakedToken.balanceOf(addr1.address)).to.equal(
      parseEther("1000.0")
    );
    expect(await stakedToken.balanceOf(addr2.address)).to.equal(
      parseEther("1000.0")
    );
  });

  it("Should SmartChefFactory be deployed", async function () {
    const SmartChefFactory = await ethers.getContractFactory(
      "SmartChefFactory"
    );
    smartChefFactory = await SmartChefFactory.deploy(
      babyDoge.address,
      addr3.address
    );
    await smartChefFactory.deployed();
  });

  it("Should SmartChefInitializable be deployed", async function () {
    const chefProvider = smartChefFactory.provider;
    chefProvider.pollingInterval = 1;
    smartChefFactory.on("NewSmartChefContract", async (address) => {
      console.log(`SmartChefInitializable address: ${address}`);
      SmartChefInitializable = await ethers.getContractAt(
        "contracts/PoolFactory.sol:SmartChefInitializable",
        address
      );
    });

    startBlock = await ethers.provider.getBlockNumber();

    let overrides = {
      value: ethers.utils.parseEther("0.5"),
    };

    await smartChefFactory.deployPool(
      stakedToken.address,
      rewardToken.address,
      parseEther("0.2"),
      startBlock + 40,
      startBlock + 50,
      parseEther("150.0"),
      owner.address,
      false,
      overrides
    );

    await new Promise((res) => setTimeout(() => res(null), 300));
    let poolAddress;
    await smartChefFactory.on("NewSmartChefContract", (poolAddress) => {
      console.log("New Pool Address", poolAddress);
    });
  });

  it("Should be able to let anyone deploy a pool and pay with weth", async function () {
    let currentBlock = await ethers.provider.getBlockNumber();
    console.log(
      "Balance of service address before",
      await ethers.provider.getBalance(addr3.address)
    );
    let overrides = {
      value: ethers.utils.parseEther("0.5"),
    };
    await smartChefFactory
      .connect(addr2)
      .deployPool(
        stakedToken2.address,
        rewardToken2.address,
        parseEther("0.2"),
        startBlock + 35,
        startBlock + 55,
        parseEther("150.0"),
        owner.address,
        false,
        overrides
      );

    console.log(
      "Balance of service address after",
      await ethers.provider.getBalance(addr3.address)
    );
    let poolAddress;
    await smartChefFactory.on("NewSmartChefContract", (poolAddress) => {
      console.log("New Pool Address", poolAddress);
    });

    await new Promise((res) => setTimeout(() => res(null), 300));
  });

  it("Should be able to let anyone deploy a pool with tokens", async function () {
    let currentBlock = await ethers.provider.getBlockNumber();

    await babyDoge.connect(addr2).approve(smartChefFactory.address, "50000");
    console.log(
      "address 2 balance before",
      formatEther(await babyDoge.balanceOf(addr2.address))
    );
    console.log(
      "Service address balance before",
      formatEther(await babyDoge.balanceOf(addr3.address))
    );
    await smartChefFactory
      .connect(addr2)
      .deployPool(
        stakedToken.address,
        rewardToken.address,
        parseEther("0.2"),
        startBlock + 35,
        startBlock + 55,
        parseEther("150.0"),
        owner.address,
        true
      );

    console.log(
      "address 2 balance after",
      formatEther(await babyDoge.balanceOf(addr2.address))
    );
    console.log(
      "Service address balance after",
      formatEther(await babyDoge.balanceOf(addr3.address))
    );

    let poolAddress;
    await smartChefFactory.on("NewSmartChefContract", (poolAddress) => {
      console.log("New Pool Address", poolAddress);
    });

    await new Promise((res) => setTimeout(() => res(null), 300));
  });


  it("Should be able send tokens to the pool contract", async function () {


  });
  
  it("should get multiplyer ", async function () {

    
  });
  it("Should allow user to stake tokens", async function () {

    
  });
    it("Should allow 1 hour to pass on the chain", async function () {

    
  });

  it("Should allow user to see pending rewards tokens", async function () {

    
  });

  


});
