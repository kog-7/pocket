'@include(./oop-run/oop.js)'


var Update=(function(){
var classUpdate=function(){


};


classUpdate.prototype={
  init:function(updateObject,attrs,refOb,updateFuns){
    var ts=this;
    ts.loaded=false;
    ts.attrs=attrs;
    ts._decoration(refOb,updateObject,updateFuns);
  },
  _decoration:function(refOb,updateObject,updateFuns){
    var factory=this;
    //把相关的update内容和缓存的内容切割在重新利用
    forEachOb(refOb,function(ref,refId){
      var updateCallbacks=updateFuns[ref];
      var updateInfos=updateObject[ref];  
      var exp=new UpdateRun(factory,updateCallbacks,updateInfos);
      exp.ref=ref,exp.refId=refId;
      factory[ref]=exp;
    });
  }
};
return classUpdate;
})()
