
第一步
目的 准备工作
创建项目文件夹
粘贴node_modules到文件夹
粘贴项目sql到文件夹  例如 xz.js
创建public文件夹(静态资源放这里面)
创建app.js

第二步
设置常用的框架并且设置启动服务器
引入express框架
const express=require('express')
创建web服务器
const app=express()
设置端口
app.listen(8080);
托管静态资源到public目录
app.use(express.static('./public'))

启动服务器 
使用cd+空格+目录地址
node+空格+app.js


第三步
目的 设置 html文件里要显示的内容
创建html文件
用form标签写内容 form标签里 method="POST"action="/user/reg"       method 是方法  action是url
http://127.0.0.1:8080/user_reg.html
创建文件  name=对应内容 例如 电话<input type="password" name="phone">


第四步
创建路由器目录在项目主目录下 和别的目录成同级文件夹 router
在路由器目录里创建 user.js 用户路由器
路由器是基于express的 所以 user里先引入express
//引入express
const express=require('express')
//创建路由器对象
const r=express.Router();
//添加路由
//1.用户注册路由(post /reg)煦应注册成功
r.post('/reg',(req,res)=>{
    res.send('注册成功')
});
//导出路由器
module.exports=r


第五步
回到user.js
//引入用户路由器
const userRouter=require('./router/user.js');
//挂载路由器(放最后)
//路由的url 添加/user
app.use('/user',userRouter)


第六步
http://127.0.0.1:8080/user_reg.html
测试成功

第七步
在app.js中应用body-parser中间件，将post请求的数据解析为对象 最后在路由中获取post请求的数据(req.body)
引入中间件 在app里

const bodyParser=require('body-parser')
//应用body-parser中间件 将post请求数据解析为对象 死记就好了
app.use(bodyParser.urlencoded({
    exended:false
}))

第八步
目的 设置obj获取post请求的数据 并且设置不为空
回到user路由
在路由里面 参照user.js里的1.1 后面的2行
具体位置是r.post('/reg',(req,res)=>{}大括号里
//1.1获取post请求的数据
let obj=req.body;
console.log(obj);
//1.2验证各项数据是否为空
if(!obj.uname){//===''
        res.send({code:401,mag:'uname required'})//如果是空的 响应状态码401 并且提示mag（显示内容）是uname required
        return;//阻止函数往后执行，
    }


第九步
目的 测试
浏览器打开
http://127.0.0.1:8080/user_reg.html
测试不输入user的响应结果

第十步
目的 补充剩余3个不为空
//添加其他3项验证 
if(!obj.upwd){
    res.send({code:402,mag:'upwd required'})
    return;    
}
if(!obj.email){
    res.send({code:403,mag:'email required'})
    return;
}
if(!obj.phone){
    res.send({code:404,mag:'phone required'})
    return;    
}

第十一步
创建pool.js 作为连接池模块 在项目总目录里 和 app.js 一个路径
创建连接池 给所有路由器用。
在连接池模块pool.js中创建连接池对象 导出该对象 在路由器user.js中引入连接池模块(../pool.js)
引入成功后 执行sql命令 将获取的用户数据插入到数据表xz_user中
//引入mysql模块
const mysql=require('mysql')
//创建连接池对象
const pool=mysql.createPool({
    host:'127.0.0.1',
    port:'3306',
    user:'root',
    password:'',
    database:'xz',//进入的数据库对象
    connectionLimit:'20'//多少个池
})；
//到处连接池对象
module.exports=pool;


    第十二步
    目的 引入连接池模块 
     回到user.js 
    //引入连接池模块
    const pool=require('../pool');
    执行sql命令 在验证后面
    //1.3执行sql命令
    pool.query('insert into xz_user set ?',[obj],(err,result)=>{
        if(err) throw err;
        console.log(result);
      })


    最后一步
    目的 顺利运行 显示注册成功
    在console.log(result)后面接注册成功显示
      res.send({code:200,msg:'reg suc'})