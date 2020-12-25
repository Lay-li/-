在public里建user_login.html
<h2>用户登录</h2>
<form action="/user/login" method="post">   action是登录方式  method是方法 post
    用户<input type="text" name="uname"><br>
    密码<input type="password" name="pwd"><br>
    <input type="submit" name="" id="">
</form>



1 获取传递的数据
//2.1 获取post请求的数据
    let obj=req.body;//获取数据存到obj下
//2.2 检测各项数据是否为空
if(obj.uname===''){
    res.send({code:401,mag:'uname required'});
    return;
}
if(!obj.uped){
        res.send({code:402,mag:'upwd required'});
        return;
    }
2 执行sql命令
pool.query('select * from xz_user where uname=? and upwd=?',[obj.uname,obj.upwd],(err,result)=>{
        if(err) throw err;
        console.log(result);
    });//?占位符代表不确定 后续会补充值查询对应的 []代表数组里对应前面的占位符