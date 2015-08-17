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

router.get('/account/:id', ensureAuthenticated, function(req, res)
{
    // TODO
    // db.user.find({where: {id: req.params.id}, include: [fuckin' everything, sheeeit]})....
    
    // res.render("users/show.ejs", {titleSuffix: "Debate"});
    res.send("You WOULD want a user show page!");
});

module.exports = router;
