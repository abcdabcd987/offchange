var crypto = require('crypto');
var express = require('express');
var mongoStore = require('connect-mongo')(express);

module.exports = {
    perpage: 16,
    defaultPort: 3000,
    secret: "KSsgEQXJDEmZASk6plm7",
    databaseInfo: {
        db: 'offchange',
    },
    hashPassword: function(password) {
        return crypto.createHash('sha512').update(password + "RpC9Dv96mHCu7lOVAeUS").digest('hex');
    }
};