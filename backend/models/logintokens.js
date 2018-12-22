const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginTokenSchema = new Schema({
   token:String,
   user_id:String
})

module.exports = mongoose.model('loginToken',loginTokenSchema);
