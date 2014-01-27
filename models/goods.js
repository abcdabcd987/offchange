var db = require('./db');
var Schema = db.Schema;
var schema = new Schema({
    title:   String,
    content: String,
    image:   String,
    user:    String,
    status:  String,
    tags:    [String],
    postDate:   { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now }
});

module.exports = db.model('goods', schema);