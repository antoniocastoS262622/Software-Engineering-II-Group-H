function authorize(client) {
    return client.auth.role === 'admin';
}

function getAdminInfos(info, client, db, all) {
    if (!authorize(client))
        return;

    client.emit('countersInfo', {
        // Send request types and counters infos
    })
}

module.exports = {
    getAdminInfos,
};