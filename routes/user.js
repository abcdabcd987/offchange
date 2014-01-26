var settings = require('../settings');
var User = require('../models/user');

var setSessionLogin = function(req, username, privilege) {
    req.session.login = true;
    req.session.username = username;
    req.session.privilege = privilege;
}

exports.showRegister = function(req, res) {
    if (req.session.login) res.redirect('/');
    res.render('register', { form: {} });
};

exports.execRegister = function(req, res) {
    if (req.session.login) res.redirect('/');
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
        return res.render('register', { form: req.body });
    }

    var item = new User(info);
    item.save(function(err) {
        if (err) return fallback(['Username used']);
        setSessionLogin(req, name, item.privilege);
        res.redirect('/');
    })
};

exports.showLogin = function(req, res) {
    if (req.session.login) res.redirect('/');
    res.render('login', { form: {} });
};

exports.execLogin = function(req, res) {
    if (req.session.login) res.redirect('/');
    res.locals.message = res.locals.message || [];
    var name = req.body.name;
    var password = settings.hashPassword(req.body.password);
    var fallback = function(errors) {
        errors.forEach(function(err) {
            res.locals.message.push(err);
        });
        return res.render('login', { form: req.body });
    }

    User.findOne({name: name}, function(err, found) {
        if (err || !found || found.password != password)
            return fallback(['Invaild Username or Password']);
        setSessionLogin(req, name, found.privilege);
        res.redirect('/');
    });
};

exports.execLogout = function(req, res) {
    req.session.login = false;
    req.session.username = "";
    req.session.privilege = "visitor";
    res.redirect('/');
}