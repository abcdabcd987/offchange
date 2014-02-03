var user = require('./user');
var goods = require('./goods');
var homepage = require('./homepage');

exports.setup = function(app) {
    app.get('/', homepage.show);

    app.get( '/user/login', user.showLogin);
    app.post('/user/login', user.execLogin);
    app.get( '/user/logout', user.execLogout);
    app.get( '/user/register', user.showRegister);
    app.post('/user/register', user.execRegister);
    app.get( '/user/modify', user.showModify);
    app.post('/user/modify', user.execModify);

    app.get( '/goods', goods.showList);
    app.get( '/goods/new', goods.showNew);
    app.post('/goods/new', goods.execNew);
    app.get( '/goods/:id', goods.show);
    app.get( '/goods/:id/modify', goods.showModify);
    app.post('/goods/:id/modify', goods.execModify);
    app.get( '/goods/:id/delete', goods.showDelete);
    app.post('/goods/:id/delete', goods.execDelete);

    //app.get( '/tags', tag.showList);
    //app.get( '/tag/:tag', tag.show);
};