import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';
const bodyParser = require("body-parser");
const cors = require('cors');
require("babel-polyfill");
/*import 'core-js/shim';
import 'regenerator-runtime/runtime';*/

const config = Config['localhost'];
const web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
const accounts = web3.eth.getAccounts();
web3.eth.defaultAccount = "0xE58d0BD823112817532e2687818116f64C648868"; //web3.eth.accounts[0];
const flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
const flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);


class ContractsServer  {

    constructor () {
        this.flightsForPurchase = [];
        this.flightsLanded = [];
    }

    init = async () => {
        // add App contract as authorizedCaller
        // to data contract
        try {
            const address = flightSuretyApp._address;
            const accs = await accounts;
            await flightSuretyData.methods.authorizeCaller(address).send({from: accs[0]});
        } catch(err) {
           console.log(err.toString());
           console.error('\x1b[31m Check that Ganache is running and that your config contracts ' +
               'are correctly deployed.');
           process.exit();
        }
        this.registerOracles();
        this.listenEvents();
        this.getRegisteredFlights();
    }

    registerOracles = async () => {
        // registering oracles
        const fee = await flightSuretyApp.methods.REGISTRATION_FEE().call();
        const accs = await accounts;
        // lowest number of total accounts or config.numOracles
        const numOracles = config.numOracles < accs.length
            ? config.numOracles : (accs.length -1)
        // registration loop
        for (var i = 1; i < numOracles; i++) {
            try {
                await flightSuretyApp.methods.registerOracle().send({
                    from: accs[i], value: fee, gas:3000000 //VM errors with no gas
                });
            } catch (err) {
                console.log(err.toString());
            }
        }
    }

    getRegisteredFlights = async () => {
        const numRegisteredFlights =
            await flightSuretyData.methods.numRegisteredFlights().call();
        console.log(`${numRegisteredFlights} registered flights`);
        // reset flights list
        this.flightsForPurchase = [];
        this.flightsLanded = [];
        for (let i=0; i < parseInt(numRegisteredFlights); i++) {
            try {
                let flightKey = await flightSuretyData.methods.getFlightKeyByIndex(i).call();
                let flight = await flightSuretyData.methods.flights(flightKey).call();
                flight.flightKey = flightKey;
                if (flight.status_code === "0") {
                    this.flightsForPurchase.push(flight);
                }else{
                    this.flightsLanded.push(flight);
                }
            } catch(e) {
                console.log(e);
            }
        }
    }

    listenEvents = async () => {

        flightSuretyApp.events.OracleReport()
            .on('error', (error) => {
                console.log(error);
            })
            .on('data', (data) => {
                console.log(data);
            });


        flightSuretyApp.events.OracleRequest()
            .on('error', (error) => {
                console.log(error);
            })
            .on('data', (data) => {
                console.log(data);
            });

        flightSuretyApp.events.FlightStatusInfo()
            .on('error', (error) => {
                console.log(error);
            })
            .on('data', (data) => {
                console.log(data);
            });

        flightSuretyData.events.AirlineFunded()
            .on('error', (error) => {
                console.log(error);
            })
            .on('data', (data) => {
                console.log(data);
            });

        flightSuretyData.events.AirlineRegistered()
            .on('error', (error) => {
                console.log(error);
            })
            .on('data', (data) => {
                console.log(data);
            });

        flightSuretyData.events.FlightRegistered()
            .on('error', (error) => {
                console.log(error);
            })
            .on('data', (data) => {
                console.log(data);
                // update the list of flights
                this.getRegisteredFlights();
            });
    }
}


class FlightSuretyServer {

    /**
     * Constructor that allows initialize the class
     */
    constructor(constractsServer) {
        this.app = express();
        this.contractServer = contractsServer;
        this.initExpressMiddleWare();
        this.getInfo();
        this.getFlights();
        this.initControllers();
    }

    initControllers() {
        require("./controllers/ErrorController.js")(this.app);
    }

    initExpressMiddleWare() {
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json());
        this.app.use(cors());
    }

    getFlights() {
        this.app.get("/flights", (req, res) => {
            //this.contractServer.getRegisteredFlights();
            res.json({
                flightsForPurchase: this.contractServer.flightsForPurchase,
                flightsLanded: this.contractServer.flightsLanded
            });
        })
    }


    getInfo() {
        this.app.get("/", (req, res) => {
            res.json({
                endpoints: [
                    {
                        "/": {
                            method: "GET",
                            description: `An API for use with your Dapp`
                        }
                    }
                ]
            })
        });
    }
}

const contractsServer = new ContractsServer();
contractsServer.init();
const app = new FlightSuretyServer(contractsServer);
export default app;


