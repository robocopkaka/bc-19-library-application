var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))
router.route('/')
    //GET all books
    .get(function(req, res, next) {
        //retrieve all books from Monogo
        mongoose.model('book').find({}, function (err, books) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/books folder. We are also setting "books" to be an accessible variable in our jade view
                    html: function(){
                        res.render('books/index', {
                              title: 'All my books',
                              "books" : books
                          });
                    },
                    //JSON response will show all books in JSON format
                    json: function(){
                        res.json(infophotos);
                    }
                });
              }     
        });
    })
    //POST a new book
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name1 = req.body.name;
        var isbn1 = req.body.isbn;
        var author1 = req.body.author;
        var description1 = req.body.description;        
        var quantity1 = req.body.quantity;
        var surchargeFee1 = req.body.surchargeFee;
        var category1 = req.body.category
        var isAvailable1 = req.body.isAvailable;
        //call the create function for our database
        mongoose.model('book').create({
            name : name1,
            isbn : isbn1,
            author : author1,
            description: description1,
            quantity: quantity1,
            surchargeFee: surchargeFee1,
            category:category1,
            isAvailable : isAvailable1
        }, function (err, book) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //book has been created
                  console.log('POST creating new book: ' + book);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("books");
                        // And forward to success page
                        res.redirect("/books");
                    },
                    //JSON response will show the newly created book
                    json: function(){
                        res.json(book);
                    }
                });
              }
        })
    });


    /* GET New book page. */
router.get('/new', function(req, res) {
    res.render('books/new', { title: 'Add New book' });
});


// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('book').findById(id, function (err, book) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(book);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('book').findById(req.id, function (err, book) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + book._id);
        // var bookdob = book.dob.toISOString();
        // bookdob = bookdob.substring(0, bookdob.indexOf('T'))
        res.format({
          html: function(){
              res.render('books/show', {
                // "bookdob" : bookdob,
                "book" : book
              });
          },
          json: function(){
              res.json(book);
          }
        });
      }
    });
});

//GET the individual book by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the book within Mongo
    mongoose.model('book').findById(req.id, function (err, book) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the book
            console.log('GET Retrieving ID: ' + book._id);
            //format the date properly for the value to show correctly in our edit form
          // var bookdob = book.dob.toISOString();
          // bookdob = bookdob.substring(0, bookdob.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('books/edit', {
                          title: 'book' + book._id,
                        // "bookdob" : bookdob,
                          "book" : book
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(book);
                 }
            });
        }
    });
});

//PUT to update a book by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
        var name1 = req.body.name;
        var isbn1 = req.body.isbn;
        var author1 = req.body.author;
        var description1 = req.body.description;        
        var quantity1 = req.body.quantity;
        var surchargeFee1 = req.body.surchargeFee;
        var category1 = req.body.category
        var isAvailable1 = req.body.isAvailable;

   //find the document by ID
        mongoose.model('book').findById(req.id, function (err, book) {
            //update it
            book.update({
                name : name1,
            	isbn : isbn1,
            	author : author1,
            	description: description1,
            	quantity: quantity1,
            	surchargeFee: surchargeFee1,
            	category:category1,
            	isAvailable : isAvailable1
            }, function (err, bookID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              } 
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/books/" + book._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(book);
                         }
                      });
               }
            })
        });
});

//DELETE a book by ID
router.delete('/:id/edit', function (req, res){
    //find book by ID
    mongoose.model('book').findById(req.id, function (err, book) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            book.remove(function (err, book) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + book._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/books");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : book
                               });
                         }
                      });
                }
            });
        }
    });
});

/**
@
*/
router.post('/books/:id/borrow',  function(req, res){
    mongoose.model('book').findById(req.id, function (err, book) {
        if (err) {
            return console.error(err);
        } else {
           if(book.isAvailable === true && book.quantity) {
              book.quantity -= 1;
              // code to update borrowed_books table with book's and current user's id
              // update after creating
              // mongoose.model('borrowed_books').create(, function(req,res){})
           }// end of inner if
        }
})

module.exports = router;