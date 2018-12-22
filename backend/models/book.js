const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BooksSchema = new Schema({
  book_api_id:String,
  likes:{ type:Number,default: 0 },
  points:{ type:Number,default: 0 },
  comments:{type:Number,default: 0 }
})

module.exports = mongoose.model('Books',BooksSchema);
