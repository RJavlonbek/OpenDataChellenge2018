var express = require('express');
var dateTime = require('node-datetime');
var mongoose=require('mongoose');
var router = express.Router();

var modelsDir='../../models/';
var CreditType=require(modelsDir+'CreditType');

router.get('/', function(req, res, next) { 
    CreditType.find({}, {}, function(error, result){
        //console.log(error);
        //console.log(req.session.user);
        res.render('admin/credit-type/index', {creditTypes: result, currentUrl:'credit-type'});
        //res.end();
    });       
});

router.get('/add', function(req, res, next) { 
    CreditType.find({}, {}, function(error, result){
        res.render('admin/credit-type/add', {categories: result, currentUrl:'credit-type'});
    });    
});

router.post('/add', function(req, res, next) {
    var creditType = {
        name: req.body.name, 
        status: req.body.status == 'true'
    };
    CreditType.create(creditType,function(error,result){
        res.redirect('/admin/credit-type');
    });
});

router.get('/delete/:id', function(req, res, next) { 
    CreditType.findByIdAndRemove(req.params.id, {}, function(error, result){
        if(error) throw error;
        if(result){
            res.redirect('/admin/credit-type');
        }
    });
});

router.get('/edit/:id', function(req, res, next) { 
    CreditType.findById(req.params.id,{},{},function(err,result){
        res.render('admin/credit-type/edit',{creditType:result});
    });
});

router.post('/edit', function(req, res, next) {
    var creditType={
        name:req.body.name,
        status:req.body.status=='true'
    }
    CreditType.findByIdAndUpdate(req.body.id, {$set : creditType}, function(e, result){
        res.redirect('/admin/credit-type');                       
    });
});

module.exports = router;
