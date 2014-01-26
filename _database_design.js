var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String, index: {unique: true} },
    password:  String,
    privilege: String,
    contact: {
        phone:   String,
        address: String,
        qq:      String,
        wechat:  String,
        renren:  String,
        email:   String
    },
    registerDate: {type: Date, default: Date.now },
    message: [{
        content: String,
        status:  String
    }]
});

var goodsSchema = new Schema({
    title:   String,
    content: String,
    image:   String,
    user:    String,
    status:  String,
    tags:    [String],
    postDate:   { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now }
});

var needsSchema = new Schema({
    title:   String,
    content: String,
    user:    String,
    status:  String,
    tags:    [String],
    postDate:   { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now }
});

var subscribeSchema = new Schema({
    user: String,
    tag:  String,
    date: { type: Date, default: Date.now }
});

var messageSchema = new Schema({
    user:    String,
    content: String,
    status:  { type: String, default: "unread" }
    date: { type: Date, default: Date.now }
});

var logSchema = new Schema({
    operator: String,
    category: String,
    message:  String,
    date: { type: Date, default: Date.now }
});