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
      
      // res.send(err);
      throw err;
    }else if(user){
      req.session.userId = user.id;
      req.flash('success','You are logged in.');
      res.redirect('/');
    }else{
      req.session.userId = null;
      req.flash('danger','inval`id username or password');
      res.redirect('/auth/login');
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
    req.flash('danger','Passwords must match.')
    res.redirect('/auth/signup');
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
        req.flash('success','You are signed up.')
        res.redirect('/');
      }else{
        req.flash('danger','A user with that e-mail address already exists.');
        res.redirect('/auth/signup');
      }
    }).catch(function(err){
      if(err.message){
        req.flash('danger',err.message);
      }else{
        req.flash('danger','unknown error.');
        console.log(err);
      }
      res.redirect('/auth/signup');
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
