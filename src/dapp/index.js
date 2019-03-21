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




(async() => {

    let result = null;

    let flights = () => {
        let flightsArr = [];

        for (let i = 0; i < 10; i++) {
            let flight = {
                statusCode: 0,
                flight: `AF00${i}`,
                timestamp:  Math.floor(Date.now() / 1000),
                destination: `BUDAPEST`
            }
            flightsArr.push(flight);
        }
        return flightsArr;
    }


    flights().map((flight) => {
        let tr = DOM.tr();
        let td = DOM.td();
        let d = new Date(flight.timestamp*1000)
        let s = `${flight.flight}-${flight.destination}-${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
        s.split('').map((c) => {
            td.appendChild(DOM.div({className: 'paneSmall'}, `${c}`));
        });
        tr.appendChild(td);
        DOM.elid("flightsTable").appendChild(tr);
    });


    formatSplitText = () => {

    }



    let contract = new Contract('localhost', () => {

        // Read transaction

        contract.isOperational((error, result) => {
            if (error)
                DOM.
            console.log(error,result);
            let appStatus = DOM.elid("operational");
            appStatus.appendChild(DOM.div({className: 'led-box'}, error ? DOM.div({className: 'led-red'}) : DOM.div({className: 'led-green'})));
        });


        DOM.elid('addAirline').addEventListener('click', () => {
            /*contract.authorizeCaller((error, result) => {
             alert(error, result);
             console.log(error, result);
             })*/
            contract.isFunded((error, result) => {
                console.log(error, result);
            });
        });


        DOM.elid('fundAirline').addEventListener('click', () => {
            /*contract.authorizeCaller((error, result) => {
                alert(error, result);
                console.log(error, result);
            })*/
            contract.fundAirline((error, result) => {
                console.log(error, result);
            });
        });


        // User-submitted transaction
        /*DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
        })*/

    });

})();







