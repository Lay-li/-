//引入mysql模块
const mysql=require('mysql');
//创建连接池对象
const pool=mysql.createPool({
    host:'127.0.0.1',
    port:'3306',
    user:'root',
    password:'',
    database:'xz',//进入的数据库对象
    connectionLimit:'20'//多少个池
})
//到处连接池对象
module.exports=pool;