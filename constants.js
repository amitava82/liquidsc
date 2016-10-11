module.exports = {
    roles: {
        'BUYER': 'BUYER',
        'BORROWER': 'BORROWER',
        'LENDER': 'LENDER',
        'ADMIN': 'ADMIN'
    },
    status: {
        PENDING: 'PENDING',
        APPROVED: 'APPROVED',
        UNDER_REVIEW: 'UNDER_REVIEW',
        REJECTED: 'REJECTED'

    },
    adminEmail: process.env.ADMIN_EMAIL || 'amitava82+admin@gmail.com',
    senderEmail: 'noreply@example.com',
    subjects: {

    }
};