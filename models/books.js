var mongoose = require('mongoose');  
var bookSchema = new mongoose.Schema({  
  name: String,
  isbn: String,
  author: String,
  description: String,
  quantity: Number,
  surchargeFee: Number,
  category: String,
  isAvailable: Boolean
});
mongoose.model('book', bookSchema);