var mongoose = require('mongoose');  
var borrowedBooksSchema = new mongoose.Schema({  
  user_id: String,
  book_id: String,
  borrowed_date:{type:Date, default:Date.now()},
  return_date:{type:Date, default:Date.now() + 604800000},// number of milliseconds that make a week
  is_returned: Boolean
  
});
mongoose.model('borrowed_books', borrowedBooksSchema);