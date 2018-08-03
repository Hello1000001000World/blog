const express = require('express')
const router = express.Router()
const sha1 = require('sha1')
const usermodel = require('../lib/mongo.js').User

//导入判断是否登录的中间件
const checkNotLogin = require('../middlewaers/check.js').checkNotLogin

//登录页
router.get('/',checkNotLogin,function(req,res,next){
	//登录页代码
	res.render('signin')
})

//用户登录
router.post('/',checkNotLogin,function(req,res,next){
	//用户登录代码
	const name = req.fields.name
	const password = req.fields.password
	try{
		if(!name.length||!password.length)
			throw '没有用户名或密码'
	}catch(e){
		return res.redirect('back')
	}

	usermodel.find({name:name},function(err,doc){
		if(doc[0]){
			if(sha1(password)!==doc[0].password){
				req.flash('error','密码错误')
				return //res.location('back')
			}else{
				//登录成功
				req.session.user = doc[0]
				req.session.user.password = null
				res.redirect('/posts')
			}
		}else{
			req.flash('error','用户不存在')
			return res.redirect('back')
		}
	})
	//next()
})

module.exports = router