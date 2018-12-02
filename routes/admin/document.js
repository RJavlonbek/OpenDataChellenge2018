var express = require('express');
var dateTime = require('node-datetime');
var mongoose=require('mongoose');
var router = express.Router();

var modelsDir='../../models/';
var Document=require(modelsDir+'Document');

router.get('/', function(req, res, next) { 
    Document.find({}, {}, function(error, result){
        //console.log(error);
        //console.log(req.session.user);
        res.render('admin/document/index', {documents: result, currentUrl:'document'});
        //res.end();
    });       
});

router.get('/add', function(req, res, next) { 
    Document.find({}, {}, function(error, result){
        res.render('admin/document/add', {categories: result, currentUrl:'document'});
    });    
});

router.post('/add', function(req, res, next) {
    var doc = {
        name: req.body.name, 
        langKey:req.body.langKey,
        status: req.body.status == 'true'
    };
    Document.create(doc,function(error,result){
        if(error) return next(error);
        res.redirect('/admin/document');
    });
});

router.get('/delete/:id', function(req, res, next) { 
    Document.findByIdAndRemove(req.params.id, {}, function(error, result){
        if(error) throw error;
        if(result){
            res.redirect('/admin/document');
        }
    });
});

router.get('/edit/:id', function(req, res, next) { 
    Document.findById(req.params.id,{},{},function(err,result){
        res.render('admin/document/edit',{doc:result});
    });
});

router.post('/edit', function(req, res, next) {
    var doc={
        name:req.body.name,
        langKey:req.body.langKey,
        status:req.body.status=='true'
    }
    Document.findByIdAndUpdate(req.body.id, {$set : doc}, function(e, result){
        res.redirect('/admin/document');                       
    });
});

module.exports = router;
