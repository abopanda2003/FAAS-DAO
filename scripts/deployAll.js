const { ethers } = require("hardhat");
const fs = require('fs');
async function main() {
    const [deployer] = await ethers.getSigners();
    // console.log("Deploying contracts with the account: " + deployer.address);

    const Opendao = await ethers.getContractFactory("OpenDAO");
    const openDao = await Opendao.deploy("OpenDao Test Token", "ODTT", deployer.address);
    console.log("Deployed Open Dao contract: ",openDao.address);

    const privateKey = "0x"+fs.readFileSync('./.secret').toString();
    // console.log("private key:", privateKey);
    let wallet = new ethers.Wallet(privateKey);

    let signature = await wallet.signMessage("Hello World!")
    console.log(signature);
    let vrsInfo = ethers.utils.splitSignature(signature);
    console.log("vrs info: ", vrsInfo);

    let res = await openDao.claim(vrsInfo.v, vrsInfo.r, vrsInfo.s);
    console.log("result: ", res);

    let name = await openDao.name();
    let symbol = await openDao.symbol();
    let dec = await openDao.decimals();
    let total = await openDao.totalSupply();
    console.log("name: ", name);
    console.log("symbol: ", symbol);
    console.log("decimal: ", dec);
    console.log("total supply: ", total.toString());

}

main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
