let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/youyou');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',async function (err) {
		if(err){
			throw err;
		}
  	console.log("连接数据库成功！");
});

module.export=db;