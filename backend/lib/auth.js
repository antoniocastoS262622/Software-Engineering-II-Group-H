function login(credentials) {
    console.log(credentials);
    if(credentials.role === 'counter' && [1,2,3].includes(credentials.id))
        return credentials;
    return null;
}

module.exports = {
    login
};