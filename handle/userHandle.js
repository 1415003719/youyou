let model = require('./../db/schema');
let ObjectID = require('mongodb').ObjectID;//引入mongoose包


//返回首页
exports.home=async function(ctx,next){
		await ctx.render('index');
}
//获取登录状态
exports.getLoginState=async function(ctx,next){
		if(ctx.session.userLogin==1){
				ctx.body={"userLogin":1,"userName":ctx.session.userName};
		}else{
				ctx.body={"userLogin":0,"userName":null};
		}
}
//返回用户注册页面
exports.register=async function(ctx,next){
		await ctx.render('user/register');
}
//返回登录页
exports.login=async function(ctx,next){
		if(ctx.session.userLogin==1){
				await ctx.redirect('/users')
				return;
		}else{
				await ctx.render("user/login");
				return;
		}
}
//检查用户登录
exports.checkLogin=async function(ctx,next){
		let exeitUser = await model.User.find(ctx.request.body);
		if(exeitUser.length==0){
				ctx.body={"result":-1};
		}else{
			ctx.session.userLogin=1;
			ctx.session.userName=exeitUser[0].username;
			console.log(exeitUser[0].username)
			ctx.body={"result":1};
		}
}
//退出登录
exports.loginOut=async function(ctx,next){
		ctx.session.userLogin=null;
		ctx.session.userName=null;
		await ctx.redirect('/users')
}
//获取商品信息
exports.getAllGoods=async function(ctx,next){
		let allType= await model.GoodsType.find({});
		let allGoods=await model.Goods.find({});
		let fenlei=[];
		for(var j=0;j<allType.length;j++){
				let goods=[];
				for(var i=0;i<allGoods.length;i++){
						if(allType[j].name==allGoods[i].type[0].name){
							goods.push(allGoods[i]);
						}
				}
				let goodsInfo={"type":allType[j],"goods":goods};
				fenlei.push(goodsInfo)
		}
		ctx.body={"result":fenlei}
}

//获取评论
exports.getComments=async function(ctx,next){
		let allComments=await model.Comment.find({});
		ctx.body={"result":allComments};
}

//跳转到个人订单页面
exports.toMyOrderPage=async function(ctx,next){
		if(ctx.session.userLogin==1){
				let goods=ctx.request.body.orders;
				if(goods.length==0){
					ctx.body={"result":"1","username":ctx.session.userName}
					return;
				}
				let user=await model.User.findOne({"username":ctx.session.userName});
				for(let i=0;i<goods.length;i++){
						let one=new model.Goods(goods[i]);
						let order=new model.Order({"user":user,"goods":one,"date":new Date(),"state":false});
						await order.save();
				}
				ctx.body={"result":"1","username":ctx.session.userName}
		}else{
			ctx.body={"result":-1,"username":null};
		}
		
}
//检查用户注册信息
exports.checkRegister=async function(ctx,next){
		let exeitUser=await model.User.find({"phone":ctx.request.body.phone});
		if(exeitUser.length==0){
				let user=new model.User(ctx.request.body);
				await user.save();
				ctx.session.userLogin=1;
				ctx.session.userName=user.username;
				user=null;
				ctx.body={"result":1};
		}else{
			ctx.body={"result":-1};
		}
}

//获取我的订单信息
exports.getMyOrder=async function(ctx,next){
		// let username = ctx.session.userName;要判断是否登录
		if(ctx.session.userLogin==1){
			let username=ctx.session.userName;
			let user=await model.User.findOne({"username":username});
			let orders=await model.Order.find({user: [user]});
			console.log(orders)
			let address=user.address;
			ctx.body={"result":orders,"address":address};
		}else{
			ctx.body={"result":-1};
		}
}

//接收评论信息
exports.comment=async function(ctx,next){
	 let username=ctx.session.userName;
		let user=await model.User.findOne({"username":username});//应该从session中获取，需要改
		let comments = ctx.request.body.comment;
		let id=ctx.request.body.id;
		let goods=await model.Goods.findById({_id:id});
		let comment=new model.Comment({user:user,date:new Date(),"comment":comments});
		await comment.save();
		ctx.body={"result":"1"}
}
//用户修改密码
exports.modifyPassword=async function(ctx,next){
		if(ctx.session.userLogin==1){
			let user=await model.User.findOne({"username":"zhx"});//应该从session中获取，需要改
			let oldPassword=ctx.request.body.oldpassword;
			let password=ctx.request.body.password;
			if(user.password==oldPassword){
				await user.update({$set:{password:password}});
				let orders=await model.Order.find({user:[user]});
				let comment=await model.Comment.find({user:[user]});
				for(let i=0;i<orders.length;i++){
						orders[i].user[0].password=password;
						await orders[i].save();
				}
				for(let i=0;i<comment.length;i++){
						comment[i].user[0].password=password;
						await comment[i].save();
				}
				ctx.body={"result":"1"}
			}else{
				ctx.body={"result":"-1"}
			}
		}else{
			ctx.body={"result":0}
		}
}

//修改地址
exports.modifyAddress=async function(ctx,next){
		if(ctx.session.userLogin==1){
			 let user=await model.User.findOne({"username":"zhx"});//应该从session中获取，需要改
			 let address=ctx.request.body.address;
				await user.update({$set:{address:address}});
				let orders=await model.Order.find({user:[user]});
				let comment=await model.Comment.find({user:[user]});
				for(let i=0;i<orders.length;i++){
						orders[i].user[0].address=address;
						await orders[i].save();
				}
				for(let i=0;i<comment.length;i++){
						comment[i].user[0].address=address;
						await comment[i].save();
				}
				ctx.body={"result":"1"}
		}else{
				ctx.body={"result":0}
			}
}