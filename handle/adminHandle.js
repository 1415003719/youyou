let model = require('./../db/schema');
let ObjectID = require('mongodb').ObjectID;//引入mongoose包

let fs=require('fs');
let path=require('path');
let config=require('./../db/config');
const imgFloder=path.join(__dirname,"../public/images/goods");

exports.adminLoginPage=async function(ctx,next){
		await ctx.render("admin/adminLogin",{"msg":""});
}

exports.checkLogin = async function(ctx,next){
	 let admin=new model.Admins(ctx.request.body)
		let doc= await model.Admins.find();
		if(doc.length==0){	
			//创建默认的管理员账号
			admin=new model.Admins(ctx.request.body);
			admin.save().catch(err=>{console.log("错误"+err)});
			admin.password=null;
			ctx.session.admin=admin.name;
			await ctx.redirect('admin/main');
		}else{
			//进行判断
			let exit = await model.Admins.findOne(ctx.request.body);
			if(exit){
				admin.password=null;
				ctx.session.admin=admin.name;
				ctx.session.adminLogin=1;
				await ctx.redirect('/admin/main');
			}else{
				await ctx.render("admin/adminLogin",{"msg":"用户名或密码错误！"});
			}
		}
}

exports.toMainPage=async function(ctx,next){
		if(ctx.session.adminLogin==1){
			await ctx.render('admin/main');
			return;
		}else{
			await ctx.redirect("/admin");
			return;
		}
}


//添加商品类型
exports.addGoodsType=async function(ctx,next){
		if(ctx.session.adminLogin==1){
			let goodsType=new model.GoodsType(ctx.request.body);
			await goodsType.save();
			ctx.body={"status":200,"result":1};
		}else{
			ctx.body={"status":404,"result":-1};
		}
}

//获取商品类型
exports.getGoodsType=async function(ctx,next){
		if(ctx.session.adminLogin==1){
				let allGoodsType=await model.GoodsType.find({}).catch(err=>{
					throw err;
				});
				ctx.body={"allGoodsType":allGoodsType};
			}else{
				ctx.body={"allGoodsType":-1};
			}
}

//添加商品
exports.addGoods=async function(ctx,next){
		//图片传过来为二进制文件，首先要找到该二进制文件，对其进行命名，名字和传之前的文件名保持一致，
		//
		if(ctx.session.adminLogin==1){
			let pathT=ctx.request.body.files.img.path;
			let imgName=ctx.request.body.files.img.name;
			let imgFullPath=path.join(imgFloder,imgName);
			let baocunPath='/public/images/goods/'+imgName;
			let name=ctx.request.body.fields.name;
			let price=ctx.request.body.fields.price;
			let sales=0;
			let selectedType=ctx.request.body.fields.selectedType;
			let goodsType=await model.GoodsType.findOne({"name":selectedType});
			await fs.renameSync(pathT,imgFullPath);
			baocunPath='images/goods/'+imgName;
			let goods=new model.Goods({"name":name,"price":price,"sales":sales,"type":goodsType,"img":baocunPath});
			await goods.save();
			ctx.body={"result":1};
		}else{
				ctx.body={"result":-1};
		}

}

//获取全部商品
exports.getAllGoods=async function(ctx,next){
		if(ctx.session.adminLogin){
			let currPage=0;
			if(ctx.request.query.page){
				 currPage=parseInt(ctx.request.query.page);
			}
			let allgoods=await model.Goods.find({}).skip(config.limit*currPage).limit(config.limit).exec();
			let count = await model.Goods.count({});
			let allPage=Math.ceil(count/config.limit);
			ctx.body={"result":allgoods,"currPage":currPage,"count":count,"allPage":allPage};
		}else{
			ctx.body={"result":-1};
		}
}

//获取单个商品信息
exports.getGoodsInfo=async function(ctx,next){
		if(ctx.session.adminLogin==1){
				let id=ctx.request.query.id;
				let allGoodsType=await model.GoodsType.find({}).catch(err=>{
						throw err;
				});
				let goodsInfo=await model.Goods.findOne({"_id":id});
				ctx.body={"allGoodsType":allGoodsType,"goodsInfo":goodsInfo};
		}else{
				ctx.body={"allGoodsType":-1};
		}
}

//修改商品
exports.editeGoods=async function(ctx,next){
		if(ctx.session.adminLogin==1){
				 let id=ctx.request.body.fields.id.toString();
					let pathT=ctx.request.body.files.img.path;
					let imgName=ctx.request.body.files.img.name;
					let imgFullPath=path.join(imgFloder,imgName);
					let baocunPath='public/images/goods/'+imgName;
					let name=ctx.request.body.fields.name;
					let price=ctx.request.body.fields.price;
					let sales=0;
					let selectedType=ctx.request.body.fields.selectedType;
					let goodsType=await model.GoodsType.findOne({"name":selectedType});
					await fs.renameSync(pathT,imgFullPath);
					baocunPath='images/goods/'+imgName;
					await model.Goods.findByIdAndUpdate({"_id":id},{$set:{"name":name,"price":price,"sales":sales,"type":goodsType,"img":baocunPath}})
					ctx.body={"result":1};
				}else{
					ctx.body={"result":-1};
				}
}

//下架商品
exports.cancelGoods=async function(ctx,next){
			if(ctx.session.adminLogin==1){
				let id=ctx.request.query.id;
				console.log(new ObjectID(id))
				await model.Goods.findOneAndRemove({"_id":new ObjectID(id)})
				ctx.body={"ok":1}
			}else{
					ctx.body={"ok":-1}
			}
}

//获取所有注册用户
exports.getAllUsers=async function(ctx,next){

		if(ctx.session.adminLogin==1){
			let currPage=0;
			if(ctx.request.query.page){
				 currPage=parseInt(ctx.request.query.page);
			}
			let allusers=await model.User.find({}).skip(config.limit*currPage).limit(config.limit).exec();
			let count = await model.User.count({});
			let allPage=Math.ceil(count/config.limit);
			ctx.body={"result":allusers,"currPage":currPage,"count":count,"allPage":allPage};
		}else{
				ctx.body={"result":-1};
		}
}

//删除用户
exports.deleteUser=async function(ctx,next){
		if(ctx.session.adminLogin==1){
			let id=ctx.request.query.id;
			await model.User.findOneAndRemove({"_id":new ObjectID(id)})
			ctx.body={"result":1}

		}else{
				ctx.body={"result":-1}
		}
}


//获取所有未处理订单
exports.getAllNewOrders=async function(ctx,next){
  if(ctx.session.adminLogin==1){
  	let currPage=0;
			if(ctx.request.query.page){
				 currPage=parseInt(ctx.request.query.page);
			}
			let allorders=await model.Order.find({state:false}).skip(config.limit*currPage).limit(config.limit).exec();
			let count = await model.Order.count({state:false});
			let allPage=Math.ceil(count/config.limit);
			ctx.body={"result":allorders,"currPage":currPage,"count":count,"allPage":allPage};
  }else{
  		ctx.body={"result":-1};
  }
}

//处理订单
exports.doOrders=async function(ctx,next){
		if(ctx.session.adminLogin==1){
			let id=ctx.request.query.id;
			let order=await model.Order.findById({'_id':id});
			order.state=true;
			await order.save();
			ctx.body={"result":1}
		}else{
			ctx.body={"result":-1}
		}
}

//所有已处理订单
exports.getAllOldOrders=async function(ctx,next){
		if(ctx.session.adminLogin==1){
			let currPage=0;
			if(ctx.request.query.page){
				 currPage=parseInt(ctx.request.query.page);
			}
			let allorders=await model.Order.find({state:true}).skip(config.limit*currPage).limit(config.limit).exec();
			let count = await model.Order.count({state:true});
			let allPage=Math.ceil(count/config.limit);
			ctx.body={"result":allorders,"currPage":currPage,"count":count,"allPage":allPage};
		}else{
				ctx.body={"result":-1};
		}
}

//退出登录
exports.loginOut=async function(ctx,next){
		ctx.session.adminLogin=null;
		ctx.session.admin=null;
		ctx.body={"result":1};
}