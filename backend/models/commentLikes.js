const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentLikesSchema = new Schema({
 
  comment_id:String,
  liker_id:String,
  value_increament:Number
})

module.exports = mongoose.model('CommentLikes',commentLikesSchema);
