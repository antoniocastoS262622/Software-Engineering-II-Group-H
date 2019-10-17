const types = require('./types');

const counters_request_types = {
    1: [types[0]],
    2: [types[1]],
    3: [types[0], types[1]]
}

function authorize(client) {
    return client.auth.role === 'counter';
}

function getCounterInfo(info, client, db, all) {
    if(!authorize(client))
        return;

    client.emit('counterInfo', {
        id: client.auth.id,
        requestTypes: counters_request_types[client.auth.id].map(type => type.name)
    });
}

async function serveNext(info, client, db, all) {
    if(!authorize(client))
        return;
        
    const queuesGetter = counters_request_types[client.auth.id].map(async type => {
        const length = await db.llen(type.name);
        return Object.assign(type, { length });
    });
    const queues = await Promise.all(queuesGetter);
    const bestQueue = queues.filter(queue => queue.length > 0).reduce((best, current) => {
        return (best != null && (best.length < current.length) ||
            (best.length === current.length && best.serviceTime < current.serviceTime)) ?
            best : current;
    }, null);

    if(bestQueue === null)
        return;

    const id = await db.lpop('queues:' + bestQueue.name);
    const ticketData = await db.get('tickets:' + id);
    const ticket = JSON.parse(ticketData);

    const serving = {
        counter: client.auth.id,
        code: queue.letter + ticket.num,
        datetime: ticket.datetime
    };
    client.emit('nextClient', serving);
    all.emit('serving', serving);
}

module.exports = {
    getCounterInfo,
    serveNext
};