let mongoose = require('mongoose');//引入mongoose包

//管理员schema
let adminsSchema = new mongoose.Schema({
		name: String,
		password: String
})


//用户schema   像实体
let userSchema=new mongoose.Schema({
		username: String,
		password: String,
		address:  String,
		phone:    String
});

//注册方法
userSchema.statics.add=async function(ctx,user){
		let doc= this.findOne({username: user.username});
		if(doc){
				return { status: 'error', msg: '此用户名已被注册' };
		}
		let u = await user.save();
    user.password = null;
    ctx.session.user = user;
    return { status: 'success', msg: '注册成功', user };
}
//


//商品类型
let goodsType=new mongoose.Schema({
		name: String,
		intro: String,
		date: Date
})

//商品schema
let goodsSchema=new mongoose.Schema({
	  name: String,
	  price: Number,
	  sales: Number,
	  type : [goodsType],
	  img: String
})

//评论
let commentSchema=new mongoose.Schema({
		user: [userSchema],
		date: Date,
		comment: String
})

//订单表
let orderSchema=new mongoose.Schema({
		user: [userSchema],
		goods: [goodsSchema],
		date: Date,
		state: Boolean
})

exports.Admins=mongoose.model("Admins",adminsSchema);
exports.User = mongoose.model("User", userSchema);
exports.GoodsType = mongoose.model("GoodsType", goodsType);
exports.Goods = mongoose.model("Goods", goodsSchema);
exports.Comment = mongoose.model("Comment", commentSchema);
exports.Order = mongoose.model("Order", orderSchema);