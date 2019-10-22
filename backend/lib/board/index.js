function authorize(client) {
    return client.auth.role === 'board';
}

async function getCurrentSituation(info, client, db, all) {
    if(!authorize(client))
        return;

    const current = await db.hgetall('serving');
    client.emit('currentSituation', current);
}

module.exports = {
    getCurrentSituation
};