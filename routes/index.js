var user = require('./user');
var homepage = require('./homepage');

exports.setup = function(app) {
    app.get('/', homepage.show);

    app.get( '/login', user.showLogin);
    app.post('/login', user.execLogin);
    app.get( '/logout', user.execLogout);
    app.get( '/register', user.showRegister);
    app.post('/register', user.execRegister);

    //app.get( '/goods', goods.showList);
    //app.post('/goods', goods.execNew);
    //app.get( '/goods/:goods', goods.show);
    //app.post('/goods/:goods', goods.execUpdate);

    //app.get( '/tags', tag.showList);
    //app.get( '/tag/:tag', tag.show);
};