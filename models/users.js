var mongoose = require('mongoose');  
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({  
  local: {
    name: String,
    email: String,
    password: String,
    isAdmin: {type:Boolean, default:false},
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
    username: String,
    isAdmin: {type:Boolean, default:false},
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String,
    isAdmin: {type:Boolean, default:false},
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
    isAdmin: {type:Boolean, default:false},
  },
});

userSchema.methods.generateHash = function(password) {  
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {  
  return bcrypt.compareSync(password, this.local.password);
};
module.exports = mongoose.model('user', userSchema);  