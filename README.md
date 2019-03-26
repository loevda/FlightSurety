# FlightSurety 
![DApp screenshot](src/dapp/img/dapp.png?raw=true "Flight Surety DApp")

## Install

This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), dApp scaffolding (using HTML, CSS and JS) and server app scaffolding.<br />
<br />
__Notes:__ The project has been tested with __Truffle v5.0.4__, __Solidity 0.5.6__ and __node v10.15.1__<br />
__

To install, download or clone the repo, then:

1. `npm install`
2. `truffle compile`
3. `truffle migrate --reset --network ganache --firstAirline=FIRST_AIRLINE_ADDRESS --numOracles=NUM_OF_ORACLES`<br />
    __Warning__: Network Port has been updated to 7545 for Ganache AppImage
4. `npm run server` <br />
    __Warning__: Start the server first because the data contract auhtorization call is made from the server
5. `npm run dapp` <br />
    The DApp is runing at `http://localhost:8000`

## Testing

##### To run truffle tests:
1. Update the mnemonic in truffle.js with your key seed.
2. `truffle dev`
3. `migrate --reset`
4. `test`

##### Feature of the tests:
1. Check the operational status of the contracts;
2. Funding or ailine;
3. Register airlines with the multiparty threshold;
4. Flight registration by airline;
5. Passenger purchase of insurance;
6. Check Oracles registration;
7. Watch for FlightStusInfo event;


## Deploy

To build dapp for prod:
`npm run dapp:prod`

Deploy the contents of the ./dapp folder


## Credits

##### Theme
*https://startbootstrap.com/themes/agency/

##### Dashboard style
* https://codepen.io/chonz0/pen/NGRbWj

##### Green light
* https://codepen.io/fskirschbaum/pen/MYJNaj

##### Images: 
* https://pixabay.com/photos/airport-vnukovo-plane-terminal-1406162/


## Resources

* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Remix Solidity IDE](https://remix.ethereum.org/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)