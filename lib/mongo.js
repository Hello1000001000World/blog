const mongoose = require('mongoose')
const config = require('../config/config.js')
mongoose.connect(config.mongodb,{ useNewUrlParser: true })
//const db = mongoose.connection

const Schema = mongoose.Schema

const UserSchema = Schema({
  name: { type: 'string', required: true },
  password: { type: 'string', required: true },
  avatar: { type: 'string', required: true },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: 'string', required: true }
})

const PostSchema = Schema({
  author: { type: Schema.Types.ObjectId, required: true,ref:'User' },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  pv: { type: 'number', default: 0 },
  commentsCount:{ type: 'number', default: 0 }
})

const commentSchema = Schema({
	author:{type:Schema.Types.ObjectId,required:true},
	content:{type:'string',required:true},
	PostId:{type:Schema.Types.ObjectId,required:true}
})

exports.User = mongoose.model('User', UserSchema)
exports.Post = mongoose.model('Post', PostSchema)
exports.Comment = mongoose.model('Comment',commentSchema)
