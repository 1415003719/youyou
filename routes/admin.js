let router = require('koa-router')();
let adminHandle = require('./../handle/adminHandle');

router.get('/admin',adminHandle.adminLoginPage);//返回管理员登录页

router.post('/admin/checkLogin',adminHandle.checkLogin);//检查登录信息
router.get('/admin/main',adminHandle.toMainPage);//返回管理员首页
router.post('/admin/addGoodsType',adminHandle.addGoodsType);//添加商品类型
router.get('/admin/getGoodsType',adminHandle.getGoodsType);//获取商品类型
router.post('/admin/addGoods',adminHandle.addGoods);//添加商品
router.get('/admin/getAllGoods',adminHandle.getAllGoods);//获取全部商品信息
router.get('/admin/loginOut', adminHandle.loginOut);//退出登录
router.get('/admin/getGoodsInfo',adminHandle.getGoodsInfo);//获取单个商品信息=>修改页
router.post('/admin/editeGoods',adminHandle.editeGoods);//修改商品
router.get('/admin/cancelGoods',adminHandle.cancelGoods);//下架商品
router.get('/admin/getAllUsers', adminHandle.getAllUsers);//获取所有注册用户
router.post('/admin/deleteUser', adminHandle.deleteUser);//删除用户
router.get('/admin/getAllNewOrders', adminHandle.getAllNewOrders);//获取所有未处理订单
router.get('/admin/doOrders',adminHandle.doOrders);//处理订单
router.get('/admin/getAllOldOrders',adminHandle.getAllOldOrders);//获取所有已处理订单
module.exports = router;
