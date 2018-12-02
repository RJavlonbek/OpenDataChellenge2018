var bcrypt = require('bcryptjs');
var modelsDir = '../models/';

var Credit = require(modelsDir + 'Credit');
var Account=require(modelsDir+'Account');
var CreditApplication=require(modelsDir+'CreditApplication');

var accountAPI = {
    signUp: function(req, res,next) {
        console.log('signup body',req.body);
        bcrypt.hash(req.body.password, 13, function(err, hash) {
            req.body.password = hash;
            req.body.status = true;
            req.body.roleId = 'customer';
            Account.create(req.body, function(err, result){
                if(err) return next(err);
                console.log('result',result);
                req.session.user=result;
                res.json(result);                        
            });
        });
    },
    login: function(req, res,next) {
        Account.findOne({$and: [{username: req.body.username}, {status: true}, {roleId: 'customer'}]}, function(e, account){
            if(e) return next(e);
            if(account != null) {
                bcrypt.compare(req.body.password, account.password, function(err, res1) {
                    if(err) return next(err);
                    if(res1) {
                        req.session.user=account;
                        res.json({count:1});
                    } else {
                        res.json({count:0});
                    }
                });
            } else {
                res.json({count: 0});
            }
        });
    },
    logout:function(req,res){
        console.log('logging out');
        delete req.session.user;
        res.end();
    },
    profile: function(req, res) {
        Account.findOne({$and: [{username: req.params.username}, {status: true}, {roleId: 'customer'}]}, function(e, account){
                res.write(JSON.stringify(account));
                res.end();
        });
    },
    creditApplications:function(req,res,next){
        if(req.session.user){
            CreditApplication.find({user:req.session.user._id},{},function(err,applications){
                if(err) return next(err);
                if(applications.length){
                    res.json(applications);
                }else{
                    res.json([{}]);
                }
            });
        }else{
            res.json([{}]);
        }
    },
    detectUser:function(req,res){
        if(req.session.user){
            res.json(req.session.user);
        }else{
            res.json({});
        }
    }
};

module.exports = accountAPI;
