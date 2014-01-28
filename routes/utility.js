var settings = require('../settings');

exports.prepareRenderMessage = function(req) {
    return {
        username: req.session.username ? req.session.username : '',
        privilege: req.session.privilege ? req.session.privilege : 'visitor',
        isLogin: req.session.isLogin ? req.session.isLogin : false,
        settings: settings
    };
};

exports.generateRandomString = function() {
    var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var str = '';
    for (var i = 0; i < 16; ++i) {
        var idx = (Math.random() * (chars.length - 1)).toFixed(0);
        str += chars[idx];
    }
    return str;
};