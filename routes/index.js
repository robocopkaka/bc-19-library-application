var express = require('express');  
var passport = require('passport');  
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function(req, res, next) {  
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {  
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {  
  res.render('signup.ejs', { message: req.flash('loginMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {  
	if(req.user.local.isAdmin !== true){
		res.render('profile.ejs', {user:req.user})
	}
	else {
		mongoose.model('borrowed_books').find({}, function(err, results){
      console.log(results);
        if (err) res.send(err);
      else{
        res.render('admin/profile.ejs', {user:req.user});
      }// end else
    })
	}
});

router.get('/logout', function(req, res) {  
  req.logout();
  res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {  
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {  
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}));

// Facebook routes
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {  
  successRedirect: '/profile',
  failureRedirect: '/',
}));

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {  
  successRedirect: '/profile',
  failureRedirect: '/',
}));

// Google routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {  
  successRedirect: '/profile',
  failureRedirect: '/',
}));

router.get('/user_borrowed_books', function(req, res){
  mongoose.model('borrowed_books').find({'user_id':req.user._id}, function(err, results){
      console.log(results);
        if (err) res.send(err);
      else{
        res.format({
              html: function(){
                        res.render('admin/index', {
                              title: 'All borrowed books',
                              "books" : results,
                              user: req.user
                          });
                    },
                    //JSON response will show all books in JSON format
                    json: function(){
                        res.json(infophotos);
                    }
            })
      }// end else
    })
})

router.get('/borrowed_books',isAnAdmin, function(req, res){
  mongoose.model('borrowed_books').find({}, function(err, results){
      console.log(results);
        if (err) res.send(err);
      else{
        res.format({
              html: function(){
                        res.render('admin/admin_borrowed_books', {
                              title: 'All borrowed books',
                              "books" : results,
                              user: req.user
                          });
                    },
                    //JSON response will show all books in JSON format
                    json: function(){
                        res.json(infophotos);
                    }
            })
      }// end else
    })
})


module.exports = router;

function isLoggedIn(req, res, next) {  
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
}

function isAnAdmin(req, res, next){
  if(req.isAuthenticated()){
    if(req.user.local.isAdmin === true) return next();
    else res.redirect('/login')
  }

  else res.redirect('/login')
}