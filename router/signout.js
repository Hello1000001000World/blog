const express = require('express')
const router = express.Router()

//导入判断是否登录的中间件
const checkLogin = require('../middlewaers/check.js').checkLogin

//登出页
router.get('/',checkLogin,function(req,res,next){
	//登出,缺少提示,后面补
	req.session.destroy(function(err){
		if(!err)
			req.flash('success','登出成功')
	})
	res.redirect('/posts')
})

module.exports = router