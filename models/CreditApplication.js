var mongoose=require('mongoose');
var Types=mongoose.Schema.Types;

var CreditApplicationSchema=new mongoose.Schema({
	user:{
		type:Types.ObjectId,
		ref:'User'
	},
	credit:{
		type:Types.ObjectId,
		ref:'Credit'
	},
	date:{
		type:Date,
		default:Date.now
	},
	message:{
		type:String
	}
});


module.exports=mongoose.model('CreditApplication',CreditApplicationSchema);