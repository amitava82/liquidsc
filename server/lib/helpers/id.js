/**
 * Created by amita on 10/10/2016.
 * A helper function to generate uniqueish db id.
 */
var shortid = require('shortid');

const types = {
    ADMIN: 'A',
    BUYER: 'B',
    LENDER: 'L',
    BORROWER: 'S',
    proposal: 'P',
    app: 'X',
    loan: 'L'
};
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = (type, isShort) => {
    const prefix = (types[type] || 0) + '-';

    if(isShort) {
        return prefix + shortid.generate();
    }

    let text = '';
    for (var i = 0; i < 2; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return prefix + Date.now() + '-' + text
};