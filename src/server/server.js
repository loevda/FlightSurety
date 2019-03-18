import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';
const bodyParser = require("body-parser");
require("babel-core/register");
require("babel-polyfill");


// set up contract data

const config = Config['localhost'];
const web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
const accounts = web3.eth.getAccounts();
web3.eth.defaultAccount = web3.eth.accounts[0];
const flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
const flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);

class ContractsServer  {

    constructor () {
    }

    init = async () => {
        // add App contract as authorizedCaller
        // to data contract
        try {
            const address = await flightSuretyApp._address;
            await flightSuretyData.methods.authorizeCaller(address).call();
        } catch(err) {
           console.log(err.toString());
        }
        this.registerOracles();
        this.listenEvents();
    }

    registerOracles = async () => {
        // registering oracles
        const fee = await flightSuretyApp.methods.REGISTRATION_FEE().call();
        const accs = await accounts;
        // lowest numner of total accounts or config.numOracles
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
    }
}


class FlightSuretyServer {

    /**
     * Constructor that allows initialize the class
     */
    constructor() {
        this.app = express();
        this.getInfo();
        this.initControllers();
    }

    initControllers() {
        require("./controllers/ErrorController.js")(this.app);
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
const app = new FlightSuretyServer();
export default app;


