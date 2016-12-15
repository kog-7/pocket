var Render=function(){
this.storeExp = {};
this.storeExpItem = 0;
this.signItem = 0;
//外出接口
this.signStore = {};
this.refOb = {};
};
var renderPrototype={
    constructor:Render,
    sn:{id:0}
};



'@include(./extendFilter.js)'

miniExtend(renderPrototype,extendFilter);

'@include(./extendMatch.js)'

miniExtend(renderPrototype,extendMatch);


'@include(./extendExpress.js)'

miniExtend(renderPrototype,extendExpress);

'@include(./extendParse.js)'

miniExtend(renderPrototype,extendParse);


Render.prototype=renderPrototype;