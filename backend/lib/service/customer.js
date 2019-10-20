const types = require('./types');
const counter = require('./counter');

function authorize(client) {
    return client.auth.role === 'customer';
}

async function getTicket(info, client, db, all) {
    if(!authorize(client))
        return;
    if(!types.map(type => type.name).includes(info.requestType))
        return;
        
    const id = await db.incr('tickets:id');
    const num = await db.incr('queues:' + info.requestType + ':next');
    const numString = ('00' + (num % 1000)).slice(-3);
    const now = new Date();
    
    const ticket = {
        type: info.requestType,
        num: numString,
        datetime: now.toISOString()
    };

    await db.set('tickets:' + id, JSON.stringify(ticket));
    await db.rpush('queues:' + info.requestType, id);

    client.ticket = {
        id,
        requestType: info.requestType
    };

    const estimatedTime = await counter.getEstimatedTime(info.requestType, id, db);
    client.emit('ticketGenerated', {
        code: types.find(type => type.name === info.requestType).letter + numString,
        estimatedTime,
        datetime: now
    });
}

module.exports = {
    getTicket
};