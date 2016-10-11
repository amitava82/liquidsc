/**
 * Created by amita on 10/10/2016.
 * A helper function to generate uniqueish db id.
 */
var shortid = require('shortid');

const types = {
    ADMIN: 1,
    BUYER: 2,
    LENDER: 3,
    BORROWER: 4,
    proposal: 7,
    app: 8,
    loan: 9
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