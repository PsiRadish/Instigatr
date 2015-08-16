
var db = require('../models');
var express = require('express');
var router = express.Router();

router.get('/:id/show', function(req, res)
{
    res.render("posts/show.ejs", {titleSuffix: "Debate"});
});

module.exports = router;
