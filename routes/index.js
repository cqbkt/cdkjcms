/**
 * Created by Administrator on 2018/3/20 0020.
 */
var router = require('koa-router')();
var DB =require("../model/db");
var url=require('url');


//配置中间件 获取url的地址
router.use(async (ctx,next)=>{
    //console.log(ctx.request.header.host);
    var pathname=url.parse(ctx.request.url).pathname;

    //导航条的数据
    var navResult=await DB.find('nav',{$or:[{'status':1},{'status':'1'}]},{},{

        sortJson:{'sort':1}
    })
    //模板引擎配置全局的变量
    ctx.state.nav=navResult;
    ctx.state.pathname=pathname;
    await  next()
})
router.get('/',async (ctx)=>{

var focusResult=await DB.find('focus',{},{},{
    sortJson:{'sort':1}
})

    ctx.render('default/index',{
        focus:focusResult
    });



})
// router.get('/index',async (ctx)=>{

//     //ctx.body="前台首页";

//     ctx.render('default/index');

// })
router.get('/share',async (ctx)=>{

    ctx.render('default/share');

})

router.get('/list',async (ctx)=>{

    ctx.render('default/list');

})

router.get('/about',async (ctx)=>{

    ctx.render('default/about');

})

router.get('/fengmian',async (ctx)=>{

    ctx.render('default/fengmian');

})

router.get('/info',async (ctx)=>{

    ctx.render('default/info');
})

router.get('/time',async (ctx)=>{

    ctx.render('default/time');
})
module.exports=router.routes();