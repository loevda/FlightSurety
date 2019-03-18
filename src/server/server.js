import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';
require("babel-core/register");
require("babel-polyfill");

/*let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);*/

class FlightSuretyServer {

    /**
     * Constructor that allows initialize the class
     */
    constructor() {
        this.app = express();
        this.initExpress();
        this.initWeb3();
        this.initControllers();
        this.getInfo();
        this.start();
    }

    initExpress() {
        this.app.set("port", 8000);
    }

    initWeb3 = async () =>  {
        this.config = Config['localhost'];
        try {
            this.web3 =
                await new Web3(new Web3.providers.WebsocketProvider(
                    this.config.url.replace('http', 'ws')));
            this.accounts = await  this.web3.eth.getAccounts();
            this.web3.eth.defaultAccount = this.accounts[0];
            this.flightSuretyData =
                new this.web3.eth.Contract(FlightSuretyData.abi, this.config.dataAddress);
            this.flightSuretyApp =
                new this.web3.eth.Contract(FlightSuretyApp.abi, this.config.appAddress);
            console.log('---- AVAILABLE ACCOUNTS ----')
            console.log(this.accounts);
            console.log('----------------------------');
        } catch(e) {
            // you might need to start ganache
            // and deploy your contracts if you get there
            console.log("\x1b[41m", "Please check that ganache is running ....");
            console.log(e);
        }


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

    start() {
        let self = this;
        this.app.listen(this.app.get("port"), () => {
            console.log(`Server Listening for port: ${self.app.get("port")}`);
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





export default new FlightSuretyServer();


