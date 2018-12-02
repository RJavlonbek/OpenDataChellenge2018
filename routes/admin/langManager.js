var express = require('express');
var dateTime = require('node-datetime');
var mongoose=require('mongoose');
var router = express.Router();

var modelsDir='../../models/';
var Word=require(modelsDir+'Word');

router.get('/', function(req, res, next) { 
    Word.find({}, {}, function(error, result){
        //console.log(error);
        //console.log(req.session.user);
        res.render('admin/language-manager/index', {words: result, currentUrl:'language-manager'});
        //res.end();
    });       
});

router.get('/add', function(req, res, next) { 
    Word.find({}, {}, function(error, result){
        res.render('admin/credit-type/add', {categories: result, currentUrl:'credit-type'});
    });    
});

router.post('/add', function(req, res, next) {
    var word = {
        name: req.body.name, 
        en:req.body.en,
        ru:req.body.ru,
        uz:req.body.uz
    };
    Word.create(word,function(error,result){
        res.redirect('/admin/language-manager');
    });
});

router.get('/delete/:id', function(req, res, next) { 
    Word.findByIdAndRemove(req.params.id, {}, function(error, result){
        if(error) throw error;
        if(result){
            res.redirect('/admin/credit-type');
        }
    });
});

router.get('/edit/:id', function(req, res, next) { 
    Word.findById(req.params.id,{},{},function(err,result){
        res.render('admin/credit-type/edit',{Word:result});
    });
});

router.post('/edit', function(req, res, next) {
    var Word={
        name:req.body.name,
        status:req.body.status=='true'
    }
    Word.findByIdAndUpdate(req.body.id, {$set : Word}, function(e, result){
        res.redirect('/admin/credit-type');                       
    });
});

module.exports = router;
