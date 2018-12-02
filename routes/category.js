var express = require('express');
var router = express.Router();

router.get('/findall', function(req, res) { 
    var db = req.db;
    var categoryTable = db.get('categories'); 
    categoryTable.find({status: true},{}, function(e, categories){
        res.write(categories);
        res.end();
    });
});


module.exports = router;
