const request_types = [
    'accounts',
    'packages'
];
const counters_request_types = {
    1: [request_types[0]],
    2: [request_types[1]],
    3: [request_types[0], request_types[1]]
}

function getCounterInfo(info, client, db, all) {
    client.emit('counterInfo', {
        id: client.auth.id,
        requestTypes: counters_request_types[client.auth.id]
    });
}

module.exports = {
    getCounterInfo
};