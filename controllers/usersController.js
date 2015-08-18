var db = require('../models');
var express = require('express');
var router = express.Router();

function ensureAuthenticated(req, res, next)
{
    if (req.currentUser)
    {
        return next();
    } else
    {
        req.flash('danger', 'You must login to take that action.');
        res.redirect('/auth/login');
    }
}

router.get('/', function(req, res){
    res.render("users/show.ejs");
});

router.get('/', function(req, res){
    res.render("users/settings.ejs");
});

// UPDATE
router.post('/',function(req,res) {

    // db.user.authenticate(req.body.email, req.body.password, function(err, user){
    db.user.find({where: {email: req.body.email}}).then(function(user){
        if(user) console.log(user);
        // res.send(user);

        if(req.body.newPassword != req.body.newPasswordCheck){
            req.flash('danger','Passwords must match.')
            res.redirect('users');
        }else{
          user.update({password: req.body.newPassword})
          .then(function(){
              req.flash('success',"You've changed your password.")
              res.redirect('/');

          }).catch(function(err){
            if(err.message){
              req.flash('danger',err.message);
            }else{
              req.flash('danger','unknown error.');
              console.log(err);
            }
            res.redirect('users');
          })
        }

    });
});

router.get('/account/:id', ensureAuthenticated, function(req, res)
{
    // TODO
    // db.user.find({where: {id: req.params.id}, include: [fuckin' everything, sheeeit]})....

    // res.render("users/show.ejs", {titleSuffix: "Debate"});
    res.send("You WOULD want a user show page!");
});

module.exports = router;
