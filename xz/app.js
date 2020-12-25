//引入express框架
const bodyParser = require('body-parser');
const express=require('express');
//引入用户路由器
const userRouter=require('./router/user.js');
//创建web服务器
const app=express();
//设置端口
app.listen(8080);
//托管静态资源到public目录
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({
    extended:false
}));
//挂载路由器(放最后)
//路由的url 添加/user
app.use('/user',userRouter)