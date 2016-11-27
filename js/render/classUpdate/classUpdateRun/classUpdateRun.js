
var UpdateRun=(function(){
  '@include(../../utils/sync.js)'
  var f=function(factory,updateCallbacks,updateInfos){
    //updateCallbacks是包含各种状态的回调运行函数，updateInfos是变量存储的各种内容
  
    this.updateCallbacks=updateCallbacks;
    this.updateInfos=updateInfos;
    this.factory=factory;
    this.binds={};
  };
  
  '@include(./handle.js)'
  '@include(./cb.js)'
  
  f.prototype={
    keyword:keyword,
    bind:bind,
    unbind:unbind,
    sync:sync,
    collect:collect,
    updateState:updateState,
    _update:_update,
    _syncUpdate:_syncUpdate,
    _collectUpdate:_collectUpdate,
    _cbCallback:_cbCallback,
    _cbFun2:_cbFun2,
    _cbFun3:_cbFun3,
    _cbFun:_cbFun
    };

return f;

})()
;
