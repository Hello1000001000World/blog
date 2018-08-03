module.exports = {
	checkLogin:function checkLogin(req,res,next){
		if(!req.session.user){
			//还未登录
			return res.redirect('/signin')	//跳转
		}
		next()
	},
	checkNotLogin:function checkNotLogin(req,res,next){
		if(req.session.user){
			//已登录
			return res.redirect('back')		//返回之前页面
		}
		next()
	}
}