var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "cabbage carpet reject power doctor public abandon behave asthma rose pretty marine";

module.exports = {
  networks: {
      ganache: {
          host: '127.0.0.1',
          port: 7545,
          network_id: '*', // Match any network id
      },
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:9545/", 0, 50);
      },
      network_id: '*',
      gas: 9999999
    }
  },
 compilers: {
     solc: {
         version: "^0.5.0"
     }
 }
};