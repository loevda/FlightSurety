import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {
        let config = Config[network];
        this.initWeb3();
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
        this.airlines = [];
        this.passengers = [];
        this.initialize(callback);
        let self = this;
        // listen metamask accounts change and reload account
        window.ethereum.on('accountsChanged', function (accounts) {
            self.initialize(callback);
        })
    }


    initWeb3 = async (config) => {
        // Modern dapp browsers...
        if (window.ethereum) {
            this.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            this.web3 = new Web3(web3.currentProvider);
        }
        // Non-dapp browsers...
        else {
            this.web3 = new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws'));
        }
    }



    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
            if (accts) {
                this.account = accts[0];
                console.log(`Now using ${this.account} as default account.`);
            }
            callback();
        });
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({ from: this.account}, callback);
    }

    isFunded(callback) {
        let self = this;
        self.flightSuretyData.methods.isAirlineFunded(self.owner)
            .call(callback);
    }

    /*registerAirline(callback) {
        let self = this;
        self.flightSuretyApp.methods.registerAirline(self.airlines[1])
            .call( {from: this.owner}, callback);
    }*/

    fundAirline(callback) {
        let self = this;
        console.log(self.airlines[0]);
        self.flightSuretyApp.methods
            .fundAirline()
            .send({ from: this.account, value: self.web3.utils.toWei('12', 'ether'), gas:3000000}, callback);
    }

    /*fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        } 
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, payload);
            });
    }*/
}