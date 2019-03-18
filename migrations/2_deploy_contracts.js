const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const fs = require('fs');
var argv = require('minimist')(process.argv.slice(2), {string: ['firstAirline']});

module.exports = function(deployer) {
    let firstAirline;
    try {
        firstAirline = argv['firstAirline']
            ? argv['firstAirline']
            : '0xce3bf475bf23d016ce87c3b49552d03ed66eca34'; // if you want you can update the default first airline here
    }catch(e) {
        console.log(e);
    }
    console.log(firstAirline);
    deployer.deploy(FlightSuretyData, firstAirline)
    .then(() => {
        return deployer.deploy(FlightSuretyApp, FlightSuretyData.address)
                .then(() => {
                    let config = {
                        localhost: {
                            url: 'http://localhost:7545',//updated to Ganache AppImage port
                            dataAddress: FlightSuretyData.address,
                            appAddress: FlightSuretyApp.address
                        }
                    }
                    fs.writeFileSync(__dirname + '/../src/dapp/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
                    fs.writeFileSync(__dirname + '/../src/server/config.json',JSON.stringify(config, null, '\t'), 'utf-8');
                });
    });
}