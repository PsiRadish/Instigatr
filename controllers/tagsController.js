var db = require('../models');
var express = require('express');
var router = express.Router();

// --- POST SHOW
router.get('/:id', function(req, res){

    db.tag.find({where:{id:req.params.id},include:[db.post]}).then(function(tag){
        res.render("tags/show",{tag:tag})
    })
});

module.exports = router;