module.exports = {
	name:'myclog2',
	description:'',
	port:3000,
	session:{
		secret: 'myblog2',
    	key: 'myblog',
    	maxAge: 2592000000
	},
	mongodb:'mongodb://localhost:27017/myblog2'
}