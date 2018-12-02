var modelsDir = '../models/';

var Credit = require(modelsDir + 'Credit');
var Account=require(modelsDir+'Account');
var Comparison=require(modelsDir+'Comparison');

var validTypes=['autoCredits','consumerCredits'];

var comparisonAPI={
	getComparisons:function(req,res){
		productType=req.params.type;
		var typeIsValid=validTypes.indexOf(productType)>=0;
		if(typeIsValid){
		    Comparison.findOne({seen:false},{}).populate({
		    	path:productType,
		    	select:['name']
		    }).exec(function(err,comparison){
		    	if(err) throw err;
			    if(comparison){
			    	res.json(comparison[productType]);
			    }else{
			    	res.send([]);
			    }
			});
		}else{
			res.send([]);
		}
	},
	addComparison:function(req,res){
		var productId=req.body.creditId;
		var productType=req.body.type;
		var typeIsValid=validTypes.indexOf(productType)>=0;
		if(typeIsValid){
			console.log('type is valid');
			Account.findOne({username:'admin'},{},function(err,user){
				if(err) throw err;
				Comparison.findOne({
					user:user._id,
					seen:false
				},{},function(err,comparison){
					if(err) throw err;
					if(comparison){
						comparison[productType].push(productId);
						comparison.save(function(err,c){
							if(err) throw err;
						    Comparison.findOne({seen:false},{}).populate({
						    	path:productType,
						    	select:['name']
						    }).exec(function(err,comparison){
						    	if(err) throw err;
							    if(comparison){
							    	res.json(comparison[productType]);
							    	console.log('Credit added to comparison')
							    }else{
							    	res.send([]);
							    }
							});
						});
					}else{
						var newComparison={
							user:user._id
						}
						newComparison[productType]=[productId];
						Comparison.create(newComparison,function(err,c){
							if(err) throw err;
							console.log('new comparison created');
						    Comparison.findOne({seen:false},{}).populate({
						    	path:productType,
						    	select:['name']
						    }).exec(function(err,comparison){
						    	if(err) throw err;
							    if(comparison){
							    	res.json(comparison[productType]);
							    }else{
							    	res.send([]);
							    }
							});
						});
					}
				});
			});
		}else{
			console.log('type is not valid',productType);
			res.send([]);
		}
		//console.log(productId);
	},
	getComparisonsData:function(req,res){
		var productType=req.params.type;
		var typeIsValid=validTypes.indexOf(productType)>=0;
		if(typeIsValid){
			Comparison.findOne({seen:false},{}).populate({
		    	path:productType,
		    	populate:{
		    		path:'bank',
		    		select:['name','logo','slug']
		    	}
		    }).exec(function(err,comparison){
		    	if(err) throw err;
			    if(comparison){
			    	res.json(comparison[productType]);
			    }else{
			    	res.send([]);
			    }
			});
		}else{
			res.send([]);
		}	
	},
	removeComparisonElement:function(req,res){
		console.log('creditId',req.body.creditId);
		var productType=req.body.type;
		var typeIsValid=validTypes.indexOf(productType)>=0;
		if(typeIsValid){
			var updateQuery={
				$pullAll:{}
			}
			updateQuery.$pullAll[productType]=[req.body.creditId];
			Comparison.findOneAndUpdate({seen:false},updateQuery,function(err,comparison){
				if(err) throw err;
				if(comparison){
					console.log('after removing comparison',comparison);
					res.end()
				}else{
					res.send([]);
				}
			});
		}else{
			console.log('type is not valid');
			res.end();
		}
	}
}
module.exports=comparisonAPI;