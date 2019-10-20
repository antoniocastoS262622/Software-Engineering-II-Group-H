function login(credentials) {
    if(credentials.role === 'customer')
        return credentials;
    if(credentials.role === 'board')
        return credentials;
    if(credentials.role === 'counter' && [1,2,3].includes(credentials.id) && credentials.password === ('counter' + credentials.id))
        return credentials;
    if(credentials.role === 'admin' && credentials.password === 'admin')
        return credentials;
    return null;
}

module.exports = {
    login
};