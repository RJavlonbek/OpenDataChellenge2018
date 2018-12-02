var mongoose=require('mongoose');
var Types=mongoose.Schema.Types;

var AccountSchema=new mongoose.Schema({
	fullName:{
		type:String
	},
	password:{
		type:String
	},
	roleId:{
		type:String
	},
	status:{
		type:Boolean
	},
	firstName:{
		type:String
	},
	lastName:{
		type:String
	},
	username:{
		type:String,
		match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
		unique:true
	},
	slug:{
		type:String,
		slug:'username'
	},
	email:{
		type:String,
		lowercase:true,
		match: [/\S+@\S+\.\S+/, 'is invalid'],
		unique:true
	},
	phone:{
		type:String
	},
	org:{},
	favoriteOrgs:[{}],
	address:{
		type:String
	},
	postsCount:{
		type:Number
	},
	level:{
		type:Number
	},
	registered:{
		type:Boolean
	},
	accessedUrls:[{
		type:String
	}],
	lastSeen:{
		type:Date,
		default:new Date()
	}
},{timestamp:true});


module.exports=mongoose.model('Account',AccountSchema);