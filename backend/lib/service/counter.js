const types = require('./types');

const counters_request_types = {
    1: [types[0]],
    2: [types[1]],
    3: [types[0], types[1]]
}

function authorize(client) {
    return client.auth.role === 'counter';
}

async function getEstimatedTime(requestType, ticketId, db) {
    const queue = await db.lrange('queues:' + requestType, '0', '-1');
    const precedingTickets = queue.map(ticketId => parseInt(ticketId)).indexOf(ticketId);
    const serviceTime = types.find(type => type.name === requestType).serviceTime;
    const numCounters = Object.keys(counters_request_types).filter(key => {
        return counters_request_types[key].some(type => type.name === requestType)
    }).length;

    return ((precedingTickets * serviceTime) / numCounters) + (serviceTime / 2);
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
        const length = await db.llen('queues:' + type.name);
        return Object.assign(type, { length });
    });
    const queues = await Promise.all(queuesGetter);
    const bestQueue = queues.filter(queue => queue.length > 0).reduce((best, current) => {
        return (best !== null && ((best.length > current.length) ||
            (best.length === current.length && best.serviceTime < current.serviceTime))) ?
            best : current;
    }, null);

    if(bestQueue === null)
        return;

    const id = await db.lpop('queues:' + bestQueue.name);
    const ticketData = await db.get('tickets:' + id);
    const ticket = JSON.parse(ticketData);

    const serving = {
        counter: client.auth.id,
        code: bestQueue.letter + ticket.num,
        datetime: ticket.datetime
    };
    client.emit('nextClient', serving);
    all.emit('serving', serving);

    Object.keys(all.sockets).filter(socketId => {
        return all.sockets[socketId].auth.role === 'customer' && all.sockets[socketId].ticket.requestType === bestQueue.name;
    }).forEach(async socketId => {
        const estimatedTime = await getEstimatedTime(bestQueue.name, all.sockets[socketId].ticket.id, db);
        all.sockets[socketId].emit('estimatedTimeChanged', { estimatedTime });
    });

    await db.hset('serving', client.auth.id, serving.code);
}

module.exports = {
    getEstimatedTime,
    getCounterInfo,
    serveNext
};