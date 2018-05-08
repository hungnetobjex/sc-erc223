// Import lib
const moment = require('moment-timezone');
const assert = require('assert');
const Web3EthAbi = require('web3-eth-abi');
const Web3 = require('web3');
const BigNumber = require('bignumber.js');

const MyToken = artifacts.require("MyToken");

function getUnixTime(x) {
    return moment.tz(x, "America/Los_Angeles").valueOf() / 1000;
}

module.exports = function (deployer, network, from) {
    const web3Client = new Web3(deployer.provider);
    var main_account = "0xa103879943d8db38f2048bd21c51f9c84950c087";

    if (network == "rinkeby" || network == "ropsten") {
        web3Client.personal.unlockAccount(main_account, "secret key", 5000);
    }

    async function deployMyToken() {
        await deployer.deploy(MyToken);
        let token = await MyToken.deployed();
        console.log('Token: ', token.address);
        console.log("----------------------- Done deploy CrowdsaleToken ---------------------");
        console.log("Approve crowdsale amount");
        await token.approve(main_account, 1000000000, {"from": main_account});
        console.log("Done approve");
    }

    deployMyToken();

};
