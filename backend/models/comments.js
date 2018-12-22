const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment:String,
    likes:{ type:Number,default: 0 },
    book_id:String,
    user_id:String
})

module.exports = mongoose.model('Comment',commentSchema);
