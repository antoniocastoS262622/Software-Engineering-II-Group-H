const counter = require('./counter');
const customer = require('./customer');
const admin = require('./admin');

module.exports = {
    getCounterInfo: counter.getCounterInfo,
    serveNext: counter.serveNext,
    
    getTicket: customer.getTicket,

    getAdminInfos: admin.getAdminInfos,
};