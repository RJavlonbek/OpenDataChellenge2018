var express = require('express');
var dateTime = require('node-datetime');
var mongoose=require('mongoose');
var router = express.Router();

var modelsDir='../../models/';
var CreditCategory=require(modelsDir+'CreditCategory');

router.get('/', function(req, res, next) { 
    CreditCategory.find({}, {}, function(error, result){
        //console.log(error);
        //console.log(req.session.user);
        res.render('admin/credit-category/index', {creditCategories: result, currentUrl:'credit-category'});
        //res.end();
    });       
});

router.get('/add', function(req, res, next) { 
    CreditCategory.find({}, {}, function(error, result){
        res.render('admin/credit-category/add', {categories: result, currentUrl:'credit-category'});
    });    
});

router.post('/add', function(req, res, next) {
    var creditCategory = {
        name: req.body.name, 
        langKey:req.body.langKey,
        status: req.body.status == 'true'
    };
    CreditCategory.create(creditCategory,function(error,result){
        res.redirect('/admin/credit-category');
    });
});

router.get('/delete/:id', function(req, res, next) { 
    CreditCategory.findByIdAndRemove(req.params.id, {}, function(error, result){
        if(error) throw error;
        if(result){
            res.redirect('/admin/credit-category');
        }
    });
});

router.get('/edit/:id', function(req, res, next) { 
    CreditCategory.findById(req.params.id,{},{},function(err,result){
        res.render('admin/credit-category/edit',{creditCategory:result});
    });
});

router.post('/edit', function(req, res, next) {
    var creditCategory={
        name:req.body.name,
        langKey:req.body.langKey,
        status:req.body.status=='true'
    }
    CreditCategory.findByIdAndUpdate(req.body.id, {$set : creditCategory}, function(e, result){
        res.redirect('/admin/credit-category');                       
    });
});

module.exports = router;
