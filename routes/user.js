var settings = require('../settings');
var utility = require('./utility');
var User = require('../models/user');

var setSessionLogin = function(req, username, privilege) {
    req.session.isLogin = true;
    req.session.username = username;
    req.session.privilege = privilege;
}

exports.showRegister = function(req, res) {
    if (req.session.isLogin) res.redirect('/');
    var info = utility.prepareRenderMessage(req);
    info.form = {};
    res.render('register', info);
};

exports.execRegister = function(req, res) {
    if (req.session.isLogin) res.redirect('/');
    res.locals.message = res.locals.message || [];
    var info = {
        name: req.body.name,
        password: settings.hashPassword(req.body.password),
        contact: {
            wechat: req.body.wechat,
            phone: req.body.phone
        }
    };
    var fallback = function(errors) {
        errors.forEach(function(err) {
            res.locals.message.push(err);
        });
        var info = utility.prepareRenderMessage(req);
        info.form = req.body;
        return res.render('register', info);
    }

    var item = new User(info);
    item.save(function(err) {
        if (err) return fallback(['Username used']);
        setSessionLogin(req, info.name, item.privilege);
        res.redirect('/');
    })
};

exports.showLogin = function(req, res) {
    if (req.session.isLogin) res.redirect('/');
    var info = utility.prepareRenderMessage(req);
    info.form = {};
    res.render('login', info);
};

exports.execLogin = function(req, res) {
    if (req.session.isLogin) res.redirect('/');
    res.locals.message = res.locals.message || [];
    var name = req.body.name;
    var password = settings.hashPassword(req.body.password);
    var fallback = function(errors) {
        errors.forEach(function(err) {
            res.locals.message.push(err);
        });
       var info = utility.prepareRenderMessage(req);
       info.form = req.body;
       console.log(info);
        return res.render('login', info);
    }

    User.findOne({name: name}, function(err, found) {
        if (err || !found || found.password != password)
            return fallback(['Invaild Username or Password']);
        setSessionLogin(req, name, found.privilege);
        res.redirect('/');
    });
};

exports.execLogout = function(req, res) {
    req.session.isLogin = false;
    req.session.username = "";
    req.session.privilege = "visitor";
    res.redirect('/');
}