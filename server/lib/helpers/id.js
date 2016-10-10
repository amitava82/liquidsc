/**
 * Created by amita on 10/10/2016.
 * A helper function to generate uniqueish db id.
 */
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

module.exports = (type) => {
        const prefix = (types[type] || 0) + '-';
        let text = '';
    for( var i=0; i < 2; i++ ){
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return prefix + Date.now() + '-' + text
};