var settings = require('../settings');
var utility = require('./utility');
var User = require('../models/user');

function setSessionLogin(req, user) {
    req.session.user = {
        isLogin: true,
        name: user.name,
        privilege: user.privilege,
        wechat: user.contact.wechat,
        phone: user.contact.phone
    };
};

exports.showRegister = function(req, res) {
    if (req.session.user.isLogin) res.redirect('/');
    var info = utility.prepareRenderMessage(req);
    info.form = req.body.form || {};
    info.title = "Register";
    res.render('user_register', info);
};

exports.execRegister = function(req, res) {
    if (req.session.user.isLogin) res.redirect('/');
    res.locals.message = res.locals.message || [];
    var fallback = function(errors) {
        errors.forEach(function(err) {
            res.locals.message.push(err);
        });
        var info = utility.prepareRenderMessage(req);
        info.form = req.body;
        info.title = "Register";
        return res.render('user_register', info);
    }
    if (!req.body.password)
        return fallback(['Password cannot be empty']);

    var info = {
        name: req.body.name,
        password: settings.hashPassword(req.body.password || ''),
        contact: {
            wechat: req.body.wechat,
            phone: req.body.phone
        }
    };
    var item = new User(info);
    item.save(function(err) {
        if (err) return fallback(['Username used']);
        setSessionLogin(req, info);
        res.redirect('/');
    })
};

exports.showLogin = function(req, res) {
    if (req.session.user.isLogin) res.redirect('/');
    var info = utility.prepareRenderMessage(req);
    info.form = req.body.form || {};
    info.title = "Login";
    res.render('user_login', info);
};

exports.execLogin = function(req, res) {
    if (req.session.user.isLogin) res.redirect('/');
    res.locals.message = res.locals.message || [];
    var name = req.body.name;
    var password = settings.hashPassword(req.body.password);
    var fallback = function(errors) {
        errors.forEach(function(err) {
            res.locals.message.push(err);
        });
        var info = utility.prepareRenderMessage(req);
        info.form = req.body;
        info.title = "Login";
        return res.render('user_login', info);
    }

    User.findOne({name: name}, function(err, found) {
        if (err || !found || found.password != password)
            return fallback(['Invaild Username or Password']);
        setSessionLogin(req, found);
        res.redirect('/');
    });
};

exports.execLogout = function(req, res) {
    req.session.destroy(function() {
        res.redirect('/'); 
    });
}

exports.showModify = function(req, res) {
    if (!req.session.user.isLogin) res.redirect('/');
    var info = utility.prepareRenderMessage(req);
    info.form = req.body.form || {};
    info.title = "Modify User";
    res.render('user_modify', info);
};

exports.execModify = function(req, res) {
    if (!req.session.user.isLogin) res.redirect('/');
    res.locals.message = res.locals.message || [];
    var oldpasswd = settings.hashPassword(req.body.oldPassword || '');
    var newpasswd = req.body.newPassword ? settings.hashPassword(req.body.newPassword) : oldpasswd;
    var info = {
        password: newpasswd,
        name: req.session.user.name,
        privilege: req.session.user.privilege,
        contact: {
            wechat: req.body.wechat || req.session.user.wechat,
            phone: req.body.phone || req.session.user.phone
        }
    };
    var fallback = function(errors) {
        errors.forEach(function(err) {
            res.locals.message.push(err);
        });
        var info = utility.prepareRenderMessage(req);
        info.form = req.body;
        info.title = "Modify User";
        return res.render('user_modify', info);
    }

    User.findOne({name: req.session.user.name}, function(err, doc) {
        if (err) return fallback(['Database failure']);
        if (!doc || doc.password != oldpasswd) return fallback(['Invaild username or password']);

        User.findOneAndUpdate({name: req.session.user.name}, info, function(err) {
            if (err) return fallback(['Unknown error']);
            setSessionLogin(req, info);
            res.redirect('/');
        });
    });
};