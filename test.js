const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const router = require('./router/index.js')
const config = require('./config/config.js')

const model = require('./models/user.js')

model.create({
	name:'1232123',
	password:'1123123',
	avatar:'dsdasd',
	bio:'4554'
	}).then(function(msg){
		console.log(msg);
	},function(msg){
		console.log(msg);
	})

// var promise = new Promise(function (sucess,err) {
// 	if(model.create({
// 	name:'12321',
// 	password:'1123123',
// 	avatar:'dsdasd',
// 	bio:'4554'
// 	})=='创建成功')
// 		sucess();
// 	else
// 		err();
// }).then(function(sucess){
// 	console.log('成功');
// },function(err){
// 	console.log('失败');
// }
// );