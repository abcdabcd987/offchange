var fs = require('fs');
var gm = require('gm');
var path = require('path');
var settings = require('../settings');
var utility = require('./utility');
var Goods = require('../models/goods');

var processUpload = function(files) {
    var pathList = [];
    for (var i = 0; i < files.length; ++i) {
        var type = files[i].type;
        var size = files[i].size;
        if ((type != 'image/jpeg' && type != 'image/png') || (!size || size > 10*1024*1024)) {
            try {
                fs.unlinkSync(files[i].path);
            } catch (err) {
                console.log('cannot remove [%s]', files[i].path);
            }
        } else {
            var str = utility.generateRandomString() + Date.now();
            var ext = type == 'image/jpeg' ? '.jpg' : '.png';
            var newpath = path.join(settings.uploadPath, str + ext);
            var thumb = path.join(settings.uploadPath, 'thumb', str + ext);
            try {
                fs.renameSync(files[i].path, newpath);
                gm(newpath).resize(500).quality(60).write(thumb, function(err) { });
                pathList.push(str + ext);
            } catch (err) {
                console.log('cannot rename [%s] to [%s]', files[i].path, newpath);
            }
        }
    }
    return pathList;
}

exports.showNew = function(req, res) {
    if (!req.session.user.isLogin) return res.redirect('/user/login');
    var info = utility.prepareRenderMessage(req);
    info.actionUrl = '/goods/new';
    info.form = {};
    res.render('goods_new', info);
};

exports.execNew = function(req, res) {
    if (!req.session.user.isLogin) return res.redirect('/user/login');
    res.locals.message = res.locals.message || [];
    var info = {
        title: req.body.title,
        content: req.body.content,
        tags: [],
        user: req.session.user.name,
        status: 'published',
        images: []
    };
    req.body.tags = req.body.tags ? req.body.tags : '';
    req.body.tags.split(',').forEach(function(item) {
        var tag = item.trim();
        if (tag) info.tags.push(tag);
    });
    var fallback = function(errors) {
        errors.forEach(function(err) {
            res.locals.message.push(err);
        });
        var info = utility.prepareRenderMessage(req);
        info.actionUrl = '/goods/new';
        info.form = req.body;
        return res.render('goods_new', info);
    };

    if (!info.title || !info.content || !info.tags.length) {
        return fallback(['No field can be empty']);
    }
    var pathList = [];
    if (typeof(req.files) !== 'undefined' && typeof(req.files.images) !== 'undefined') {
        pathList = processUpload(req.files.images);
    }
    for (var i = 0; i < pathList.length; ++i) {
        info.images.push({ path: pathList[i] });
    }

    var item = new Goods(info);
    item.save(function(err, saved) {
        if (err) return fallback(['Unknown Error']);
        setTimeout(function(){res.redirect('/goods/' + saved.id);}, 100);
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
    if (req.query.tags)
        condition.tags = req.query.tags;
    var fallback = function(errors) {
        errors.forEach(function(err) {
            res.locals.message.push(err);
        });
        return res.redirect('/');
    }
    Goods.find(condition).count(function(err, count) {
        if (err) return fallback(['Database Failure']);
        var page = Number(req.query.page || '1');
        var skip = settings.perpage * (page-1);
        Goods.find(condition).sort('-postDate').skip(skip).limit(settings.perpage).exec(function(err, goodsList) {
            if (err) fallback('Database Failure');
            var info = utility.prepareRenderMessage(req);
            info.page = page;
            info.goods = goodsList;
            info.condition = condition;
            info.totpage = Math.ceil(count / settings.perpage);
            if (!info.condition.status) info.condition.status = '';
            if (!info.condition.user) info.condition.user = '';
            if (!info.condition.tags) info.condition.tags = '';
            return res.render('goods_list', info);
        });
    });
};

exports.show = function(req, res) {
    var id = req.params.id;
    Goods.findById(id, function(err, doc) {
        if (err || !doc) return res.redirect('/');
        var info = utility.prepareRenderMessage(req);
        info.goods = doc;
        res.render('goods_show', info);
    });
};

exports.showModify = function(req, res) {
    if (!req.session.user.isLogin) return res.redirect('/user/login');
    var id = req.params.id;
    Goods.findById(id, function(err, doc) {
        if (doc.user !== req.session.user.name && req.session.user.privilege !== 'administrator')
            return res.redirect('/goods/' + id);
        var info = utility.prepareRenderMessage(req);
        info.goods = doc;
        info.goods.tags = doc.tags.join(', ');
        res.render('goods_modify', info);
    });
};

exports.execModify = function(req, res) {
    if (!req.session.user.isLogin) return res.redirect('/user/login');
    var id = req.params.id;
    Goods.findById(id, function(err, doc) {
        if (doc.user !== req.session.user.name && req.session.user.privilege !== 'administrator')
            return res.redirect('/goods/' + id);
        res.locals.message = res.locals.message || [];
        var info = {
            title: req.body.title,
            content: req.body.content,
            tags: [],
            user: doc.user,
            status: req.body.finished ? 'finished' : 'published',
            images: []
        };
        req.body.tags = req.body.tags ? req.body.tags : '';
        req.body.tags.split(',').forEach(function(item) {
            var tag = item.trim();
            if (tag) info.tags.push(tag);
        });
        var fallback = function(errors) {
            errors.forEach(function(err) {
                res.locals.message.push(err);
            });
            var info2 = utility.prepareRenderMessage(req);
            info2.actionUrl = '/goods/' + id + '/modify';
            info2.goods = info;
            info2.goods.images = doc.images;
            return res.render('goods_modify', info2);
        };

        if (!info.title || !info.content || !info.tags.length) {
            return fallback(['No field can be empty']);
        }

        for (var i = 0; i < doc.images.length; ++i) {
            if (typeof(req.body.delete) !== 'object' || req.body.delete[i] !== 'yes') {
                info.images.push(doc.images[i]);
            }
        }
        var pathList = [];
        if (typeof(req.files) !== 'undefined' && typeof(req.files.images) !== 'undefined') {
            pathList = processUpload(req.files.images);
        }
        for (var i = 0; i < pathList.length; ++i) {
            info.images.push({ path: pathList[i] });
        }

        Goods.findByIdAndUpdate(id, info, null, function(err) {
            if (err) return fallback(['Unknown Error']);
            return res.redirect('/goods/' + id);
        });
    });
};