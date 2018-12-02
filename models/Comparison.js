var mongoose=require('mongoose');
var Types=mongoose.Schema.Types;

const ComparisonSchema=new mongoose.Schema({
	date:{
		type:Date
	},
	autoCredits:[{
		type:Types.ObjectId,
		ref:'Credit'
	}],
	consumerCredits:[{
		type:Types.ObjectId,
		ref:'Credit'
	}],
	seen:{
		type:Boolean,
		default:false
	},
	user:{
		type:Types.ObjectId,
		ref:'Account'
	}
});


module.exports=mongoose.model('Comparison',ComparisonSchema);

