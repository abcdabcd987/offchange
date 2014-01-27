var settings = require('../settings');
var utility = require('./utility');
var Goods = require('../models/goods');

exports.showNew = function(req, res) {
    if (!req.session.isLogin) res.redirect('/login');
    var info = utility.prepareRenderMessage(req);
    info.actionUrl = '/goods/new';
    info.form = {};
    res.render('goods_new', info);
};

exports.execNew = function(req, res) {
    if (!req.session.isLogin) res.redirect('/login');
    res.locals.message = res.locals.message || [];
    var info = {
        title: req.body.title,
        content: req.body.content,
        tags: [],
        user: req.session.username,
        status: 'published'
    };
    req.body.tags = req.body.tags ? req.body.tags : '';
    req.body.tags.split(',').forEach(function(item) {
        var tag = item.trim();
        if (tag) info.tags.push(tag);
    });
    console.log(info.tags);
    var fallback = function(errors) {
        errors.forEach(function(err) {
            res.locals.message.push(err);
        });
        var info = utility.prepareRenderMessage(req);
        info.actionUrl = '/goods/new';
        info.form = req.body;
        return res.render('goods_new', info);
    };

    var item = new Goods(info);
    item.save(function(err, saved) {
        if (err) return fallback(['Unknown Error']);
        res.redirect('/goods/show/' + saved.id);
    });
};

exports.showList = function(req, res) {
    var condition = {};
    switch (req.query.status) {
        case 'finished': condition.status = 'finished'; break;
        case 'published': condition.status = 'published'; break;
    }
    if (req.query.user)
        condition.user = req.query.user;
    var fallback = function(err) {
        console.log(err);
        return res.redirect('/');
    }
    Goods.find(condition).count(function(err, count) {
        if (err) return fallback(err);
        var page = Number(req.query.page || '1');
        var skip = settings.perpage * (page-1);
        Goods.find(condition).sort('-postDate').skip(skip).limit(settings.perpage).exec(function(err, goodsList) {
            if (err) fallback(err);
            var info = utility.prepareRenderMessage(req);
            info.page = page;
            info.goodsList = goodsList;
            info.condition = condition;
            info.totpage = Math.ceil(count / settings.perpage);
            if (!info.condition.status) info.condition.status = '';
            if (!info.condition.user) info.condition.user = '';
            return res.render('goods_list', info);
        });
    });
};

exports.show = function(req, res) {
    var id = req.params.id;
    console.log(id);
    Goods.findById(id, function(err, doc) {
        console.log(doc);
        if (err || !doc) return res.redirect('/');
        var info = utility.prepareRenderMessage(req);
        info.goods = doc;
        res.render('goods_show', info);
    });
};