
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {
    
    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0x69e1CB5cFcA8A311586e3406ed0301C06fb839a2",
        "0xF014343BDFFbED8660A9d8721deC985126f189F3",
        "0x0E79EDbD6A727CfeE09A2b1d0A59F7752d5bf7C9",
        "0x9bC1169Ca09555bf2721A5C9eC6D69c8073bfeB4",
        "0xa23eAEf02F9E0338EEcDa8Fdd0A73aDD781b2A86",
        "0x6b85cc8f612d5457d49775439335f83e12b8cfde",
        "0xcbd22ff1ded1423fbc24a7af2148745878800024",
        "0xc257274276a4e539741ca11b590b9447b26a8051",
        "0x2f2899d6d35b1a48a4fbdc93a37a72f264a9fca7"
    ];
    /*let testAddresses = [
        // ADD YOU GANACHE ACCOUNTS HERE
        "0x9ddbd2a8b0a76fb540d4377514a94ddfc6d775bf",
        "0xce3bf475bf23d016ce87c3b49552d03ed66eca34",
        "0x7e77a0abcb6b691cf6d9ea33ef6e672ccb9b670c",
        "0x646d73a65d3e5287bb59138f567a511fc0bb6f30",
        "0xaddafeccb6ce293973a013db7a748329acef4baa",
        "0x2c1639a895b09ff25814dc9d7f756d8326e7475c",
        "0x2bda4ee87ba4e2a8fe56094072d243360dc78964",
        "0xd620060d36dcb3a26809ee2029fd3de1a49f1a15",
        "0x7be1d12fd18f4c69d744f1bcce6b7bd987dd8576",
        "0x998e6eacca506c181735899d41df0bf44874a2de"
    ];*/


    let owner = accounts[0];
    let firstAirline = accounts[1];

    let flightSuretyData = await FlightSuretyData.new(firstAirline);
    let flightSuretyApp = await FlightSuretyApp.new();

    
    return {
        owner: owner,
        firstAirline: firstAirline,
        weiMultiple: (new BigNumber(10)).pow(18),
        testAddresses: testAddresses,
        flightSuretyData: flightSuretyData,
        flightSuretyApp: flightSuretyApp
    }
}

module.exports = {
    Config: Config
};