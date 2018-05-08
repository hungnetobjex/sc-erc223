var Migrations = artifacts.require("./Migrations.sol");

module.exports = function (deployer, network, from) {
    var main_account ="0xa103879943d8db38f2048bd21c51f9c84950c087";
    var Web3 = require('web3');
    var web3Client = new Web3(deployer.provider);
    if (network == "rinkeby" || network == "ropsten") {
        web3Client.personal.unlockAccount(main_account, "again maze final build act spawn alter digital clever dinosaur uphold push", 5000);
    }

    console.log("Unlocking account: ", main_account);
    console.log("network: ", network);

    deployer.deploy(Migrations);
};
