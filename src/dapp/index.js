import DOM from './dom';
import Contract from './contract';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import 'startbootstrap-agency/vendor/bootstrap/css/bootstrap.css';
import 'startbootstrap-agency/css/agency.min.css';
import './css/agency.min.css';
import './css/app.css';
import 'startbootstrap-agency/vendor/bootstrap/js/bootstrap.min.js';
import './js/agency.js';
import Web3 from 'web3';

const web3 = new Web3();


(async() => {

    let result = null;

    let flights = [
        {
            statusCode: 0,
            flight: 'AF001',
            timestamp: Math.floor(Date.now() / 1000),
            departure: 'LONDON',
            destination: 'BUDAPEST'
        },
        {
            statusCode: 0,
            flight: 'AF002',
            timestamp: Math.floor(Date.now() / 1000),
            departure: 'LONDON',
            destination: 'MADRID'
        },
        {
            statusCode: 0,
            flight: 'AF003',
            timestamp: Math.floor(Date.now() / 1000),
            departure: 'LONDON',
            destination: 'PALERMO'
        },
        {
            statusCode: 0,
            flight: 'AF004',
            timestamp: Math.floor(Date.now() / 1000),
            departure: 'LONDON',
            destination: 'BERLIN'
        },
        {
            statusCode: 0,
            flight: 'AF005',
            timestamp: Math.floor(Date.now() / 1000),
            departure: 'PARIS',
            destination: 'BERLIN'
        },
        {
            statusCode: 0,
            flight: 'AF006',
            timestamp: Math.floor(Date.now() / 1000),
            departure: 'PARIS',
            destination: 'ROME'
        },
        {
            statusCode: 0,
            flight: 'AF007',
            timestamp: Math.floor(Date.now() / 1000),
            departure: 'LONDON',
            destination: 'PARIS'
        },
        {
            statusCode: 0,
            flight: 'AF008',
            timestamp: Math.floor(Date.now() / 1000),
            departure: 'PARIS',
            destination: 'BUDAPEST'
        },
        {
            statusCode: 0,
            flight: 'AF009',
            timestamp: Math.floor(Date.now() / 1000),
            departure: 'LONDON',
            destination: 'MILAN'
        },
        {
            statusCode: 0,
            flight: 'AF010',
            timestamp: Math.floor(Date.now() / 1000),
            departure: 'LONDON',
            destination: 'ROME'
        }
    ];

    for (let i=0; i<flights.length; i++) {
        $('#flightsRegister').append(`<option value="${i}">${flights[i].flight}-${flights[i].departure}-${flights[i].destination}</option>`);
    }

    let contract = new Contract('localhost', () => {

        // Read transaction

        contract.isOperational((error, result) => {
            if (error) {
                console.log(error);
                $('button').attr('disabled', true);
            } else {
                $('button').removeAttr('disabled');
            }
            let appStatus = DOM.elid("operational");
            appStatus.appendChild(DOM.div({className: 'led-box'}, error ? DOM.div({className: 'led-red'}) : DOM.div({className: 'led-green'})));
        });

        contract.getInsuranceCost((error, result) => {
            if (error) {
                console.log(error);
            } else {
                try {
                    let insPrice = DOM.elid("insPrice");
                    const price = web3.utils.fromWei(result, 'ether');
                    insPrice.appendChild(DOM.span({}, price));
                }
                catch(e) {
                    console.log(e)
                }
            }
        });

        contract.pendingWithdrawals((error, result) => {
            if (error) {
                console.log(error);
            }else{
                try {
                    const price = web3.utils.fromWei(result, 'ether');
                    let claimAmount = DOM.elid("claimAmount");
                    claimAmount.appendChild(DOM.span({}, price));
                } catch(e) {
                    console.log(e);
                }
            }
        });

        DOM.elid('registerAirline').addEventListener('click', () => {
            const airline = $("#newAirline").val();
            if (airline) {
                contract.registerAirline(airline, (error, result) => {
                    console.log(error, result);
                });
            } else {
                alert("You need to insert an airline address");
            }

        });


        DOM.elid('fundAirline').addEventListener('click', () => {
            contract.fundAirline((error, result) => {
                console.log(error, result);
            });
        });

        DOM.elid('registerFlight').addEventListener('click', () => {
            const flightNumber = $("#flightNumber").val();
            const departure = $("#departure").val();
            const destination = $("#destination").val();
            if (flightNumber && departure && destination) {
                contract.registerFlight(flightNumber, departure, destination, (error, result) => {
                    console.log(error, result);
                });
            } else {
                alert("Make sure to insert a flight number, departure and destination");
            }
        });

    });

})();







