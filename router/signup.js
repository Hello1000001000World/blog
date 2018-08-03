const express = require('express')
const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const router = express.Router()

const UserModel = require('../lib/mongo.js').User
//导入判断是否登录的中间件
const checkNotLogin = require('../middlewaers/check.js').checkNotLogin

//注册页
router.get('/',checkNotLogin,function(req,res,next){
	res.render('signup')
})

//用户登录
router.post('/',checkNotLogin,function(req,res,next){
	//用户注册代码
	const name = req.fields.name
	const gender = req.fields.gender
	const bio = req.fields.bio
	//头像,通过'/'切割成数组,再返回数组最后一个元素
	const avatar = req.files.avatar.path.split(path.sep).pop()
  	let password = req.fields.password
  	const repassword = req.fields.repassword

  	// 校验参数
  	try {
	    if (!(name.length >= 1 && name.length <= 10)) {
	      throw '名字请限制在 1-10 个字符'
	    }
	    if (['m', 'f', 'x'].indexOf(gender) === -1) {
	      throw '性别只能是 m、f 或 x'
	    }
	    if (!(bio.length >= 1 && bio.length <= 30)) {
	      throw '个人简介请限制在 1-30 个字符'
	    }
	    if (!req.files.avatar.name) {
	      throw '缺少头像'
	    }
	    if (password.length < 6) {
	      throw '密码至少 6 个字符'
	    }
	    if (password !== repassword) {
	      throw '两次输入密码不一致'
	    }
	  } catch (e) {
	  	console.log(e)
	  	req.flash('error',e)
	    // 注册失败，异步删除上传的头像
	    fs.unlink(req.files.avatar.path)
	    //req.flash('error', e.message)
	    return res.redirect('/signup')
	  }
	  // 明文密码加密
  password = sha1(password)
  // 待写入数据库的用户信息
  let user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar
  }

  //用户信息写入数据库
  UserModel.find({name:name},function(err,doc){
  	if(doc[0]){
  		req.flash('error', '用户名已被占用')
  		fs.unlink(req.files.avatar.path)
        return res.redirect('/signup')
  	}else{
  		UserModel.create(user,function(err,doc){
  			if(!err){
		  	  // 此 user 是插入 mongodb 后的值，包含 _id
		      //user = result.ops[0]
		      // 删除密码这种敏感信息，将用户信息存入 session
		      req.session.user = doc
		      req.session.user.password = null
		      // 写入 flash
		      req.flash('success', '注册成功')
		      // 跳转到首页
		      res.redirect('/posts')
  			}else{
  			  // 注册失败，异步删除上传的头像
  			  console.log(err)
      		  fs.unlink(req.files.avatar.path)
      		  req.flash('error', '数据库写入出错')
  			}
  		})
  	}
  })

})

module.exports = router