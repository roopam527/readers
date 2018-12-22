const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
   f_name:String,
   l_name:String,
   username:String,
   email:String,
   password:String,
   user_value:{ type:Number,default: 1}
})

module.exports = mongoose.model('Users',usersSchema);
