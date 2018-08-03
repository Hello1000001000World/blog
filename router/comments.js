const express = require('express')
const router = express.Router()
const CommentModel = require('../lib/mongo.js').Comment

//导入判断是否登录的中间件
const checkLogin = require('../middlewaers/check.js').checkLogin

//留言
router.post('/',checkLogin,function(req,res,next){
	//创建留言
	const author = req.session.user._id
	const PostId = req.fields.postId
	const content = req.fields.content

	if(!content.length||!author){
		req.flash('error','缺少内容')
		return res.redirect('back')
	}

	const comment = {
		author,
		PostId,
		content
	}
	
	CommentModel.create(comment,function(err){
		if(!err){
			req.flash('success','留言成功')
			res.redirect('back')
		}else
		console.log(err)
	})

})

//留言
router.get('/:commentId/remove',checkLogin,function(req,res,next){
	//删除留言
	const commentId = req.params.commentId
	const author = req.session.user._id

	CommentModel.findOne({_id:commentId},function(err,doc){
		if(!doc)
			return req.flash('error','留言不存在')
		if(doc.author.toString()!==author.toString())
			return req.flash('error','权限不足')
		CommentModel.remove({_id:commentId},function(err){
			if(!err){
				req.flash('success','删除成功')
				res.redirect('back')
			}
		})
	})
})

module.exports = router