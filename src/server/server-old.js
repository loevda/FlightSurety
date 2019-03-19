/**
 * Created by david2099 on 19/03/19.
 */
import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';
require('babel-polyfill');


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
let flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);


function init() {
    async () => {
        try {
            const address = flightSuretyApp._address;
            const owner = await accounts;
            console.log(owner[0]);
            console.log(address);
            web3.eth.defaultAccount = owner[0];
            await flightSuretyData.methods.authorizeCaller(address).call({from: owner[0]});
            let isAuth = await flightSuretyData.methods.isAuth(config.appAddress).call();
            console.log(isAuth);
        } catch (e) {
            console.log(e);
        }
    }
}




flightSuretyApp.events.OracleRequest({
    fromBlock: 0
}, function (error, event) {
    if (error) console.log(error)
    console.log(event)
});

const app = express();
app.get('/api', (req, res) => {
    res.send({
        message: 'An API for use with your Dapp!'
    })
})

init();

export default app;