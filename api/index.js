var express = require('express');
var router = express.Router();

var bankAPI = require('./bankAPI.js');
var creditAPI = require('./creditAPI.js');
var accountAPI = require('./accountAPI.js');
var comparisonAPI=require('./comparisonAPI');


// bank API
router.get('/bank/findAll', bankAPI.findAll);
router.get('/bank/find_by_id/:id', bankAPI.find);
router.get('/bank/findByAlias/:alias',bankAPI.findByAlias);
router.post('/bank/addUser',bankAPI.addUser);
router.get('/bank/findMyBank',bankAPI.findMyBank);

// credit API
router.post('/credit/filter', creditAPI.find);
router.get('/credit/special/:type',creditAPI.getSpecials);
router.get('/credit/categories',creditAPI.getCategories);
router.get('/credit/category/findByAlias/:categoryAlias',creditAPI.getCategoryByAlias);
router.post('/credit/:creditAlias/apply',creditAPI.apply);
router.get('/credit/findByAlias/:creditAlias',creditAPI.findByAlias);

// Account API
router.post('/account/signup', accountAPI.signUp);
router.post('/account/login', accountAPI.login);
router.get('/account/logout',accountAPI.logout);
router.get('/account/profile/:username', accountAPI.profile);
router.post('/account/profile', accountAPI.saveProfile);
router.get('/account/creditApplications',accountAPI.creditApplications);
router.get('/detectUser',accountAPI.detectUser);

// Comparison API 
router.get('/getComparisons/:type',comparisonAPI.getComparisons);
router.get('/comparisonsData/:type',comparisonAPI.getComparisonsData);
router.post('/addComparison',comparisonAPI.addComparison);
router.post('/removeComparisonElement',comparisonAPI.removeComparisonElement);


module.exports = router;