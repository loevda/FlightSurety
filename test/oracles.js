
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');
const truffleAssert = require('truffle-assertions');

contract('Oracles', async (accounts) => {

    const TEST_ORACLES_COUNT = 30;
    var config;
    before('setup contract', async () => {
        config = await Test.Config(accounts);

        // Watch contract events
        const STATUS_CODE_UNKNOWN = 0;
        const STATUS_CODE_ON_TIME = 10;
        const STATUS_CODE_LATE_AIRLINE = 20;
        const STATUS_CODE_LATE_WEATHER = 30;
        const STATUS_CODE_LATE_TECHNICAL = 40;
        const STATUS_CODE_LATE_OTHER = 50;

    });




    it('can register oracles', async () => {
        // ARRANGE
        let fee = await config.flightSuretyApp.REGISTRATION_FEE.call();
        // ACT
        for(let a=1; a<TEST_ORACLES_COUNT; a++) {

            await config.flightSuretyApp.registerOracle({ from: accounts[a], value: fee });
            let result = await config.flightSuretyApp.getMyIndexes.call({from: accounts[a]});
            console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);

        }
    });

    it('can request flight status', async () => {

        // ARRANGE
        let flight = 'ND1309'; // Course number
        const timestamp = Math.floor(Date.now() / 1000);
        console.log(timestamp);

        // Submit a request for oracles to get status information for a flight
        let resStatus = await config.flightSuretyApp.fetchFlightStatus(config.firstAirline, flight, timestamp);

        truffleAssert.eventEmitted(resStatus, 'OracleRequest', (ev) => {
            console.log('------');
            console.log(ev.airline);
            console.log(ev.timestamp.toNumber());
            console.log(ev.flight);
            console.log('-----');
            return ev.flight === flight && ev.airline === config.firstAirline;
        });



        // ACT
        // Since the Index assigned to each test account is opaque by design
        // loop through all the accounts and for each account, all its Indexes (indices?)
        // and submit a response. The contract will reject a submission if it was
        // not requested so while sub-optimal, it's a good test of that feature
        for(let a=1; a<TEST_ORACLES_COUNT; a++) {

            // Get oracle information
            let oracleIndexes = await config.flightSuretyApp.getMyIndexes.call({from: accounts[a]});

            for (let idx = 0; idx < 3; idx++) {

                let res = undefined;

                try {
                    // Submit a response...it will only be accepted if there is an Index match
                    //console.log(oracleIndexes);
                    let r = await config.flightSuretyApp.submitOracleResponse(oracleIndexes[idx],
                        config.firstAirline, flight, timestamp, 10, {from: accounts[a]});

                    truffleAssert.eventEmitted(r, 'OracleReport', (ev) => {
                            console.log(ev.key);
                            return ev.flight === flight;
                    });


                    try {
                        truffleAssert.eventEmitted(r, 'FlightStatusInfo', (ev) => {
                            console.log('FlightStatusInfo emmitted');
                            return ev.flight === flight;
                        });
                    }
                    catch (e) {
                        console.log('FlightStatusInfo not emmitted');
                    }




                    //res = await config.flightSuretyApp.submitOracleResponse(oracleIndexes[idx], config.firstAirline, flight, timestamp, STATUS_CODE_ON_TIME, {from: accounts[a]});
                }
                catch (e) {
                    // Enable this when debugging
                    //console.log(e.toString());
                    //res = false;
                    //console.log('\nError', idx, oracleIndexes[idx].toNumber(), flight, timestamp);
                }


            }

        }


    });


 
});
