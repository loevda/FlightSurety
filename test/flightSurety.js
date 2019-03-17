var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');
var web3 = require('web3');

contract('Flight Surety Tests', async (accounts) => {
    var config;
    before('setup contract', async () => {
        config = await Test.Config(accounts);
        await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
    });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`(multiparty) has correct initial isOperational() value`, async function () {

    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();

    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
      
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.flightSuretyData.setOperatingStatus(false);

      let reverted = false;
      try 
      {
          await config.flightSurety.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true);

  });

    it('(registered airline) can deposit fund', async () => {

        // ACT FUNDING
        try {
            await config.flightSuretyApp.fundAirline({from: config.firstAirline, value: config.weiMultiple*12});
        }
        catch(e) {
            console.log(e.toString());
        }
        let result = await config.flightSuretyData.isAirlineFunded(config.firstAirline);

        // ASSERT
        assert.equal(result, true, "Airline hasn't yet provided funding");

    });


  it('(funded airline) can register an Airline using registerAirline() if number of funded airlines is below treshold', async () => {
    
    // ARRANGE
    let newAirline = accounts[2];

      // ACT
    try {
        await config.flightSuretyApp.registerAirline(newAirline, {from: config.firstAirline});
    }
    catch(e) {
        console.log(e.toString());
    }
    let result = await config.flightSuretyData.isAirlineRegistered(newAirline);

    // ASSERT
    assert.equal(result, true, "Airline should not be able to register another airline if it hasn't provided funding");

  });



  //check if up to 4 airlines can registered before treshold kicks in

    it('(4 airlines) can be registered before theshold kicks in', async () => {
        // ARRANGE
        let airline3 = accounts[3];
        let airline4 = accounts[4];
        let airline5 = accounts[5];
        let result = undefined;

        // ACT
        try {
            await config.flightSuretyApp.registerAirline(airline3, {from: config.firstAirline});
        }
        catch(e) {
        }
        let result3 = await config.flightSuretyData.isAirlineRegistered(airline3);
        // ASSERT
        assert.equal(result3, true, "Third airline should be able to be registered");

        // ACT
        try {
            await config.flightSuretyApp.registerAirline(airline4, {from: config.firstAirline});
        }
        catch(e) {
        }
        let result4 = await config.flightSuretyData.isAirlineRegistered(airline4);
        // ASSERT
        assert.equal(result4, true, "Fourth airline should be able to be registered");

        // ACT

        try {
            await config.flightSuretyApp.registerAirline(airline5, {from: config.firstAirline});
        }
        catch(e) {
            // should revert
        }
        let result5 = await config.flightSuretyData.isAirlineRegistered(airline5);;
        // ASSERT
        assert.equal(result5, false, "Fifth airline should not be able to be registered without passing the treshold");
    });


    it('(airline) cannot register another airline that is already registered', async () => {

        // ARRANGE
        let newAirline = accounts[2];
        let result = undefined;

        // ACT
        try {
            result = await config.flightSuretyApp.registerAirline(newAirline);
        }
        catch(e) {
            //should revert here
            result = false;
        }
        // ASSERT
        assert.equal(result, false, "Airline should not be able to register an already registered airline");
    });


    it('(airline) can be register using the multiparty consensus', async () => {

        // ARRANGE
        let airline2 = accounts[2];
        let airline3 = accounts[3];
        let airline4 = accounts[4];
        let airline5 = accounts[5];

        // ACT -- let airline fund themselves
        // should check also that extra value is returned to the sender
        try {
            await config.flightSuretyApp.fundAirline({from: airline2, value: config.weiMultiple*12});
            await config.flightSuretyApp.fundAirline({from: airline3, value: config.weiMultiple*12});
            await config.flightSuretyApp.fundAirline({from: airline4, value: config.weiMultiple*12});
        }
        catch(e) {
            //console.log(e.toString());
        }

        try {
            await config.flightSuretyApp.registerAirline(airline5, {from: airline2});
        }
        catch(e) {

        }

        // check if airline can register twice the same airline
        let resDuplicate = undefined;
        try {
            resDuplicate = await config.flightSuretyApp.registerAirline(airline5, {from: airline2});
        }
        catch(e) {
            // should revert
            resDuplicate = false;
        }

        assert.equal(resDuplicate, false, "A registered airline should not be able to register twice the same airline.");

        try {
            await config.flightSuretyApp.registerAirline(airline5, {from: airline3});
        }
        catch(e) {

        }

        let result = await config.flightSuretyData.isAirlineRegistered(airline5);

        // ASSERT
        assert.equal(result, true, "Fifth airline should now be registered using multiparty consensus.");

    });


    it('(flight) funded airline can register flight', async () => {

        // ARRANGE
        let newAirline = accounts[2];
        let result = undefined;

        // ACT
        try {
            result = await config.flightSuretyApp.registerAirline(newAirline);
        }
        catch(e) {
            //should revert here
            result = false;
        }
        // ASSERT
        assert.equal(result, false, "Airline should not be able to register an already registered airline");
    });

});
