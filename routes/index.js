var user = require('./user');
var goods = require('./goods');
var homepage = require('./homepage');

exports.setup = function(app) {
    app.get('/', homepage.show);

    app.get( '/login', user.showLogin);
    app.post('/login', user.execLogin);
    app.get( '/logout', user.execLogout);
    app.get( '/register', user.showRegister);
    app.post('/register', user.execRegister);

    app.get( '/goods', goods.showList);
    app.get( '/goods/new', goods.showNew);
    app.post('/goods/new', goods.execNew);
    app.get( '/goods/:id', goods.show);
    app.get( '/goods/:id/modify', goods.showModify);
    app.post('/goods/:id/modify', goods.execModify);

    //app.get( '/tags', tag.showList);
    //app.get( '/tag/:tag', tag.show);
};