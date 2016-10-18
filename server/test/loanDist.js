/**
 * Created by amita on 10/17/2016.
 */
var _ = require('lodash');

const _proposals = [
    {id: 1, amount: 250},
    {id: 2, amount: 50},
    {id: 3, amount: 70},
    {id: 4, amount: 500},
    {id: 5, amount: 140},
];

const _required = 500;

function getDistribution(proposals, required) {
    const lenders = [];
    let amount = 0;
    _.forEach(proposals, p => {
        const bal = required - amount;
        if(p.amount >= bal) {
            lenders.push({id: p.id, amount: bal});
            amount = amount + bal;
            return false;
        } else {
            const amt = p.amount;
            lenders.push({id: p.id, amount: amt});
            amount = amount + amt;
        }
    });

    return {lenders, amount};
}

console.log(getDistribution(_proposals, _required));