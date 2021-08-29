const crypto = require('crypto');
const connection = require('../config/database');
const models = connection.models;

const genPassword = (password) => {
    let salt = crypto.randomBytes(32).toString('hex');
    let genhash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genhash
    }
}

const validPassword = (password, hash, salt) => {
    let hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

const confirmPassword = async (id, password) => {
    let result = false;
    await models.User.findById(id)
        .then((user) => {
            if (!user) {
                return false
            }

            const isValid = validPassword(password, user.hash, user.salt);
            console.log()
            if (isValid) {
                result = true;
            } else {
                result = false;
            }
        })
        .catch((err) => {
                console.log(err);
                result = false;
            }
        );
    return result;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.confirmPassword = confirmPassword;