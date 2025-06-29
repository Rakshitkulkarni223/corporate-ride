const jwt = require('jsonwebtoken');
const moment = require('moment');
const { ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } = require('../helpers/constants');

const generateJWT = async (user, secret, type) => {
    let expires;

    if (type === "ACCESS") {
        expires = moment().add(ACCESS_TOKEN_EXPIRES);
    } else if (type === 'REFRESH') {
        expires = moment().add(REFRESH_TOKEN_EXPIRES);
    }

    const payload = {
        id: user.id,
        iat: moment().unix(),
        exp: expires.unix(),
        type
    }

    const token = await jwt.sign(payload, secret);

    return {
        token,
        expires: expires.toDate()
    }
}

const clearTokens = async (req, res) => {
    try{
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            signed: true,
        });
        return true;
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    generateJWT,
    clearTokens
}