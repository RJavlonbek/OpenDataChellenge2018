var mongoose=require('mongoose');
var Types=mongoose.Schema.Types;

var BankSchema=new mongoose.Schema({
  name:{
    type:String
  },
  slug:{
    type:String,
    slug:'name',
    unique:true
  },
  users:[{
    type:Types.ObjectId,
    ref:'Account'
  }],
  description:{
    type:String
  },
  status:{
    type:Boolean
  },
  logo:{
  	type:String
  },
  special:{
    type:Boolean
  },
  views:{
    type:Number
  }
});

BankSchema.pre('remove',function(next){
  console.log('Bank is about to deleted!');
  return next(e);
});


module.exports=mongoose.model('Bank',BankSchema);