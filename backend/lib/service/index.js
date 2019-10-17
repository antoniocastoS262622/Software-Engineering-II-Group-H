const counter = require('./counter');
const customer = require('./customer');

module.exports = {
    getCounterInfo: counter.getCounterInfo,
    serveNext: counter.serveNext,
    
    getTicket: customer.getTicket
};