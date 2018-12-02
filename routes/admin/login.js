var express = require('express');
var mongoose =require('mongoose');
var bcrypt = require('bcryptjs');

var modelsDir='../../models/';
var Account=require(modelsDir+'Account');
//console.log(Account);

var router = express.Router();

router.get('/', function(req, res, next) { 
    res.render('admin/login/index', {});
});

router.post('/login', function(req, res, next) {     
    Account.findOne({$and: [{username: req.body.username}, {status: true}, {roleId: 'admin'}]}, function(e, account){
        if(account != null) {
            bcrypt.compare(req.body.password, account.password, function(err, res1) {
                if(res) {
                    req.session.user = account;
                    res.redirect('/admin/category');           
                } else {
                    res.render('admin/login/index', {error: 'Username and password do not match or you do not have an account yet.'});
                }
            });
        } else {
            res.render('admin/login/index', {error: 'Username and password do not match or you do not have an account yet.'}); 
        }
    });
});

module.exports = router;
