//引入 koa模块

var Koa=require('koa'),
    router = require('koa-router')(),
    path=require('path'),
    render = require('koa-art-template'),
    static = require('koa-static'),
    session = require('koa-session'),
    sd = require('silly-datetime'),
    jsonp = require('koa-jsonp'),
    bodyParser = require('koa-bodyparser');

//实例化
var app=new Koa();

//配置jsonp的中间件
app.use(jsonp());

//配置post提交数据的中间件
app.use(bodyParser());

//配置session的中间件

app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 864000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true,   /*每次请求都重新设置session*/
    renew: false,
};
app.use(session(CONFIG, app));

//配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat:dateFormat=function(value){
        return sd.format(value, 'YYYY-MM-DD HH:mm');
    } /*扩展模板里面的方法*/
});

//public/upload/1525251917221.png
//配置中间件

//app.use(static('.'));   不安全

//配置 静态资源的中间件
app.use(static(__dirname + '/public'));

//引入模块
var index=require('./routes/index.js');
var api=require('./routes/api.js');
var admin=require('./routes/admin.js');

router.use('/admin',admin);
router.use('/api',api);
router.use(index);

app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());
app.listen(3001);









