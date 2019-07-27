/**
 * Created by Administrator on 2018/3/20 0020.
 */
var router = require('koa-router')();

var DB=require('../../model/db.js');


var tools=require('../../model/tools.js');

router.get('/',async (ctx)=>{

    var result= await DB.find('admin',{});

    console.log(result);
    await  ctx.render('admin/manage/list',{

        list:result
    });
})


router.get('/add',async (ctx)=>{

    await  ctx.render('admin/manage/add');

})

router.post('/doAdd',async (ctx)=>{

    //1.获取表单提交的数据    console.log(ctx.request.body);

    //2.验证表单数据是否合法

    //3.在数据库查询当前要增加的管理员是否存在

    //4.增加管理员


    var username=ctx.request.body.username;
    var password=ctx.request.body.password;
    var rpassword=ctx.request.body.rpassword;


    if(!/^\w{4,20}/.test(username)){

        await ctx.render('admin/error',{
            message:'用户名不合法',
            redirect:ctx.state.__HOST__+'/admin/manage/add'
        })

    }else if(password!=rpassword ||password.length>6){

           await ctx.render('admin/error',{
                message:'密码和确认密码不一致，或者密码长度小于6位',
                redirect:ctx.state.__HOST__+'/admin/manage/add'
            })

    }else{

        //数据库查询当前管理员是否存在

        var findResult=await  DB.find('admin',{"username":username});

        if(findResult.length>0){

            await  ctx.render('admin/error',{
                message:'次管理员已经存在，请换个用户名',
                redirect:ctx.state.__HOST__+'/admin/manage/add'
            })

        }else{

            //增加管理员
           var addResult =await  DB.insert('admin',{"username":username,"password":tools.md5(password),"status":1,"last_time":''});

           ctx.redirect(ctx.state.__HOST__+'/admin/manage');

        }


    }




})


router.get('/edit',async (ctx)=>{


    var id=ctx.query.id;

    var result=await  DB.find("admin",{"_id":DB.getObjectId(id)});


    await ctx.render('admin/manage/edit',{
       list:result[0]
   })

})

router.post('/doEdit',async (ctx)=>{

      try{
          var id=ctx.request.body.id;
          var username=ctx.request.body.username;
          var password=ctx.request.body.password;
          var rpassword=ctx.request.body.rpassword;

          if(password!=''){
              if(password!=rpassword ||password.length>6){

                  await ctx.render('admin/error',{
                      message:'密码和确认密码不一致，或者密码长度小于6位',
                      redirect:ctx.state.__HOST__+'/admin/manage/edit?id='+id
                  })

              }else{

                  //更新密码
                  var updateResult=await DB.update('admin',{"_id":DB.getObjectId(id)},{"password":tools.md5(password)});
                  ctx.redirect(ctx.state.__HOST__+'/admin/manage');
              }
          }else{

              ctx.redirect(ctx.state.__HOST__+'/admin/manage');
          }

      }catch(err){
          await ctx.render('admin/error',{
              message:err,
              redirect:ctx.state.__HOST__+'/admin/manage/edit?id='+id
          })

      }

})

router.get('/delete',async (ctx)=>{

    ctx.body="删除用户";

})

module.exports=router.routes();
