var mongoose = require('mongoose');  
var borrowedBooksSchema = new mongoose.Schema({  
  user_id: String,
  book_id: String
  
});
mongoose.model('borrowed_books', borrowedBooksSchema);