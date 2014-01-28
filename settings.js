var crypto = require('crypto');
var path = require('path');
var express = require('express');
var mongoStore = require('connect-mongo')(express);

module.exports = {
    perpage: 8,
    defaultPort: 3000,
    upload: "upload",
    secret: "KSsgEQXJDEmZASk6plm7",
    databaseInfo: {
        db: 'offchange',
    },
    hashPassword: function(password) {
        return crypto.createHash('sha512').update(password + "RpC9Dv96mHCu7lOVAeUS").digest('hex');
    }
};

module.exports.uploadPath = path.join(__dirname, 'public', module.exports.upload);