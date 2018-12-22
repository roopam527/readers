const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookLikesSchema = new Schema({
  book_id:String,
  user_id:String,
  points_added:Number
})

module.exports = mongoose.model('BookLikes',BookLikesSchema);
