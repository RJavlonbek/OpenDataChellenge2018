var express = require('express');
var dateTime = require('node-datetime');
var path=require('path');
var mongoose=require('mongoose');
var router = express.Router();

var modelsDir='../../models/';
var Bank=require(modelsDir+'Bank');

router.get('/', function(req, res, next) {  
    Bank.find({}, {}, function(error, result){
        res.render('admin/bank/index', {banks: result, currentUrl:'bank'});
    });       
});

router.get('/add', function(req, res, next) { 
    res.render('admin/bank/add', {currentUrl:'bank'});   
});

router.post('/add', function(req, res, next) { 
    console.log(req.body);
    // res.end();
    async.parallel([
        function(callback){
            var photo = 'no-image.png';
            if(req.files.logo != null) {    
                //console.log(req.files.photo);
                req.files.logo.mv(path.join('./public/images/uploads/banks/',req.files.logo.name), function(err) {
                    if (err)
                        photo = 'no-image.png';
                });
                photo = req.files.logo.name;
            }
            callback(null, photo);
        }
    ], 
    function(err, results) {
        if(err) throw err;
        var logo = results[0];
        var bank = {
            name: req.body.name,
            description: req.body.description,
            logo: logo,
            views: 0,
            status: req.body.status == 'true'
        };
        Bank.create(bank, function(error, result){
            if(error) throw error;
            res.redirect('/admin/bank');
        });
    });
});

router.get('/delete/:id', function(req, res, next) { 
    Bank.findByIdAndRemove(req.params.id,{},function(err,result){
        if(err) throw err;
        res.redirect('/admin/bank');
    });
});

router.get('/edit/:id', function(req, res, next) { 
    Bank.findById(req.params.id,{},{},function(e, result){ 
        if(e) throw e; 
        res.render('admin/bank/edit', {bank: result, currentUrl:'bank'});
    });
});

router.post('/edit', function(req, res, next) { 
    async.parallel([        
        function(callback){
            if(req.body.o_logo){
                var defPhoto=req.body.o_logo;    
            }else{
                var defPhoto='no-image.png';
            }
            var photo = defPhoto;
            if(req.files.logo != null) {    
                console.log(req.files.logo);
                req.files.logo.mv(path.join('./public/images/uploads/banks/',  req.files.logo.name), function(err) {
                    if (err)
                        photo = defPhoto;
                });
                photo = req.files.logo.name;
            }          
            callback(null, photo);
        }
    ], 
    function(err, results) {        
        var logo = results[0];
        var bank = {
            name: req.body.name, 
            description: req.body.description,      
            logo: logo,
            status: req.body.status == 'true'
        };
        Product.findByIdAndUpdate(req.body.id, {$set : bank}, function(e, result){
            res.redirect('/admin/bank');                       
        });
    });
});


module.exports = router;
