const express = require('express')
const router = express.Router()
const PostModel = require('../lib/mongo.js').Post
const CommentModel = require('../lib/mongo.js').Comment

const checkLogin = require('../middlewaers/check.js').checkLogin

router.get('/create', checkLogin, function (req, res, next) {
  res.render('create')
})

router.post('/create', checkLogin, function (req, res, next) {
  const author = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content
  //校验
  try{
  	if(!title.length||!content.length)
  		throw '缺少内容'
  }catch(e){
    req.flash('error','缺少内容')
  	return res.redirect('back')
  }
  let post = {
  	author: author,
    title: title,
    content: content
  }

  PostModel.create(post,function(err,doc){
  	if(!err){
  		req.flash('success','发表成功')
  		res.redirect(`/posts/${doc._id}`)
  		next()
  	}else{
  		req.flash('error','数据库写入失败')
  	}
  })
})

router.get('/:postId/edit', checkLogin, function (req, res, next) {
  const postId = req.params.postId
  const author = req.session.user._id

  PostModel.findOne({_id:postId},function(err,doc){
    if(!err){
      if(doc.author.toString() !== author.toString())
        return req.flash('error','权限不足')
      else
        res.render('edit', {
          post: doc
        })
    }
  })
})

router.post('/:postId/edit',function(req,res,next){
  const postId = req.params.postId
  const author = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content

  //校验
  if(!title.length||!content.length){
    return req.flash('error','内容缺少')
  }

  PostModel.findOne({_id:postId},function(err,doc){
    if(!err){
      if(doc.author.toString() !== author.toString())
        return req.flash('error','权限不足')
      else{
        doc.title = title
        doc.content = content
        doc.save()
        req.flash('success','更新成功')
        res.redirect(`/posts/${postId}`)
      }
    }
  })
})

//加星
router.get('/:postId', function (req, res, next) {
  const postId = req.params.postId

  var p = new Promise(function(resolve,reject){
    PostModel.findOne({_id:postId}).
    populate({path:'author',model:'User'}).
    exec(function(err,doc){
      if(!err && doc)
        resolve(doc)
    })
  })

  p.then(function(post){
    CommentModel
    .find({PostId:postId})
    .populate({path:'author',model:'User'})
    .exec(function(err,comments){
      post.pv++
      post.commentsCount = comments.length
      post.save()
      res.render('post', {
        post: post,
        comments: comments
      })
    })
  })

})

router.get('/:postId/remove', checkLogin, function (req, res, next) {
  const postId = req.params.postId
  const author = req.session.user._id

  PostModel.findOne({_id:postId},function(err,doc){
    if(!err){
      if(doc.author.toString() !== author.toString())
        return req.flash('error','权限不足')
      else{
        PostModel.remove({_id:postId},function(err){
          if(!err){
            req.flash('success','删除成功')
            res.redirect('/posts')
          }
        })
      }
    }
  })
})

router.get('/',checkLogin,function(req,res,next){
  const author = req.query.author
  //个人主页
  if(author){
    PostModel.find({author:author}).
    populate({path:'author',model:'User'}).
    exec(function(err,doc){
      if(!err){
        res.render('posts', {
             posts: doc
        })
      }else{console.log(err);}
    })
  }else{
  //全部文章
  console.log(req.url)
    PostModel.find().
    populate({path:'author',model:'User'}).
    exec(function(err,doc){
      if(!err){
        res.render('posts', {
             posts: doc
        })
      }else{console.log(err);}
    })
  }
})


module.exports = router