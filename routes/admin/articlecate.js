/**
 var obj=[
 {
     'title':'技术团队',
     'list':[
         {
             title: '移动开发',
         },
         {
             title: '网站开发',
         }
     ]
 },
 {
     'title':'数码分类',
     'list':[
         {
             title: '手机',
         },
         {
             title: '电脑',
         }
     ]
 }
 ]
 */
var router = require('koa-router')();

var DB=require('../../model/db.js');
var tools=require('../../model/tools.js');

router.get('/',async (ctx)=>{

    var result=await DB.find('articlecate',{});

    console.log(tools.cateToList(result));
    await  ctx.render('admin/articlecate/index',{
        list: tools.cateToList(result)
    });
})




router.get('/add',async (ctx)=>{


    //获取一级分类

    var result=await DB.find('articlecate',{'pid':'0'});


    await  ctx.render('admin/articlecate/add',{

        catelist:result
    });

})


router.post('/doAdd',async (ctx)=>{

    //console.log(ctx.request.body);

    var addData=ctx.request.body;

    var result=await DB.insert('articlecate',addData);


    ctx.redirect(ctx.state.__HOST__+'/admin/articlecate');

})


router.get('/edit',async (ctx)=>{


    var id=ctx.query.id;

    var result=await DB.find('articlecate',{"_id":DB.getObjectId(id)});

    var articlecate=await DB.find('articlecate',{'pid':'0'});


    await  ctx.render('admin/articlecate/edit',{

        list:result[0],
        catelist:articlecate
    });

})


router.post('/doEdit',async (ctx)=>{

    //console.log(ctx.request.body);

    var editData=ctx.request.body;
    var id=editData.id;       /*前台设置隐藏表单域传过来*/
    var title=editData.title;
    var pid=editData.pid;
    var keywords=editData.keywords;
    var status=editData.status;
    var description=editData.description;

    var result=await DB.update('articlecate',{'_id':DB.getObjectId(id)},{
        title,pid,keywords,status,description
    });

    ctx.redirect(ctx.state.__HOST__+'/admin/articlecate');

})


module.exports=router.routes();
