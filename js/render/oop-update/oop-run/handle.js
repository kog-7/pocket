var bind=function(currentScope,scope,envir){
  var ts=this;
  var binds=ts.binds;
  var nowBinds=binds[currentScope];
  var factory=ts.factory;

  if(!nowBinds){nowBinds=binds[currentScope]=[];}
  
  var ob={point:scope,envir:factory};
  if(envir){
    ob.envir=envir;
  }
  nowBinds.push(ob);
  return ts;
};

var unbind=function(currentScope){
  var ts=this;
  var binds=ts.binds;
  if(currentScope in binds){
    delete binds[currentScope];
  }
};

var sync=function(){
  var ts=this;
  var newTs=createInherit(ts);
  newTs.runType="sync";
  var syncFun=newTs.syncFun=new Sync();
  newTs.step=-1;
  setTimeout(function () {
    syncFun.go();
  }, 0);
  return newTs;
};

var collect=function(endFun){
  var ts=this;
  var newTs=createInherit(ts);
  newTs.runType="collect";
  var collectFun=newTs.collectFun=new Collect();
  newTs.step=-1;
  setTimeout(function () {
    collectFun.go();
  }, 0);
  if(typeof endFun==="function"){collectFun.setCallback(endFun);}
  return newTs;
};

var updateState=function(status,val_fun){
  var ts=this;
  var runType=ts.runType;
  if(!runType){
    ts._update(status,val_fun);
  }
  else{
    ts["_"+runType+"Update"](status,val_fun);
  }
  return ts;
};

var _update=function(status,val_fun){
  var ts=this;
  var updateCallbacks=ts.updateCallbacks;
  // if(!updateCallbacks){
  //   throw new UserException("没在update中加载相关的update回调函数")
  //   return false;}
  var ts=this;
  var kw=ts.keyword;
  var refId=ts.refId;
  var updateInfos=ts.updateInfos;
  if(updateCallbacks){
  var ifun=updateCallbacks[status];
  var current=$("[data-"+kw+"="+refId+"]");
  if(typeof ifun==="function"){//直接回调相关内容，传入factory作为ts
    ifun.call(ts.factory,{current:current,message:updateInfos,value:val_fun},ts._cbCallback(current,status));
  }
}
};




var _syncUpdate=function(status,val_fun){
  if(typeof val_fun!=="function"){
    throw new UserException("异步队列下updateState第二个参数必须为函数");
    return false;
  }
  var ts=this;
  var syncFun=ts.syncFun;
  var step=ts.step+=1;

  
  syncFun.setArg({item:step,arg:[status]});
  syncFun.get(ts._cbFun(val_fun));
};

var _collectUpdate=function(status,val_fun){
  if(typeof val_fun!=="function"){
    throw new UserException("异步队列下updateState第二个参数必须为函数");
    return false;
  }
  var ts=this;
  var collectFun=ts.collectFun;
  var step=ts.step+=1;
  collectFun.setArg({item:step,arg:[status]});
  collectFun.get(ts._cbFun(val_fun));
};