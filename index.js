const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const router = require('./router/index.js')
const config = require('./config/config.js')
const flash = require('connect-flash')
var expressWinston = require('express-winston')
var winston = require('winston');
const pkg = require('./package')

const app = express()
app.use(flash())

// session 中间件
app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  })
}))

//设置模板引擎目录
app.set('views',path.join(__dirname,'views'))
//设置模板引擎
app.set('view engine','ejs')


//设置静态文件目录
app.use(express.static(path.join(__dirname,'public')))

// 设置模板全局常量
//挂载在app.locals上
app.locals.blog = {
  title: config.name,
  description: config.description
}
// 添加模板必需的三个变量，挂在res.locals上
app.use(function (req, res, next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

//处理表单文件上传
// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
  keepExtensions: true// 保留后缀
}))

// app.use(expressWinston.logger({
//       transports: [
//         new winston.transports.Console({
//           json: true,
//           colorize: true
//         })
//       ]
//     }));
// 路由
router(app)
// 错误请求的日志
// app.use(expressWinston.errorLogger({
//   transports: [
//     new winston.transports.Console({
//       json: true,
//       colorize: true
//     }),
//     new winston.transports.File({
//       filename: 'logs/error.log'
//     })
//   ]
// }))

app.use(function(err,req,res,next){
  req.flash('error', err.message)
  res.redirect('/posts')
})

app.listen(config.port,function () {
		console.log('启动了！！！')
})