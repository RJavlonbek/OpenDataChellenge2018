var mongoose=require('mongoose');

var RoleSchema=new mongoose.Schema({
	id:{
		type:String
	},
	name:{
		type:String
	},
	status:{
		type:Boolean
	}
});


module.exports=mongoose.model('Role',RoleSchema);