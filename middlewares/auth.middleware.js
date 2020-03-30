const jwt = require('jsonwebtoken')
function jwtSignUser(user) {
    return jwt.sign(user, process.env.JWTSECRET, {
        expiresIn: "60d"
    })
}

function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

module.exports = {
    async auth(req, res, next) {
        try {
            var auth_token = getTokenFromHeader(req)
            if(!auth_token) {
            }
            next() 
        } catch (err) {
            console.log(err.message)
        }
    }
}