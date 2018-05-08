require('babel-register');
require('babel-polyfill');
var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "0x47fb2b";
var mnemonic = "lawn total entire enjoy shove office cinnamon primary execute weird picture venue";

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*", // Match any network id,
            // from: "0x3ae88fe370c39384fc16da2c9e768cf5d2495b48",
            // gas:4700000
        },
        live: {
            host: "34.204.184.211",
            port: 8101,
            network_id: "23923239", // Match any network id
            from: "0x5050e958037a965fec7fa3043b09f8c53191bfd7"
        },
        rinkeby: {
            host: "34.204.184.211",
            port: 8545,
            network_id: "4", // Match any network id
            from: "0x02899893639f238031C91a8BfD798CE009a12235",
            gas: 4000000,
            gasPrice: 30000000000
        },
        ropsten: {
            host: "34.204.184.211",
            port: 8112,
            network_id: "3", // Match any network id,
            from: "0xa103879943d8db38f2048bd21c51f9c84950c087",
            gas:4700000,
            gasPrice: 40000000000
        }
    }
};
