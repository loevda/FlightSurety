import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';
const bodyParser = require("body-parser");
require("babel-core/register");
require("babel-polyfill");



try {
    let config = Config['localhost'];
    let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
    let accounts = web3.eth.getAccounts();
    web3.eth.defaultAccount = web3.eth.accounts[0];
    let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
    let flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);
    let numOracles = config.numOracles < accounts.length ? config.numOracles : (accounts.length -1);
} catch(e) {
    // you might need to start ganache
    // and deploy your contracts if you get there
    console.log("\x1b[41m", "Please check that ganache is running ....");
    console.log(e);
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
                            description: "An API for use with your Dapp!"
                        }
                    }
                ]
            })
        });
    }
}


/*flightSuretyApp.events.OracleRequest({
    fromBlock: 0
  }, function (error, event) {
    if (error) console.log(error)
    console.log(event)
});


*/
const app = new FlightSuretyServer();
export default app;


