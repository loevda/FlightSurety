# FlightSurety

FlightSurety is a sample application project for Udacity's Blockchain course.

## Install
__Notes:__ The project has been tested with __Truffle v5.0.4__, __Solidity 0.5.0__ and __npm v10.15.1__
This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), dApp scaffolding (using HTML, CSS and JS) and server app scaffolding.<br />
__

To install, download or clone the repo, then:

1. `npm install`
2. `truffle compile`
3. `truffle migrate --reset --network ganache`<br />
    __Warning__: Network Port has been updated to 7545 for Ganache AppImage
4. npm run server
5. npm run dapp

## Develop Client

To run truffle tests:

`truffle test ./test/flightSurety.js`
`truffle test ./test/oracles.js`

To use the dapp:

`truffle migrate`
`npm run dapp`

To view dapp:

`http://localhost:8000`

## Develop Server

`npm run server`
`truffle test ./test/oracles.js`

## Deploy

To build dapp for prod:
`npm run dapp:prod`

Deploy the contents of the ./dapp folder


## Credits

##### Image: 
* https://pixabay.com/photos/airport-airplane-aircraft-fly-3511342/


## Resources

* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Remix Solidity IDE](https://remix.ethereum.org/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)