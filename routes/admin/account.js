var express = require('express');
var dateTime = require('node-datetime');
var bcrypt = require('bcryptjs');
var mongoose=require('mongoose');
var router = express.Router();

var modelsDir='../../models/';
var Account=require(modelsDir+'Account');
var Role=require(modelsDir+'Role');

router.get('/', function(req, res, next) {     
    Account.find({}, {}, function(error, result){
        res.render('admin/account/index', {accounts: result, currentUrl:'account'});
    });       
});

router.get('/role/:roleId', function(req, res, next) {  
    Account.find({roleId: req.params.roleId}, {}, function(error, result){
        res.render('admin/account/index', {accounts: result, currentUrl:'account'});
    });       
});

router.get('/add', function(req, res, next) { 
    async.parallel([
        function(callback){
            Role.find({},{}, function(e, roles){
                callback(null, roles);
            });            
        }
    ], 
    function(err, results) {
        var data = {roles: results[0], currentUrl:'account'};
        res.render('admin/account/add', data);
    });
      
});

router.post('/add', function(req, res, next) { 
    bcrypt.hash(req.body.password, 13, function(err, hash) {
        req.body.password = hash;
        req.body.status = req.body.status == 'true';
        req.body.roleId = req.body.roleId;
        req.body.username = req.body.username;
        req.body.fullName = req.body.fullName;
        req.body.email = req.body.email;
        Account.insert(req.body, function(err, result){
            res.redirect('/admin/account');                            
        });
    });

});

router.get('/edit/:username', function(req, res, next) { 
    async.parallel([
        function(callback){
            Role.find({},{}, function(e, roles){
                callback(null, roles);
            });
        },        
        function(callback){
            Account.findOne({username: req.params.username}, function(e, account){
                callback(null, account);
            });
        }
    ], 
    function(err, results) {
        var data = {roles: results[0], account: results[1], currentUrl:'account'};
        res.render('admin/account/edit', data);
    });      
});

router.post('/edit', function(req, res, next) { 
    Account.findOne({username: req.body.username}, function(e, account) {
                if(req.body.password != '') {
                    bcrypt.hash(req.body.password, 13, function(err, hash) {                        
                        Account.update({username: req.body.username}, {$set : { 
                                    password: hash, 
                                    fullName: req.body.fullName, 
                                    email: req.body.email, 
                                    roleId: req.body.roleId, 
                                    status: req.body.status == 'true'
                                    }}, 
                            function(e, result) {
                               res.redirect('/admin/account');    
                            
                        });
                    });
                } else {                    
                    Account.update({username: req.body.username}, {    $set : {
                            fullName: req.body.fullName, 
                            email: req.body.email, 
                            roleId: req.body.roleId, 
                            status: req.body.status == 'true'}}, function(e, result) {
                        res.redirect('/admin/account');   
                    });
                }
            });
            
});

router.get('/delete/:id', function(req, res, next) { 
    Account.remove({username: req.params.id});
    res.redirect('/admin/account');   
});

router.get('/logout', function(req, res, next) { 
    delete req.session.user;
    res.redirect('/admin/login'); 
});

module.exports = router;
