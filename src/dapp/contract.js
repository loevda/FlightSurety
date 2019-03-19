import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {
        /*let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
        this.initialize(callback, config);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
        console.log('app address')
        console.log(config.appAddress)*/

        let config = Config[network];
        this.initWeb3();
        this.flightSuretyApp = new self.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.flightSuretyData = new self.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
        this.airlines = [];
        this.passengers = [];
        this.initialize(callback);
    }


    initWeb3 = async (config) => {
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
        }
        // Non-dapp browsers...
        else {
            return new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws'));
        }
    }



    initialize(callback) {
        window.web3.eth.getAccounts((error, accts) => {
           
            this.owner = accts[0];

            let counter = 1;
            
            while(this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner}, callback);
    }

    getAuth(callback) {
        let self = this;
        self.flightSuretyData.methods.authorizeCaller(self.flightSuretyApp.options.address)
            .call({from: this.owner}, callback);
        self.flightSuretyData.methods
            .isAuth(self.owner)
            .call(callback);
    }

    isFunded(callback) {
        let self = this;
        self.flightSuretyData.methods.isAirlineFunded(self.airlines[0])
            .call(callback);
    }

    registerAirline(callback) {
        let self = this;
        self.flightSuretyApp.methods.registerAirline(self.airlines[1])
            .call( {from: self.airlines[0]}, callback);
    }

    authorizeCaller(callback) {
        let self = this;
        self.flightSuretyData.methods.authorizeCaller(self.flightSuretyApp._address)
            .call( {from: self.owner}, callback);
    }

    fundAirline(callback) {
        let self = this;
        console.log(self.airlines[0]);
        self.flightSuretyApp.methods
            .fundAirline()
            .send({ from: self.airlines[0], value: window.web3.utils.toWei('12', 'ether'), gas:3000000}, callback);
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