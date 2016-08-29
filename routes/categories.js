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
    //GET all categorys
    .get(function(req, res, next) {
        //retrieve all categorys from Monogo
        mongoose.model('category').find({}, function (err, categories) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/categorys folder. We are also setting "categorys" to be an accessible variable in our jade view
                    html: function(){
                        res.render('categories/index', {
                              title: 'All my categorys',
                              "categories" : categories
                          });
                    },
                    //JSON response will show all categorys in JSON format
                    json: function(){
                        res.json(infophotos);
                    }
                });
              }     
        });
    })
    //POST a new category
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name1 = req.body.name;
        //call the create function for our database
        mongoose.model('category').create({
            name : name1        }, function (err, category) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //category has been created
                  console.log('POST creating new category: ' + category);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /addcategory
                        res.location("categories");
                        // And forward to success page
                        res.redirect("/categories");
                    },
                    //JSON response will show the newly created category
                    json: function(){
                        res.json(category);
                    }
                });
              }
        })
    });


    /* GET New category page. */
router.get('/new', function(req, res) {
    res.render('categories/new', { title: 'Add New category' });
});


// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('category').findById(id, function (err, category) {
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
            //console.log(category);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('category').findById(req.id, function (err, category) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + category._id);
        var categorydob = category.dob.toISOString();
        categorydob = categorydob.substring(0, categorydob.indexOf('T'))
        res.format({
          html: function(){
              res.render('categorys/show', {
                "categorydob" : categorydob,
                "category" : category
              });
          },
          json: function(){
              res.json(category);
          }
        });
      }
    });
});

//GET the individual category by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the category within Mongo
    mongoose.model('category').findById(req.id, function (err, category) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the category
            console.log('GET Retrieving ID: ' + category._id);
            //format the date properly for the value to show correctly in our edit form
          var categorydob = category.dob.toISOString();
          categorydob = categorydob.substring(0, categorydob.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                       res.render('categories/edit', {
                          title: 'category' + category._id,
                        "categorydob" : categorydob,
                          "category" : category
                      });
                 },
                 //JSON response will return the JSON output
                json: function(){
                       res.json(category);
                 }
            });
        }
    });
});

//PUT to update a category by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
        var name1 = req.body.name;

   //find the document by ID
        mongoose.model('category').findById(req.id, function (err, category) {
            //update it
            category.update({
                name : name1
            }, function (err, categoryID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              } 
              else {
                      //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                      res.format({
                          html: function(){
                               res.redirect("/categories/" + category._id);
                         },
                         //JSON responds showing the updated values
                        json: function(){
                               res.json(category);
                         }
                      });
               }
            })
        });
});

//DELETE a category by ID
router.delete('/:id/edit', function (req, res){
    //find category by ID
    mongoose.model('category').findById(req.id, function (err, category) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            category.remove(function (err, category) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + category._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                          html: function(){
                               res.redirect("/categories");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                               res.json({message : 'deleted',
                                   item : category
                               });
                         }
                      });
                }
            });
        }
    });
});

module.exports = router;