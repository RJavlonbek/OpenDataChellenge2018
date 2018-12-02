var mongoose=require('mongoose');
var Types=mongoose.Schema.Types;

var Document=require('./Document');

//this may change in the future
const solvencyConfirmationAlias='solvency-confirmation';

var CreditSchema=new mongoose.Schema({
	id:{
		type:String
	},
	name:{
		type:String
	},
	slug:{
		type:String,
		slug:'name',
		unique:true
	},
	type:{
		type:Types.ObjectId,
		ref:'CreditType'
	},
	special:{
		type:Boolean
	},
	views:{
		type:Number
	},
	description:{
		type:String
	},
	status:{
		type:Boolean
	},
	bank:{
		type:Types.ObjectId,
		ref:'Bank'
	},
	addDate:{
		type:Date,
		default: Date.now
	},
	publishDate:{
		type:Date,
		default: Date.now
	},
	editDate:{
		type:Date
	},
	published:{
		type:Boolean
	},
	interestRate:{
		type:Number
	},
	amount:{
		type:Number
	},
	initialFee:{   //pervonachalniy vznos
		type:Number
	},
	term:{       //time for credit in months
		type:Number
	},
	// payment:{     //payment for one month
	// 	type:Number
	// },
	// overpayment:{  
	// 	type:Number
	// },
	data:[{
		minAmount:{
			type:Number
		},
		maxAmount:{
			type:Number
		},
		initialFee:{
			type:Number
		},
		term:{
			type:Number
		},
		interestRate:{
			type:Number
		}
	}],
	requiredAge:{
		type:Number
	},
	withInsurance:{
		type:Boolean
	},
	requireSolvencyConfirmation:{
		type:Boolean,
		default:false
	},
	requiredExperience:{    // required Experience in the last place of work in months
		type:Number
	},
	documents:[{
		type:Types.ObjectId,
		ref:'Document'
	}],
	categories:[{
		type:Types.ObjectId,
		ref:'CreditCategory'
	}]
},{
	toObject:{
		virtuals:true
	},
	toJSON:{
		virtuals:true
	}
});

CreditSchema.post('save',function(credit){
	Document.findOne({slug:solvencyConfirmationAlias},{},function(err,doc){
		if(err) next(err);
		if(doc){
			if(credit.requireSolvencyConfirmation==(credit.documents.indexOf(doc._id)>=0)){
				console.log('already true');
			}else{
				credit.requireSolvencyConfirmation=(credit.documents.indexOf(doc._id)>=0);
				credit.save(function(err){
					console.log('changed',credit);
					//next();
				});
			}
		}else{
			console.log('not changed');
		}
	});
});

CreditSchema.virtual('readyAmount').get(function(){
	if(this.amount){
		var a=this.amount.toString();
		res=[];
		c=0;
		for(var i=a.length-1;i>=0;i--){
			c++;
			res.unshift(a[i]);
			if((c % 3==0) && i!=0){
				res.unshift(' ');
			}
		}
		return res.join('')+' UZS';
	}else{
		return '';
	}
});

CreditSchema.virtual('readyInterestRate').get(function(){
	if(this.interestRate){
		return this.interestRate.toFixed(2)+' %';
	}else{
		return;
	}
});

CreditSchema.virtual('readyInitialFee').get(function(){
	if(this.initialFee){
		return this.initialFee+' %';
	}else{
		return '';
	}
});

CreditSchema.virtual('monthlyPayment').get(function(){
	if(this.amount && this.term){
		var a=this.amount*(1-this.initialFee/100);
		var overpayment=(this.term+1)*a*this.interestRate/2400;
		var p=(a+overpayment)/this.term;
		p=Math.floor(p);
		var a=p.toString();
		res=[];
		c=0;
		for(var i=a.length-1;i>=0;i--){
			c++;
			res.unshift(a[i]);
			if((c % 3==0) && i!=0){
				res.unshift(' ');
			}
		}
		return res.join('')+' UZS';
	}else{
		return '';
	}
});

CreditSchema.virtual('overpayment').get(function(){
	if(this.amount && this.interestRate && this.term){
		var a=this.amount*(1-this.initialFee/100);
		var p=(this.term+1)*a*this.interestRate/2400;
		p=Math.floor(p);
		var a=p.toString();
		res=[];
		c=0;
		for(var i=a.length-1;i>=0;i--){
			c++;
			res.unshift(a[i]);
			if((c % 3==0) && i!=0){
				res.unshift(' ');
			}
		}
		return res.join('')+' UZS';
	}else{
		return '';
	}
});


module.exports=mongoose.model('Credit',CreditSchema);