function login(credentials) {
    if(credentials.role === 'customer')
        return credentials;
    if(credentials.role === 'counter' && [1,2,3].includes(credentials.id) && credentials.password === ('counter' + credentials.id))
        return credentials;
    return null;
}

module.exports = {
    login
};