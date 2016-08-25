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
    //GET all borrowed_books
    .get(function(req, res, next) {
        //retrieve all borrowed_books from Monogo
        mongoose.model('borrowed_book').find({}, function (err, borrowed_books) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/borrowed_books folder. We are also setting "borrowed_books" to be an accessible variable in our jade view
                    html: function(){
                        res.render('borrowed_books/index', {
                              title: 'All my borrowed_books',
                              "borrowed_books" : borrowed_books
                          });
                    },
                    //JSON response will show all borrowed_books in JSON format
                    json: function(){
                        res.json(infophotos);
                    }
                });
              }     
        });
    })
    //POST a new borrowed_book
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var user_id = req.body.user._id;
        var isbn1 = req.body.book._id;
        
        //call the create function for our database
        mongoose.model('borrowed_book').create({
            user : user_id,
            book : book_id
        }, function (err, borrowed_book) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //borrowed_book has been created
                  console.log('POST creating new borrowed_book: ' + borrowed_book);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("borrowed_books");
                        // And forward to success page
                        res.redirect("/borrowed_books");
                    },
                    //JSON response will show the newly created borrowed_book
                    json: function(){
                        res.json(borrowed_book);
                    }
                });
              }
        })
    });


    /* GET New borrowed_book page. */
router.get('/new', function(req, res) {
    res.render('borrowed_books/new', { title: 'Add New borrowed_book' });
});


// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('borrowed_book').findById(id, function (err, borrowed_book) {
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
            //console.log(borrowed_book);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('borrowed_book').findById(req.id, function (err, borrowed_book) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + borrowed_book._id);
        // var borrowed_bookdob = borrowed_book.dob.toISOString();
        // borrowed_bookdob = borrowed_bookdob.substring(0, borrowed_bookdob.indexOf('T'))
        res.format({
          html: function(){
              res.render('borrowed_books/show', {
                // "borrowed_bookdob" : borrowed_bookdob,
                "borrowed_book" : borrowed_book
              });
          },
          json: function(){
              res.json(borrowed_book);
          }
        });
      }
    });
});

//GET the individual borrowed_book by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the borrowed_book within Mongo
    mongoose.model('borrowed_book').findById(req.id, function (err, borrowed_book) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the borrowed_book
            console.log('GET Retrieving ID: ' + borrowed_book._id);
            //format the date properly for the value to show correctly in our edit form
          // var borrowed_bookdob = borrowed_book.dob.toISOString();
          // borrowed_bookdob = borrowed_bookdob.substring(0, borrowed_bookdob.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('borrowed_books/edit', {
                          title: 'borrowed_book' + borrowed_book._id,
                        // "borrowed_bookdob" : borrowed_bookdob,
                          "borrowed_book" : borrowed_book
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(borrowed_book);
                 }
            });
        }
    });
});

//PUT to update a borrowed_book by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
        var user_id = req.body.user._id;
        var isbn1 = req.body.book._id;

   //find the document by ID
        mongoose.model('borrowed_book').findById(req.id, function (err, borrowed_book) {
            //update it
            borrowed_book.update({
              user_id : user_id,
            	book_id : book_id
            	
            }, function (err, borrowed_bookID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              } 
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/borrowed_books/" + borrowed_book._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(borrowed_book);
                         }
                      });
               }
            })
        });
});

//DELETE a borrowed_book by ID
router.delete('/:id/edit', function (req, res){
    //find borrowed_book by ID
    mongoose.model('borrowed_book').findById(req.id, function (err, borrowed_book) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            borrowed_book.remove(function (err, borrowed_book) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + borrowed_book._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/borrowed_books");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : borrowed_book
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
router.post('/borrowed_books/:id/borrow',  function(req, res){
    mongoose.model('borrowed_book').findById(req.id, function (err, borrowed_book) {
        if (err) {
            return console.error(err);
        } else {
           if(borrowed_book.isAvailable === true && borrowed_book.quantity) {
              borrowed_book.quantity -= 1;
              // code to update borrowed_borrowed_books table with borrowed_book's and current user's id
              // update after creating
              // mongoose.model('borrowed_borrowed_books').create(, function(req,res){})
           }// end of inner if
        }
})
  })

module.exports = router;