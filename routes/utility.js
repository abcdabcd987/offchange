exports.prepareRenderMessage = function(req) {
    return {
        username: req.session.username ? req.session.username : '',
        privilege: req.session.privilege ? req.session.privilege : 'visitor',
        isLogin: req.session.isLogin ? req.session.isLogin : false
    };
}