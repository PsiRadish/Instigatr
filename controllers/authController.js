var db = require('../models');
var express = require('express');
var router = express.Router();

//GET /auth/login
//display login form
router.get('/login',function(req,res){
    res.render('auth/login');
});

//POST /login
//process login data and login user
router.post('/login',function(req,res){

  db.user.authenticate(req.body.email, req.body.password, function(err,user){
    if(err){
      req.session.userId = null;
      res.send(err);
    }else if(user){
      req.session.userId = user.id;
      res.send(true);
    }else{
      req.session.userId = null;
      res.send(false);
    }
  });
});

//GET /auth/signup
//display sign up form
router.get('/signup',function(req,res){
    res.render('auth/signup');
});

//POST /auth/signup
//create new user in database
router.post('/signup',function(req,res){
  if(req.body.password != req.body.password2){
    res.send('Passwords must match!');
  }else{
    db.user.findOrCreate({
      where:{
        email: req.body.email
      },
      defaults:{
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
      }
    }).spread(function(user,created){
      if(created){
        res.send(true);
      }else{
        res.send('A user with that e-mail address already exists.');
      }
    }).catch(function(err){
      if(err){
        res.send(err);
      }else{
        res.send(false)
      }
    })
  }
});

//GET /auth/logout
//logout logged in user
router.get('/logout',function(req,res){
  req.flash('info','You have been logged out.');
  req.session.userId = null;
  res.redirect('/');
});

// app.get('/facebook',
//   passport.authenticate('facebook'),
//   function(req, res){

// });

// app.get('/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
// });

module.exports = router;
