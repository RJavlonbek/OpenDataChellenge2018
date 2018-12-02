var express = require('express');
var dateTime = require('node-datetime');
var path = require('path');
var mongoose=require('mongoose');
var router = express.Router();

var modelsDir='../../models/';
var Credit=require(modelsDir+'Credit');
var CreditType=require(modelsDir+'CreditType');
var CreditCategory=require(modelsDir+'CreditCategory');
var Document=require(modelsDir+'Document');
var Bank=require(modelsDir+'Bank');
var Category=require(modelsDir+'Category');

router.get('/', function(req, res, next) { 
    Credit.find({}, {}).populate({
        path:'bank',
        select:['logo','name']
    }).populate({
        path:'type',
        select:'name'
    }).exec(function(error, result){
        //console.log(result);
        res.render('admin/credit/index', {credits: result, currentUrl:'credit'});
    });  
});

router.get('/category/:categoryId', function(req, res, next) {  
    Credit.find({categoryId: req.params.categoryId}, {}, function(error, result){
        res.render('admin/credit/index', {credits: result, currentUrl:'credit'});
    });       
});

router.get('/brand/:brandId', function(req, res, next) { 
    Credit.find({brandId: req.params.brandId}, {}, function(error, result){
        res.render('admin/credit/index', {credits: result, currentUrl:'credit'});
    });       
});

router.get('/add', function(req, res, next) { 
    async.parallel([
        function(callback){
            CreditType.find({},{}, function(e, creditTypes){
                callback(null, creditTypes);
            });            
        },
        function(callback){
            Bank.find({},{}, function(e, brands){
                callback(null, brands);
            });
        },
        function(callback){
            CreditCategory.find({status:true},{},function(err,categories){
                if(err) return next(err);
                callback(null,categories);
            });
        },
        function(callback){
            Document.find({status:true},{},function(err,documents){
                if(err) return next(err);
                callback(null,documents);
            });
        }
    ],
    function(err, results) {
        var data = {creditTypes: results[0], banks: results[1], categories:results[2], documents:results[3], currentUrl:'credit'};
        res.render('admin/credit/add', data);
    });
});

router.post('/add', function(req, res, next) { 
    //var id = dateTime.create().format('YmdHMS');
    console.log('credit body',req.body);
    var documents=[];
    if(req.body.documents){
        if(Array.isArray(req.body.documents)){
            documents=req.body.documents;
        }else{
            document.push(req.body.documents);
        }
    }
    var categories=[];
    if(req.body.categories){
        if(Array.isArray(req.body.categories)){
            categories=req.body.categories;
        }else{
            categories.push(req.body.categories);
        }
    }
    var credit = {
            name: req.body.name, 
            type: req.body.creditTypeId,
            bank: req.body.bankId,
            amount: parseFloat(req.body.amount),
            interestRate:parseInt(req.body.interestRate),
            term:req.body.term,
            initialFee:req.body.initialFee,
            categories:categories,
            documents:documents,
            requiredAge:req.body.requiredAge,
            withInsurance:req.body.withInsurance=='true',
            requiredExperience:req.body.requiredExperience, 
            description: req.body.description,      
            special: req.body.special == 'true',
            views: 0,
            status: req.body.status == 'true',
        };
    Credit.create(credit, function(error, result){
        if(error) return next(error);
        res.redirect('/admin/credit');
    });
});

router.get('/delete/:id', function(req, res, next) { 
    Credit.findByIdAndDelete(req.params.id,{},function(err,result){
        if(err) throw err;
        console.log(result);
        res.redirect('/admin/credit');
    });
});

router.get('/edit/:id', function(req, res, next) {
    async.parallel([
        function(callback){
            CreditType.find({},{}, function(e, creditTypes){
                callback(null, creditTypes);
            });            
        },
        function(callback){
            Bank.find({},{}, function(e, banks){
                callback(null, banks);
            });
        },        
        function(callback){
            Credit.findById(req.params.id,{},{}, function(e, credit){
                callback(null, credit);
            });
        },
        function(callback){
            CreditCategory.find({status:true},{},function(err,categories){
                if(err) return next(err);
                callback(null,categories);
            });
        },
        function(callback){
            Document.find({status:true},{},function(err,documents){
                if(err) return next(err);
                callback(null,documents);
            });
        }
    ], 
    function(err, results) {
        var data = {creditTypes: results[0], banks: results[1], credit: results[2], categories:results[3], documents:results[4], currentUrl:'credit'};
        res.render('admin/credit/edit', data);
    });
      
});

router.post('/edit', function(req, res, next) { 
    //console.log('edit body',req.body);
    var documents=[];
    if(req.body.documents){
        if(Array.isArray(req.body.documents)){
            documents=req.body.documents;
        }else{
            documents.push(req.body.documents);
        }
    }
    var categories=[];
    if(req.body.categories){
        if(Array.isArray(req.body.categories)){
            categories=req.body.categories;
        }else{
            categories.push(req.body.categories);
        }
    }
    var credit = {
        name: req.body.name,  
        type: req.body.typeId,
        bank: req.body.bankId,
        amount: parseInt(req.body.amount), 
        interestRate:parseInt(req.body.interestRate),
        term:req.body.term,
        initialFee:req.body.initialFee,
        requiredAge:req.body.requiredAge,
        withInsurance:req.body.withInsurance=='true',
        requiredExperience:req.body.requiredExperience,
        description: req.body.description,     
        special: req.body.special == 'true',
        status: req.body.status == 'true',
    };
    //console.log('credit to edit',credit);

    Credit.findByIdAndUpdate(req.body.id,{
        $set : credit,
        $pull:{
            categories:{},
            documents:{}
        }
    }, function(err, result){
        if(err) throw(err);
        //console.log('result',result);
        result.categories=categories;
        result.documents=documents;
        result.save(function(err,credit){
            if(err) throw(err);
            //console.log('edited',credit);
            res.redirect('/admin/credit');
        });
    });
    //res.end();
});

module.exports = router;
