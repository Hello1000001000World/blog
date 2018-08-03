const User = require('../lib/mongo.js').User

module.exports = {
	//注册一个用户
	create: function create (user) {
		return new Promise(function(resolve,reject){
			User.find({name:user.name},function(err,doc){
				if(doc)
					return Promise.reject()
				else
					return Promise.resolve();
			})
		}).then(function(){
			User.create(user,function(err,doc){
				if(!err)
					resolve('创建成功');
				else
					reject('创建失败');
			})
		},function(){
			reject('名字重复');
		})


		// User.find({name:user.name},function(err,doc){
		// 	if (!doc) {
		// 		User.create(user,function(err,doc){
		// 			if(!err)
		// 				return '创建成功'
		// 			else
		// 				return '创建失败'
		// 		})
		// 	}else
		// 	return '名字重复'
		// })
 	}
}