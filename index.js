#!/usr/bin/env node
var mongoose=require('mongoose');
var program =require('commander');
var inquirer =require('inquirer');

mongoose.connect('mongodb://cliuser:clipassword1@ds245234.mlab.com:45234/customercli');

var CustomerSchema=mongoose.Schema({
	fname:String,
	lname:String,
	phone:String,
	email:String
});

var Customer= mongoose.model('Customer',CustomerSchema);

const addCustomer=function(customer)
{
 	var cus1=Customer({fname:customer.fname,lname:customer.lname,phone:customer.phone,email:customer.email}).save(function(err){
		if(err) throw err;
	});
	console.log('Customer added');
}

const findCustomer=function(name){

	const search=new RegExp(name,'i');
	Customer.find({fname:search},function(err,data){
		if(err) throw err;
		console.log(data);
		console.log(data.length + ' matches');
	});
}

const updateCustomer=function(_id,customer){
    
    var query={_id:_id};
	Customer.update(query,customer,function(err){
		if(err) throw err;
	});
	console.log('Customer updated');
}

const removeCustomer=function(_id){
    
    var query={_id:_id};
	Customer.remove(query,function(err){
		if(err) throw err;
	});
	console.log('Customer removed');
}

const listCustomer=function(){

	Customer.find({},function(err,data){
		if(err) throw err;
		console.log(data);
		console.log(data.length + ' customers');
	});
}

program
	.version('1.0.0')
	.description('Client Management System')

//program
//	.command('add <firstname> <lastname> <phone> <email>')
//	.alias('a')
//	.description('Add a customer')
//	.action(
//		function(firstname,lastname,phone,email){
//			addCustomer({fname:firstname,lname:lastname,phone:phone,email:email});
//		})

var ques=[
{type:'input',name:'fname',message:'Customer First Name'},
{type:'input',name:'lname',message:'Customer Last Name'},
{type:'input',name:'phone',message:'Customer Phone Number'},
{type:'input',name:'email',message:'Customer Email'},
];

program
	.command('add')
	.alias('a')
	.description('Add a customer')
	.action(function(){
		inquirer.prompt(ques).then(function(answers) {
 				addCustomer(answers);
		});
	})

program
	.command('find <name>')
	.alias('f')
	.description('Find a customer')
	.action(
		function(name){
			findCustomer(name);
		})

program
	.command('update <_id>')
	.alias('u')
	.description('Update a customer')
	.action(function(_id){
		inquirer.prompt(ques).then(function(answers) {
 				updateCustomer(_id,answers);
		});
	})	

program
	.command('remove <_id>')
	.alias('r')
	.description('Remove a customer')
	.action(
		function(_id){
			removeCustomer(_id);
		})

program
	.command('list')
	.alias('l')
	.description('List all customers')
	.action(
		function(){
			listCustomer();
		})

program.parse(process.argv);