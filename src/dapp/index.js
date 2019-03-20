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

    let contract = new Contract('localhost', () => {

        // Read transaction

        contract.isOperational((error, result) => {
            console.log(error,result);
            let appStatus = DOM.elid("operational");
            appStatus.appendChild(DOM.div({className: 'led-box'}, error ? DOM.div({className: 'led-red'}) : DOM.div({className: 'led-green'})));

            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ]);
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


/*function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-4 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-8 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);
}*/







