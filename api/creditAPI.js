var nodemailer=require('nodemailer');
var modelsDir = '../models/';

var Account=require(modelsDir+'Account');
var Credit = require(modelsDir + 'Credit');
var CreditType=require(modelsDir+'CreditType');
var CreditCategory=require(modelsDir+'CreditCategory');
var CreditApplication=require(modelsDir+'CreditApplication');

const newCarCategoryAlias='for-new-car';
const usedCarCategoryAlias='for-used-car';

var creditAPI = {
    findAll: function(req, res) {
        Credit.find({}, {}).populate({
            path: 'bank',
            select: ['logo', 'name']
        }).exec(function(error, result) {
            //res.write(JSON.stringify(result));
            res.send(result);
        });
    },
    find: function(req, res, next) { //finds credits according to filters
        // console.log('Session: ',req.session);
        // console.log('Cookies: ',req.cookies);
        // res.cookie('name','Javlon',{maxAge:900000});
        // preparing filtering query
        console.log('credit filter api is running');
        var b=req.body;
        async.parallel([
            function(callback){  //type
                if(b.type){       // available types: 'auto-credits','consumer-credits'
                    console.log('type is given:',b.type);
                    CreditType.findOne({slug:b.type},{}, function(e, creditType){
                        if(e) throw e;
                        if(creditType){
                            callback(null, creditType._id);
                        }else{
                            callback(null,0);
                        }
                    }); 
                }else{
                    console.log('type is not given');
                    callback(null,0);
                } 
            },
            function(callback){  //category
                var categories=[];
                var orQuery=[];  // for finding all needed categories 
                if(b.category){  // given category as 'category' field
                    console.log('category is given',b.category);
                    orQuery.push({slug:b.category});
                }
                if(b.carCondition){ // extended filter element, values: ['new-car','used-car',0]
                    console.log('car condition is given',b.carCondition);
                    if(b.carCondition=='new-car'){
                        orQuery.push({slug:newCarCategoryAlias});
                    }else if(b.condition=='used-car'){
                        orQuery.push({slug:usedCarCategoryAlias});
                    }
                }

                if(orQuery.length){
                    CreditCategory.find({$or:orQuery},{},function(err,cats){
                        if(err) return next(err);
                        if(cats && cats.length){
                            cats.forEach(function(category,index){
                                categories.push(category._id);
                            });
                            callback(null,categories);
                        }else{
                            console.log('category is not found');
                            callback(null,[]);
                        }
                    });
                }else{
                    console.log('category is not given');
                    callback(null,[]);
                }
            }
        ],
        function(err, results) {
            var andQuery = [{ status: true }];
            if(results[0]){
                andQuery.push({
                    type:results[0]
                });
            }
            if(results[1] && results[1].length){
                andQuery.push({
                    categories:{
                        $all:results[1]
                    }
                });
                console.log('categoryId',results[1]);
            }
            if (b.minAmount && b.maxAmount) {
                andQuery.push({
                    amount: {
                        $gte: b.minAmount,
                        $lte: b.maxAmount
                    }
                });
            }
            if(b.minInitialFee && b.maxInitialFee){
                andQuery.push({
                    initialFee:{
                        $gte:b.minInitialFee,
                        $lte:b.maxInitialFee
                    }
                });
            }
            if (b.minTerm && b.maxTerm) {
                andQuery.push({
                    term: {
                        $gte: b.minTerm,
                        $lte: b.maxTerm
                    }
                });
            }
            console.log(andQuery);

            //finding result by query
            Credit.find({ $and: andQuery }).populate({
                path:'bank',
                select:['logo','name']
            }).populate({
                path:'type',
                select:'name',
            }).exec(function(e, credits) {
                if(e) throw e;
                //res.write(JSON.stringify(credits));
                if(credits){
                    res.json(credits);
                    console.log('Credits are sent');
                }else{
                    throw new Error('no response');
                }
            });
        });     // my most powerful api function :)
    },
    getCategories:function(req,res){
        CreditCategory.find({}, {},function(error, result) {
            if(error) throw error;
            //res.write(JSON.stringify(result));
            if(result && result.length){
                res.json(result);
            }else{
                res.json([]);
            }
        });
    },
    getCategoryByAlias(req,res,next){
        res.end();
    },
    apply:function(req,res,next){
        var b=req.body;
        console.log('body',b);
        var user=req.session.user;
        if(user._id && b.email && b.firstName && b.lastName && b.credit._id){
            // change phone number of user
            Account.findByIdAndUpdate(user._id,{phone:b.phone},function(err,user){
                if(err) return next(err);
            });

            var credit=b.credit;
            // add the application details to CreditApplication model
            var creditApplication={
                user:user._id,
                credit:credit._id,
                message:b.message
            }
            CreditApplication.create(creditApplication,function(err,creditApplication){
                if(err) return next(err);
                console.log('new credit application is created',creditApplication)
            });

            //start sending email
            let transporter = nodemailer.createTransport({
                host: 'server1.ahost.uz',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: 'fintech@infinive.uz', // generated ethereal user
                    pass:'(zeoVF*~B?Z}' // generated ethereal password
                }
            });
            // testing smtp server
            transporter.verify(function(error, success) {
               if (error) {
                    console.log('smtp error: ',error);
               } else {
                    console.log('Server is ready to take our messages');
               }
            });

            //preparing content
            var html='<ul>';
            html+='<li>Bank: '+credit.bank.name+'</li>';
            html+='<li>Credit:'+credit.name+'</li>';
            html+='<li>Initial Fee:'+credit.name+'</li>';
            html+='</ul>';

            // setup email data with unicode symbols
            let mailOptions = {
                from: 'fintech@infinive.uz', // sender address
                to: b.email, // list of receivers
                subject: 'Your application sent!', // Subject line
                text: 'Hello world?', // plain text body
                html: html // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log('sending mail error: ',error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                res.json({count:1});

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        }else{
            res.json({count:0});
        }
    },
    findByAlias:function(req,res,next){
        var creditAlias=req.params.creditAlias;
        if(creditAlias){
            Credit.findOne({slug:creditAlias},{}).populate({
                path:'bank',
                select:['name','logo','slug']
            }).exec(function(err,credit){
                if(err) return next(err);
                if(credit){
                    res.json(credit);
                }else{
                    res.json({});
                }
            });
        }else{
            res.json({});
        }
    },
    getSpecials: function(req, res,next) {
        Credit.find({
            status:true,
            special:true
        }).populate({
            path:'bank',
            select:['logo','name']
        }).populate({
            path:'type',
            select:'name',
        }).exec(function(e, credits) {
            if(e) return next(e);
            //res.write(JSON.stringify(credits));
            if(credits){
                res.json(credits);
                console.log('Special Credits are sent');
            }else{
                throw new Error('no response');
            }
        });
    }
};

module.exports = creditAPI;