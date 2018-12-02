var express = require('express');
var dateTime = require('node-datetime');
var jwt = require('jwt-simple');
var router = express.Router();

router.get('/group/:groupName', function(req, res, next) { 
    var db = req.db;
    var settingTable = db.get('settings'); 
    settingTable.find({group: req.params.groupName}, {}, function(error, result){
        res.render('admin/setting/index', {settings: result, currentUrl:'setting'});
    });       
});

router.get('/edit/:key', function(req, res, next) { 
    var db = req.db;
    var settingTable = db.get('settings');  
    settingTable.findOne({key: req.params.key}, function(e, result){  
        res.render('admin/setting/edit', {setting: result, currentUrl:'setting'});
    });
});

router.post('/edit', function(req, res, next) { 
    var db = req.db;
    var settingTable = db.get('settings');  
    settingTable.update({key: req.body.key}, {$set : {value: req.body.value}}, function(e, result){
        res.redirect('group/' + req.body.group);                       
    });
});

router.get('/security', function(req, res, next) { 
    var db = req.db;
    var settingTable = db.get('settings'); 
    settingTable.find({group: 'security'}, {}, function(error, result){
        res.render('admin/setting/security', {settings: result, currentUrl:'setting'});
    });       
});

router.get('/security/generate', function(req, res, next) { 
    var db = req.db;
    var settingTable = db.get('settings');  
    settingTable.update({key: 'access_token'}, {$set : {value: genToken()}}, function(e, result){
        res.redirect('/admin/setting/security');                       
    });    
});

function genToken() {
  var expires = expiresIn(7);
  var token = jwt.encode({
    exp: expires
  }, require('./secret')());

  return {
    token: token,
    expires: expires
  };
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = router;
