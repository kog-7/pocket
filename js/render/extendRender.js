
'@include(utils/include.js)'


var extendRender={
  setTemplate:function(url,jsonp){
    if(typeof url==="string"){//暂时不做强判断
      this.usePrivate("url",url);
    }
    if(jsonp==="jsonp"){this.jsonp=true;}
  },
  setHtml:function(tmp){
    if(typeof tmp==="string"){//暂时不做强判断
      this.usePrivate("template",tmp);
    }
  },
  setContainer:function(sel){
    if(typeof sel==="string"){//暂时不做强判断
      this.usePrivate("aim",sel);
    }
  },
  _sendData:function(lazyData){
    var ts=this;
    return function(data){
      if(typeof lazyData==="object"&&data){
        lazyData.data=data;
      }
      else{
        lazyData={data:data};
      }
      ts.render(lazyData,ts);
    }
  },
  useData:function(fun){
        var ts=this;
    if(!(typeof fun==="function")){
      return ts;
    }

    var f = function() {};
    f.prototype = ts;
    var newTs = new f();
    
    newTs._cbData=true;
    setTimeout(function () {
      var lazyData=newTs.lazyData;
      newTs._cbData=false;
      newTs.lazyData
      fun(newTs._sendData(lazyData));
      delete newTs.lazyData;
      delete newTs._cbData;
    }, 0);
    return newTs;
  },
  setCallback:function(funOb){
    var ts=this;
    if(ts.loaded===true){return false;}//表示已经运行完成不需要回调了,由于usedata的作用，这里要用true判断
    if(["function","object"].indexOf(typeof funOb)!==-1){
    ts.callback=funOb;
     }
  return ts;
  },
  render:function(opt,newTs) {
        var ts = this;
        if(ts._cbData===true){//只是取值的过程
          ts.lazyData=opt;
          return ts;
        }
      var aim,attrs,data,strhtml,url,cache,callback,record,insert,jsonp,mode;
      if(opt){
        aim=opt.aim,attrs=opt.attrs;//放入attrs属性
        data = opt.data,
            strhtml = opt.template;
        url = opt.url;//
        cache = opt.cache;
        callback = opt.callback;
        // match = opt.match;//重新正则
        record=opt.record;//record是新生的newTs才绑定
        insert=opt.insert;
        jsonp=opt.jsonp;
        // mode=opt.mode;
      }
      if(typeof callback==="function"){
        ts.callback=callback;
      }

        //参数处理,传入和默认的做对比，优先参数传入的，
          strhtml=strhtml?strhtml:ts.usePrivate("template");
          url=url?url:ts.usePrivate("url");
          aim=aim?aim:ts.usePrivate("aim");
        //参数处理结束
        
        
        if(!(newTs&&("render" in newTs))){
          var f = function() {};
          f.prototype = ts;
          newTs = new f();
        }
        if(record===undefined){record=true;}//默认开启record
        newTs.storeExp = {};
        newTs.storeExpItem=0;
        newTs.refOb = {};
        newTs.insertType=insert;//表示插入模式
        newTs.aim=aim;//新的对象拥有自己的aim属性
        newTs.record=record;
        newTs.loaded=false;//是否加载完全
        newTs.signItem=0;
        newTs.signStore={};
        newTs.aliasArray=[];
        newTs._exps=null;//防止后此渲染而追加内容
        if(jsonp===undefined){jsonp=ts.jsonp;}
        if(attrs!==undefined){newTs.attrs=attrs;}
        // if(mode){newTs.mode=mode;}//表示如iframe，等这种,
        // if (match) {
        //     ts.match = match;
        // }
        if (url && url in templateCache) {
            strhtml = templateCache[url];
        }
        var outData = {
            template: strhtml,
            data: data,
            callback: callback
        };
        setTimeout(function () {
          
    
        if (strhtml) {
                newTs._render(outData, null, "render");
        } else {
            anaInclude({
                url: url,
                callback: function(ob) {
                    var html = templateCache[url] = ob.html;
                    outData.template = html;
                    newTs._render(outData, null, "render")
                },
                jsonp:jsonp
            }, cache)
        }
      }, 0);
        return newTs;
    }
}


