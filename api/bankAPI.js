var modelsDir = '../models/';
var Bank = require(modelsDir + 'Bank');
var bankAPI = {
    findAll: function(req, res) {
        Bank.find({ status: true }, {}, function(error, result) {
            res.json(result);
        });
    },
    find: function(req, res) {
        Bank.findOne({ $and: [{ id: req.params.id }, { status: true }] }, function(e, result) {
            res.write(JSON.stringify(result));
            res.end();
        });
    },
    findByAlias:function(req,res,next){
        var slug=req.params.alias||'';
        Bank.findOne({slug:slug},{},function(err,bank){
            if(err) return next(err);
            if(bank){
                res.json(bank);
            }else{
                res.json({});
            }
        });
    },
    findMyBank:function(req,res,next){
        if(req.session.user){
            var userId=req.session.user._id;
            Bank.findOne({users:{$elemMatch:{$eq:userId}}},{},function(err,bank){
                if(err) return next(err);
                if(bank){
                    res.json(bank);
                }else{
                    res.json({});
                }
            })
        }else{
            res.json({});
        }
    },
    addUser:function(req,res,next){
        var bankId=req.body.bankId;
        var userId=req.session.user._id;
        Bank.findByIdAndUpdate(bankId,{$push:{users:userId}},function(err,result){
            if(err) return next(err);
            res.json({count:1});
        });
    }
};
module.exports = bankAPI;