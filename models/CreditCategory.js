var mongoose =require('mongoose');

var CreditCategorySchema=new mongoose.Schema({
	name:{
		type:String
	},
	slug:{
		type:String,
		slug:'name',
		unique:true
	},
	langKey:{
		type:String,
		default:'Category'
	},
	status:{
		type:Boolean
	},
	addDate:{
		type:Date,
		default:Date.now
	}
});


module.exports=mongoose.model('CreditCategory',CreditCategorySchema);