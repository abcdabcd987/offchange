exports.show = function(req, res) {
    var session = {
        login: req.session.login || false,
        username: req.session.username || '',
        privilege: req.session.privilege || 'visitor'
    };
    res.render('homepage', { session: session });
}