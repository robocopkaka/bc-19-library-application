var mongoose = require('mongoose');  
var categorySchema = new mongoose.Schema({  
  name: String
});
mongoose.model('category', categorySchema);