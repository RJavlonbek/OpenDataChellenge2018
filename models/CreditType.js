var mongoose=require('mongoose');

var CreditTypeSchema=new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	slug:{
		type:String,
		slug:'name',
		unique:true
	},
	status:{
		type:Boolean
	},
	addDate:{
		type:Date,
		default:Date.now
	}
});


module.exports=mongoose.model('CreditType',CreditTypeSchema);