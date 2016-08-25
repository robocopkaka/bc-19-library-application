var mongoose = require('mongoose');  
var userSchema = new mongoose.Schema({  
  name: String,
  phone_number: String,
  email_address: String,
  address: String,
  isAdmin: Boolean
});
mongoose.model('user', userSchema);