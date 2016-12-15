var _cbCallback=function(trigger,currentStatus){//这里是做同步更新的
  var ts=this;
  var binds=ts.binds;
  var kw=ts.keyword;
  var nowBinds=binds[currentStatus];

  return function(val){//返回的值,此函数为cb,val可能是处理后的value
    //可能会同步
    if(nowBinds){
      setTimeout(function () {
        nowBinds.forEach(function(ob,ind){
          var env=ob.envir,po=ob.point.split(".");//分解成数组
          var ref=po[0],status=po[1];//一个ref，状态
          var refOb=env[ref];
          //得到更新回调函数和数据
          var callbacks=refOb.updateCallbacks,infos=refOb.updateInfos;
          var fun=callbacks[status];
          var refId=refOb.refId;
          var current=$("[data-"+kw+"="+refId+"]");
          if(typeof fun==="function"){
            //同步传播的回调
            fun.call(env,{trigger:trigger,current:current,message:infos,value:val},ts._cbCallback(current));
          }
        });
      }, 16.666);
    }
  };
};



var _cbFun2=function(that){
  return function(val){
    that.next(val);
  }
};

var _cbFun3=function(fun,fac,opt,cback){
  return function(val){
    opt.value=val;
    fun.call(fac,opt,cback);
  };
};

var _cbFun=function(val_fun){
  // console.log(989)
  var ts=this;
  var updateCallbacks=ts.updateCallbacks;
  // if(!updateCallbacks){
  //   throw new UserException("没在update中加载相关的update回调函数")
  //   return false;
  // }
  var kw=ts.keyword;//
  var refId=ts.refId;//domid
  var updateInfos=ts.updateInfos;//信息
  var current=$("[data-"+kw+"="+refId+"]");//当前jqdom对象
  var factory=ts.factory;

  return function(args){
  var setup=args.setup,flow=args.flow;
  var lastValue;
  if(flow){lastValue=flow[0];}
  var status=setup[0];
  var ifun;
  if(updateCallbacks){
    ifun=updateCallbacks[status];//运行的回调函数
}
if(!ifun){ifun=function(){}}
  var cbCallback=ts._cbCallback(current,status);
  var that=this;  //that为sync对象的that类型
  val_fun(ts._cbFun2(that),ts._cbFun3(ifun,factory,{current:current,message:updateInfos},cbCallback),lastValue,updateInfos);
}
};