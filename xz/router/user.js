//引入express
const express=require('express');
const app = require('http');
//引入连接池模块
const pool=require('../pool');
//创建路由器对象
const r=express.Router();
//添加路由
//1.用户注册路由(post /reg)响应注册成功
r.post('/reg',(req,res)=>{
    //1.1获取post请求的数据
    let obj=req.body;
    console.log(obj);
    //1.2验证各项数据是否为空
    if(!obj.uname){//===''
        res.send({code:401,mag:'uname required'})
        return;
    }
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
    //1.3执行sql命令
    pool.query('insert into xz_user set ?',[obj],(err,result)=>{
      if(err) throw err;
      console.log(result);
      //成功
      res.send({code:200,msg:'reg suc'})
    })

});


//2.用户登录
// 在public目录下创建用户登录页面，点击提交(post /user/login)
//user_login.html
/* 在用户路由器下创建路由(post /login)
1 获取传递的数据
2 检测各项数据是否为空
3 执行sql命令 查询xz_user 中用户名和密码同时匹配数据
 */
r.post('/login',(req,res)=>{
    //2.1 获取post请求的数据
    let obj=req.body;//获取数据存到obj下
    console.log(obj);
    //2.2 检测各项数据是否为空
    if(obj.uname===''){
        res.send({code:401,mag:'uname required'});
        return;
    }
    if(!obj.upwd){
        res.send({code:402,mag:'upwd required'});
        return;
    }
    //2.3执行sql命令
    pool.query('select * from xz_user where uname=? and upwd=?',[obj.uname,obj.upwd],(err,result)=>{
        if(err) throw err;
        console.log(result);
        //根据结果判断是否登录成功
        //如果是空数组说明登录失败 否则说明登录成功
        if(result.length===0){
            res.send({code:301,msg:'login err'});
        }else{
            res.send({code:200,msg:'login suc'})
        }
    });//?占位符代表不确定 后续会补充值查询对应的 []代表数组里对应前面的占位符
    // res.send('登录成功')
})



//3.检测用户是否存在(get /checkUser)
r.get('/checkUser',(req,res)=>{
    //3.1获取查询字符串传奇的数据
    let obj=req.query;
    console.log(obj);
    //3.2检测是否成功
    if(!obj.uname){
        res.send({code:401,mag:'uname required'});
        return;
    }
    //3.3执行sql命令
    pool.query('select * from xz_user where uname=?',[obj.uname],(err,result)=>{
        if(err) throw err;
        console.log(result);
        //如果结果是空数组表示没有此用户，可以使用：否则此用户存在 不可以使用
        if(result.length===0){res.send({code:200,msg:'可以使用该用户'});
    }else{
        res.send({code:401,mag:'该用户已被注册'})
    }
    })
    
});



//4.修改用户(post /update)
r.post('/update',(req,res)=>{
    //4.1获取post请求的数据
    let obj=req.body;
    console.log(obj);
    // res.send('修改成功')
    //4.2批量验证是否为空
    //批量验证
    let i=400;//初始化变量 用于保存状态码
    for(let k in obj){
        i++;
    //k 属性名
    //obj[k]属性值
    // console.log(k,obj[k]);
    //如果属性值为空 则提示对应的属性名是必须
    if(!obj[k]){
        res.send({code:401,msg:k+'require'});
        return;
      }
    }
    //4.3执行sql命令
    pool.query('update xz_user set ? where uid=?',[obj,obj.uid],(err,result)=>{
        if(err) throw err;
        console.log(result);
        //结果是对象 如果对象下的affectedRows为0 表示修改失败 否则表示修改成功
        if(result.affectedRows===0){
            res.send({code:301,msg:'update err'})
        }else{
            res.send({code:200,msg:'update suc'})
        }
    });
    // res.send('修改成功')

});

//5.在public目录下创建用户列表文件，点击提交（get /user/list）
//user_list.html
/* 创建路由 (get /list)
1.获取查询字符串传递的数据
2.如果页码为空 默认是第一页 如果每页数据为空 默认每页显示4条数据
3.计算开始查询的值
4.执行sql命令 将查询的数据直接响应给浏览器
 */

 r.get('/list',(req,res)=>{
     //5.1获取查询字符串传递的数据
     let obj=req.query;
     console.log(obj);
     //5.2检测是否为空
     if(!obj.pno)obj.pno=1;
     if(!obj.count) obj.count=4;
     //5.3 计算出开始查询的值
     let start=(obj.pno-1)*obj.count;
     //5.4 把每页的数据量转为数值型
     let size=parseInt(obj.count);
     //5.5 执行sql命令
     pool.query('select * from xz_user limit ?,?',[start,size],(err,result)=>{
         if(err) throw err;
         console.log(result);
     })
    //  res.send('这是商品列表')

 })


 //6.删除
/* 在public目录下创建删除文件，点击提交(/user/delete) get user_delete.html
创建路由(get / delete)
1.获取查询字符串的数据
2.检测各项数据是否为空
3. 执行sql命令
200-成功 'delete suc'
301-失败 'delete err'
 */
 r.get('/delete',(req,res)=>{
    //1.获取查询字符串的数据
     let obj=req.query;
     console.log(obj);
     //2.检测各项数据是否为空
     if(!obj.uid){
         res.send({code:401,msg:'uid required'});
         return;
     }
     //6.3执行sql命令
     pool.query('delete from xz_user where uid=?',[obj.uid],(err,result)=>{
         if(err) throw err;
         console.log(result);
         //结果为对象 如果对象下的affectedRows属性为0表示删除失败 否则删除成功
         if(result.affectedRows===0){
             res.send({code:301,mgs:'delete err'});
         }else{
             res.send({code:200,msg:'delete suc'})
         }
    });

 })


 //导出路由器
module.exports=r