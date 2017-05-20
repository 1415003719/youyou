let router = require('koa-router')();
let userHandle=require('./../handle/userHandle');

router.get('/users',userHandle.home);//返回首页
router.get('/users/getLoginState',userHandle.getLoginState);//获取登录状态
router.get('/users/login', userHandle.login);//返回用户登录界面
router.get('/users/loginOut', userHandle.loginOut);//退出登录
router.get('/users/register', userHandle.register);//返回用户注册页面
router.post('/users/checkLogin', userHandle.checkLogin);//检查用户登录数据
router.post('/users/checkRegister', userHandle.checkRegister);//检查用户注册信息
router.get('/users/getAllGoods', userHandle.getAllGoods);//客户端获取商品列表
router.get('/users/getComments', userHandle.getComments);//获取所有评论
router.post('/users/toMyOrderPage', userHandle.toMyOrderPage);//转到我的订单页面
router.get('/users/getMyOrder', userHandle.getMyOrder);//获取我的订单信息
router.post('/users/comment', userHandle.comment);//接收评论信息
router.post('/users/modifyPassword', userHandle.modifyPassword);//用户更改密码
router.post('/users/modifyAddress', userHandle.modifyAddress);//修改地址
module.exports = router;
