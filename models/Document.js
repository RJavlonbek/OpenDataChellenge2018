var mongoose =require('mongoose');

var DocumentSchema=new mongoose.Schema({
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
		default:'Document'
	},
	status:{
		type:Boolean
	},
	addDate:{
		type:Date,
		default:Date.now
	}
});


module.exports=mongoose.model('Document',DocumentSchema);