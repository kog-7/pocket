/*
 * @Author: jxj
 * @Date:   2016-10-10 15:05:41
 * @Last Modified by:   jxj
 * @Last Modified time: 2016-11-10 13:37:16
 */

(function (gbl) {
  if(!gbl){return;}
    var typeHim = function(dm) {
    if (dm === undefined) {
        return "undefined";
    }
    if (dm === null) {
        return "null";
    }
    var tp = typeof dm;
    if (tp === "string" || tp === "number" || tp === "function") {
        return tp;
    }
    tp = Object.prototype.toString.call(dm);
    if (tp.indexOf("rray") !== -1 || tp.indexOf("rguments") !== -1) {
        return "array";
    } else if (tp.indexOf("ragment") !== -1) {
        return "fragment"
    } else if (tp.indexOf("odeList") !== -1) {
        return "nodelist";
    } else if (tp.indexOf("lement") !== -1) {
        return "node";
    } else if (tp.indexOf("egExp") !== -1) {
        return "regexp";
    } else if (tp.indexOf("bject") !== -1) {
        return "object";
    } else {
        return false;
    }
};


var isEmptyObject = function(ob) {
    var ctr = true;
    for (var i in ob) {
        ctr = false;
    }
    return ctr;
}


var miniExtend = function(aob, ob) {
    var i = null;
    for (i in ob) {
        if (!(i in aob)) {
            aob[i] = ob[i];
        }
    }
    return aob;
}







var coverExtend = function(aob, ob) {
    var i = null;
    for (i in ob) {
        aob[i] = ob[i];
    }
    return aob;
}

//深扩展，会遍历每个字符串并且合并
var depExtend = function(ob2, ob1) {
  var tp = typeHim(ob1);
  var temp = null;
  var out = null;
  var tp2 = typeHim(ob2);
  if (tp !== tp2) {
    return;
  }
  if (tp === "array") {
    var i = 0,
      n = ob1.length;
    for (; i < n; i += 1) { //这里可以根据getOwnProperty来判断是为自有的属性，方法
      temp = ob1[i]; //是否为对象等
      if (ob2[i] === undefined) {
        ob2[i] = temp;
        continue;
      } else if (["array", "object"].indexOf(typeHim(temp)) !== -1) {
        depExtend(ob2[i], temp);
      }
    }
  } else if (tp === "object") {
    var i = null;
    for (i in ob1) {
      temp = ob1[i];
      if (ob2[i] === undefined) {
        ob2[i] = temp;
        continue;
      } else if (["array", "object"].indexOf(typeHim(temp)) !== -1) {
        depExtend(ob2[i], temp);
      }
    }
  }
}


var createInherit = function(from, opt) {
    // if(Object.create){return Object.create(from);}
    var f = function() {};
    var ob = null;
    f.prototype = from;
    ob = new f();
    if (opt) {
        coverExtend(ob, opt);
    }
    return ob;
};



var getValue = function(name, ob, item, blg) {
    if (name === ".NUMBER") {
        return item;
    }
    if (["number", "string"].indexOf(typeof ob) !== -1) {
        return ob;
    }
    var ar = name.split("."),
        n = ar.length;
    var temp = "";
    var i = 0;
    if (ar[0] === "JRootScope") { //可以设置任意的艮目录，那么会识别并过滤掉他
        ar.shift();
        n = ar.length;
        var nowOb;
        while (ob && (!(isEmptyObject(ob)))) {
            nowOb = Object.getPrototypeOf(ob);
            if (isEmptyObject(nowOb)) {
                break;
            } else {
                ob = nowOb;
            }
        }
    }
    var protoOb = ob,
        out = null;
    while (protoOb && !(isEmptyObject(protoOb))) {
        i = 0;
        ob = protoOb;
        for (; i < n; i += 1) {
            temp = ar[i];
            if (ob.hasOwnProperty(temp)) {
                ob = ob[temp];
                if (ob === undefined) {
                    break;
                }
            } else {
                ob = null;
                break;
            }
        }
        if (!ob) {
            protoOb = Object.getPrototypeOf(protoOb);

            continue;
        } else {
            out = ob;
            break;
        }
    }
    out = out ? out : false;
    return out;
};





var getParaName = function(f) {
    var str = f.toString();
    var s1 = str.indexOf("("),
        s2 = str.indexOf(")");
    str = str.slice(s1 + 1, s2);
    return str.split(",");
};




var urlAim = function(url) {
    var ind = url.lastIndexOf("\/");
    if (ind === -1) {
        return {
            base: "",
            name: url
        };
    } else {
        var base = url.slice(0, ind + 1);
        var name = url.slice(ind + 1);
        return {
            base: base,
            name: name
        };
    }
};





var simpleUrl = function(url) {
    var str = url.charAt(0);
    if (str === ".") {
        return url.slice(2);
    } else if (str === "\/") {
        return url.slice(1);
    } else {
        return url;
    }
}



var forEachOb = function(ob, callback) {
    var i = null;
    for (i in ob) {
        callback(i, ob[i]);
    }
}





var depExtend = function(ob2, ob1) {
    var tp = typeHim(ob1);
    var temp = null;
    var out = null;
    var tp2 = typeHim(ob2);
    if (tp !== tp2) {
        return;
    }
    if (tp === "array") {
        var i = 0,
            n = ob1.length;
        for (; i < n; i += 1) { //这里可以根据getOwnProperty来判断是为自有的属性，方法
            temp = ob1[i]; //是否为对象等
            if (ob2[i] === undefined) {
                ob2[i] = temp;
                continue;
            } else if (["array", "object"].indexOf(typeHim(temp)) !== -1) {
                depExtend(ob2[i], temp);
            }
        }
    } else if (tp === "object") {
        var i = null;
        for (i in ob1) {
            temp = ob1[i];
            if (ob2[i] === undefined) {
                ob2[i] = temp;
                continue;
            } else if (["array", "object"].indexOf(typeHim(temp)) !== -1) {
                depExtend(ob2[i], temp);
            }
        }
    }
}




var getAllClass = function (cla) {
    var arr = cla.split(" ");
    var n = arr.length;
    var i = n - 1;
    for (; i >= 0; i -= 1) {
        if (!arr[i]) {
            arr.splice(i, 1);
        }
    }
    return arr;
}

var getTextEle = function (dom,val) {
    var child = dom.childNodes;
    var i = 0,
        n = child.length;
    var temp = null;
    if(n===0){
      if(val===undefined){return dom.innerHTML;}
      else{
        dom.innerHTML=val;
        return val;
      }
    }
    else{
    for (; i < n; i += 1) {
        temp = child[i];
        if (temp.nodeType === 3) { //只返回第一个子元素
            if(val===undefined){return temp.nodeValue;}
            else{temp.nodeValue=val;return val;}
        }
    }
    return "";
  }
}


// var getObCont=function(ob){//根据{xx:yy:{}},xx,yy得到内容
//   var args=Array.prototype.slice.call(arguments,1);
//     var i=0,n=args.length;
//   if(n===0){return false;}
//   var out;
//   var arg;
//   for(;i<n;i+=1){
//     arg=args[i];
//     if(!(arg in ob)){
//       out=false;
//       return out;
//     }
//     else{
//       ob=ob[arg];
//     }
//   }
// return ob;
// }

var valPx=function(str){
return +(str.slice(0,-2));
}

var hasData=function(val){//项目逻辑里，是否有值
  if([undefined,null,false].indexOf(val)===-1){
    return true;
  }
  else{
    return false;
  }
}


var fixPushArray=function(alias,syncData,outOb){

  var aliasArr=alias.split(",");
  var temp=null;
  aliasArr.forEach(function(al,ind){
    temp=syncData[al];
    if(!(al in syncData)){
      temp=syncData[al]=[];
    }
    temp.push(outOb);
  });
  
  
}
    var templateCache = {};
    var Pocket = function (url, aim) {
        var privateInfo = {
            url: url,
            aim: aim
        };
        this.usePrivate = function (attr, val) {
            if (val !== undefined) {
                privateInfo[attr] = val; //如果优值
            } else {
                return privateInfo[attr];
            }
        };
    };
    var prototypePocket = {
        constructor: Pocket
    };
    var filters = {
    upper: function(str) {
        return str.toUpperCase()
    },
    lower: function(str) {
        return str.toLowerCase()
    },
    length: function(str) {
        if (typeHim(str) !== "array") {
            return str
        }
        return str.length
    },
    safe: function(str) {
        if (typeof str === "string") {
            return safeHtml(str)
        }
    },
    toString:function(str){
      return str.toString();
    }
};


var extendFilter={//filters是给所有模版通用的，
    filters:filters
    // setFilter: function(opt) {
    //     var fil = this.filters;
    //     coverExtend(fil, opt)
    // }
};

Pocket.setFilter=function(opt){
  coverExtend(filters, opt);
}
    miniExtend(prototypePocket, extendFilter);

    var path=(function(){
  
var split = function(url) {//只能处理前端的路径，不能用作node上面
    var ind = url.lastIndexOf("\/");
    if (ind === -1) {//表示直接为一个文件目录
        return {
            dirname: "",
            basename: url
        };
    } else {
        var base = url.slice(0, ind + 1);
        var name = url.slice(ind + 1);
        return {
            dirname: base,
            basename: name
        };
    }
};

var join=function(urlbase,urlaim){//处理相对路径，比如"http://www.kom.com/a/b/c?a=1&b=3","odd/okk/../mm.html"
  var arr=urlaim.split("\/");
  var n=arr.length;
  var i=0;
  var temp=null;
  //判别？#这些
  var lastStr="";
  var spInd1=urlbase.indexOf("?"),spInd2=urlbase.indexOf("#");
  var lastInd;
  spInd1=spInd1===-1?Number.POSITIVE_INFINITY:spInd1,spInd2=spInd2===-1?Number.POSITIVE_INFINITY:spInd2;
  lastInd=Math.min(spInd1,spInd2);
  if(lastInd!==-1){
    lastStr=urlbase.slice(lastInd);
    urlbase=urlbase.slice(0,lastInd);
  }
  var outUrl=urlbase.split("\/");
  for(;i<n;i+=1){
    temp=arr[i];
    if(temp===".."){
      outUrl.pop();
    }
    else if(temp&&temp!=="."){
      outUrl.push(temp);
    }
  }
  outUrl=outUrl.join("\/")+lastStr;
  return outUrl;
}
return {join:join,split:split};

})();

var regAll = function(reg, str, cback) { //还要得到fitler
    var match;
    var temp = null;
    reg.lastIndex = 0;
    var arr = [];
    var ctr = 0;
    var lastIndex = 0;
    var url="";
    //还要得到filter
    while (match = reg.exec(str)) {
        ctr = 1;
        arr.push({
            type: true,
            html: str.slice(lastIndex, match.index)
        });
        url=match[1];
        //把url的空格取消掉，不存在
        url=url.replace(/\s+/g,function(){
            return "";
        });
        arr.push({
            type: false,
            url: url,
            jsFilter: match[3]
        })
        lastIndex = reg.lastIndex;
    }
    if (ctr === 0) {
        return false;
    }
    arr.push({
        type: true,
        html: str.slice(lastIndex)
    });

    reg.lastIndex = 0;
    return arr;
}


var noBlankNoLine=function(str){//消除前后的空格和换行等
    var reg=/^[\n\s\r]+/;
    var reg2=/[\n\s\r]+$/;
    var match=reg.exec(str);
    var match2=reg2.exec(str);
    var lg,lg2;
    if(!match&&!match2){return str;}
    else{
        if(match){
            lg=match[0].length;
        }
        if(match2){
            lg2=match2[0].length;
        }
        if(lg){
            str=str.slice(lg);
        }
        if(lg2){
            str=str.slice(0,-lg2);
        }
        return str;
    }
}


var anaInclude = function(opt) {
    var html = opt.html,
        url = opt.url,
        callback = opt.callback;
      var jsonp=opt.jsonp;
    var includeReg = /\'?\@include\(([\w\.\-\/\s]+)((\|[\w\-]+(\:[\w\-]+)*)*)\)[\;]*\'?/g;
    var oriOb;
    var first = 0;
    //最开始的include是最外层js直接指向这个html，是没有basePath的，后面的才有
    if (html) {
        oriOb = {
            type: false,
            html: html
        };
    } else {
        oriOb = {
            type: false,
            url: url,
            baseUrl: ""
        };
    }

    var htmlArr = [oriOb] //false为没有解析，true为解析了
    var mark = [];

    var f = function(htmlArr, lastOb, cback) { //这里的cback指的是上一个的回调。item表示第几个

        var baseUrl = lastOb.baseUrl;
        var jsFilter;
        var ctr = 0;
        var html = "";
        var match = null;
        var url = null;
        var newBaseUrl = "";
        htmlArr.forEach(function(ob, ind) {
            if (ob.type === false) {
                url = ob.url =path.join(baseUrl,ob.url);
                ob.baseUrl = path.split(url).dirname;
                if (url) {
                    if (mark.indexOf(url) !== -1) {
                        console.warn("模版循环引用");
                        ob.html = "";
                        ob.type = true;
                        return;
                    }
                    if (url in templateCache) { //templateCache，是保存经过render模块渲染出来的最终完整的html整体的存档。
                        var ajaxHtml = templateCache[url];
                        var match = regAll(includeReg, ajaxHtml);

                        if (match) {
                            mark.push(url);
                            f(match, ob, nowCallback);
                        } else {
                            //这里直接判断如果是全部的html没有url的直接给ob绑定，并且运行上一次回调。
                            ob.type = true;
                            ob.html = ajaxHtml;
                            nowCallback();
                        }
                    } else {
                      // console.log(url)
                      var sendOb={url:url};
                      if(jsonp===true){
                        sendOb.dataType="jsonp";
                      }
                        $.ajax(sendOb).done(function(ajaxHtml){
                          
                          ajaxHtml=noBlankNoLine(ajaxHtml);
                          var match = regAll(includeReg, ajaxHtml);
                          if (match) {
                              mark.push(url);
                              f(match, ob, nowCallback);
                          } else {
                              //这里直接判断如果是全部的html没有url的直接给ob绑定，并且运行上一次回调。
                              ob.type = true;
                              ob.html = ajaxHtml;
                              nowCallback(ob.jsFilter);
                          }
                        }).fail(function(){
                            console.log("read " + url + " wrong");
                            callback({
                                html: ""
                            })
                            return;
                        })
                    }
                    ctr = 1;
                } else {

                    match = regAll(includeReg, ob.html);

                    if (match) {
                        f(match, ind, nowCallback);
                        ctr = 1;
                    } else {
                        ob.type = true;
                        html += ob.html;
                    }

                }

            } else {
                html += ob.html;
            }
        });

        if (ctr === 0) {
            //判断上一个ob是否有，如果有的话，就给他的html添加赋予当前的这个值
            if (typeof lastOb === "object") {
                lastOb.type = true;
                lastOb.html = html;
            }
            if (cback === undefined) {
                callback(lastOb);
            } else {
                cback();
            }
        }

        function nowCallback() {
            var ctr = 0;
            var html = "";
            var i = 0,
                n = htmlArr.length;
            for (; i < n; i += 1) {
                if (htmlArr[i].type === false) {
                    return;
                } else {
                    html += htmlArr[i].html;
                }
            }
            lastOb.type = true;
            lastOb.html = html;
            //如果前面没有return的话
            if (cback === undefined) {
                callback(lastOb);
            } else {
                cback();
            }
        };
    };
    f(htmlArr, oriOb)
}


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
    miniExtend(prototypePocket, extendRender);

    var extendMatch={
  sn: {
      item: 0
  },
  keyword:"pocket_record_id",
  match: "?",
  regMatch: function() {
      var lf = this.match;
      return new RegExp("\\" + lf + "([\\w\\.\\-\\:\\|\\,\\#\@\\s]+)\\" + lf, "gm")
  },
  getMatchValue:function(varyOb, ob, item, blg) {//处理变量
       var ts = this;
       var varyAttr = varyOb.variable,
          //  varyDef = varyOb.default,
           varyFilter = varyOb.filter; 
       var tmpob;
       var tmpArr=[];
       var fun = null;
       var flsFun = ts.filters;
       var ifArr=varyAttr.indexOf(",");
       if(ifArr!==-1){//是否有,表示多变量
           varyAttr=varyAttr.split(",");  
       }
       else{
         varyAttr=[varyAttr];
       }
      //  var hasData=false;//判断是否有数据被变量化出来
      var defInd,defVal;
         varyAttr.forEach(function(attr,ind){
           defVal="";
           defInd=attr.indexOf(":");
           if(defInd!==-1){//有默认值的情况
             defVal=attr.slice(defInd+1);
             attr=attr.slice(defInd);
           }
           var out=getValue(attr,ob,item,blg);
           if(out===false){//如果为假则为“”
             out=defVal;
           }
           tmpArr.push(out);
         });
         
         
         if(ifArr===-1){
           tmpArr=tmpArr[0];
         }
       if (varyFilter) {
         tmpob=tmpArr;
        
           varyFilter.forEach(function(fil) {
               fun = flsFun[fil];
               if (typeof fun === "function") {//如果为function的时候,带入进去运行
                   tmpob = fun.apply(null,[tmpob,item,blg]);
               }
           });
           if (!tmpob && tmpob !== 0) {//如果返回为空，则为过滤无效，返回空
               tmpob = ""
           }
       }
       else{
            tmpob=tmpArr;
       }

       
       return tmpob;
   }
};
    miniExtend(prototypePocket, extendMatch);

    var compIf = function(vara, expre, varb) { //条件对比
    var tf = null;
    if (vara === true || vara === "true") {
        vara = "true";
    }
    if (vara === false || vara === "false") {
        vara = "false";
    }
    if (varb === true || varb === "true") {
        varb = "true";
    }
    if (varb === false || varb === "false") {
        varb = "false";
    }
    if (expre === "==" || expre === "=") {
        expre = "=";
    }
    if(expre==="!="||expre==="!=="){
        expre="!"; 
    }
    
    if (!(isNaN(+vara))) {
        vara = +vara;
    }
    if (!(isNaN(+varb))) {
        varb = +varb;
    }

    switch (expre) {
        case "<":
            tf = (vara < varb);
            break;
        case ">":
            tf = (vara > varb);
            break;
        case ">=":
            tf = (vara >= varb);
            break;
        case "<=":
            tf = (vara <= varb);
            break;
        case "=":
            tf = (vara === varb);
            break;
        case "!":
            tf = (vara !== varb);
            break;
    }
    return tf;
}



var parseVariable = function(str) {
    var  vary, filter;
    var divide = "|";
    var potDivide = ":";
    var ind = str.indexOf(divide);
    var lg = str.length;
    var potInd;
    var filterArr = null;
    var alias,aliasInd;
    if (ind !== -1) {//操作过滤器
      
        vary = str.slice(0, ind);
        filter = str.slice(ind + 1);
        aliasInd=filter.indexOf("\@");
        if(aliasInd!==-1){
          alias=filter.slice(aliasInd+1);
          filter=filter.slice(0,aliasInd);
        }
        if (filter) {
            filterArr = filter.split(",")
        }
    } else {
        aliasInd=str.indexOf("\@");
      if(aliasInd!==-1){
        alias=str.slice(aliasInd+1);
        str=str.slice(0,aliasInd);
      }
        vary = str
    }
    var firstAttr=vary.split(",")[0].split(":")[0];
    // vary=vary.split(",");//通过，表示多个变量
    
    // potInd = vary.indexOf(potDivide);
    // if (potInd !== -1) {
    //     def = vary.slice(potInd + 1);
    //     vary = vary.slice(0, potInd)
    // } else {
    //     def = ""
    // }
    return {
        filter: filterArr,
        variable: vary,
        firstAttr:firstAttr,
        alias:alias
    }
};



//对环境标签中{{ }}是for还是if进行具体处理
var parseS = function(str, match) {
    var tp = str.slice(0, str.indexOf(" "));//根据空格位置，取得第一个标识符是if，for还是什么
    var obs = null;
    var reg = null;
    var mat;
    if (tp === "for") {
        reg = new RegExp("for\\s+([\\w|\\|\\-]+)\\s+in\\s+(\\" + match + '?[\\{\\}\\w|\\|\\.\\[\\]\\,\\"\\:]+' + "\\" + match + "?)\\s*");
        mat = reg.exec(str);
        obs = [mat[1], mat[2]];
        obs.type="for";
    } else if (tp === "if") {
        reg = new RegExp("if\\s+(\\" + match + "?[\\w|\\|\\.\\-]+\\" + match + "?)\\s+([\\<\\>\\=\\!]+[\\<\\>\\=\\!]*)\\s+(\\" + match + "?[\\w\\|\\.\\-]+\\" + match + "?)");
        mat = reg.exec(str);
        obs = [mat[1], mat[2], mat[3]];
        obs.type="if";
    } else if (tp === "copy") {
        reg = /copy\s+([\w\-]+)/;
        mat = reg.exec(str);
        obs = [mat[1]];
        obs.type="copy";//由于copy和scope的长度都为1
    }
    else if(tp==="scope"){
      reg=new RegExp("scope\\s+([\\w|\\|\\-]+)\\s+as\\s+(\\" + match + '?[\\{\\}\\w|\\|\\.\\[\\]\\,\\"\\:]+' + "\\" + match + "?)\\s*");
     mat=reg.exec(str);
     obs=[mat[1], mat[2]];
     obs.type="scope";
    }
    return obs
};


var extendExpress={
  handExpress: function(str, ob, item, blg) {//处理变量和值，也包括express表达式等
      var ts = this;
      var varyOb = parseVariable(str);//先提取出相关内容做是什么内容的判断
      var match = ts.match;
      if (!item) {
          item = 0
      }
      if (!blg) {
          blg = 1
      }
      var filter = varyOb.filter,attr = varyOb.variable;
     //  var iref = null;
      var storeExp = ts.storeExp;
      var refOb = ts.refOb;
      var matchVal = null;
      var tmpob;
      if (filter && filter[0] === "EXPRESS") {
          var res = storeExp[attr];
          var expob = parseS(res.express, match);
          
          if (expob.type === "for") {
              var forVal = expob[1],forNameVal=expob[0];
              if(forVal[0]===match){//如果第一个是变量，要去掉匹配
                forVal=forVal.slice(1,-1);
                var forVaryOb = parseVariable(forVal);
                
                tmpob = ts.getMatchValue(forVaryOb, ob, item, blg);
                if (!tmpob) {
                    tmpob = ""
                }
              }
              else{//查看是否为对象
                try {//尝试转换是否为对象。
                    tmpob = JSON.parse(forVal)
                } catch (e) {//如果不是对象就用
                  tmpob="";
                }
              }
              
              if (typeof tmpob !== "object") {
                  return ""
              } else {
                  return {
                      data: tmpob,
                      template: res.html,
                      prefix: forNameVal,
                      lastData: ob
                  }
              }
          } else if (expob.type === "if") {
              var vary1 = expob[0],
                  vary2 = expob[2];
              var match1 = ts.regMatch().exec(vary1);
              var match2 = ts.regMatch().exec(vary2);
              if (match1) {
                  vary1 = match1[1];
                  vary1 = ts.getMatchValue(parseVariable(vary1), ob, item, blg)
              }
              if (match2) {
                  vary2 = match2[1];
                  vary2 = ts.getMatchValue(parseVariable(vary2), ob, item, blg)
              }
              var tf = compIf(vary1, expob[1], vary2);
              if (!tf) {
                  return ""
              } else {
                  return {
                      data: ob,
                      template: res.html
                  }
              }
          } 
          else if(expob.type==="scope"){
            var scopeVal = expob[1],scopeNameVal=expob[0];
            if(scopeVal[0]===match){//如果第一个是变量，要去掉匹配
              scopeVal=scopeVal.slice(1,-1);
              var scopeVaryOb = parseVariable(scopeVal);
              
              tmpob = ts.getMatchValue(scopeVaryOb, ob, item, blg);
              if (!tmpob) {
                  tmpob = ""
              }
            }
            else{//查看是否为对象
              try {//尝试转换是否为对象。
                  tmpob = JSON.parse(scopeVal)
              } catch (e) {//如果不是对象就用
                tmpob="";
              }
            }
            var outOb={};
            outOb[scopeNameVal]=tmpob;
                return {
                    data: outOb,
                    template: res.html,
                    lastData: ob
                }
      } 
          }
      else if (attr.indexOf("REF") !== -1) {
          ref = attr.slice(3);
          ref = ref ? ref : "OTHER";
          var soleItem="";
          var kw=ts.keyword;
          if(!(ref in refOb)){
            soleItem=ts.sn.item+=1;
            refOb[ref]=soleItem;//埋入id
          }
          return 'data-xjref="' + ref+'"';
      } 
      else {//单变量解析
          tmpob = ts.getMatchValue(varyOb, ob, item, blg);
          if(typeof tmpob==="object"){tmpob=tmpob.toString();}
          var parOb={value:tmpob,attr:varyOb.firstAttr,alias:varyOb.alias};
          parOb[ts.keySign]=true;
          return parOb;
          // return tmpob
      }
  }
};
    miniExtend(prototypePocket, extendExpress);

    //分析{{  }}环境标签
var anaTag = function(htm, match) {
 var regold = new RegExp('\\{\\{(\\w+)(?=\\s)(\\' + match + '|\\{\\"|\\}|[\\:\\"\\,\\w\\s\\>\\<\\=\\|\\.\\!\\[\\]])+\\}\\}');
    var reg;
    var mat = null;
    var no = 0;
    var lf = "",
        rt = "";
    var tp = null;
    var right = "";
    var out = [];
    var temp = [];
    tp = regold.exec(htm);
    try {
        tp = regold.exec(htm);
    } catch (e) {
        console.log("loop write error");
        return;
    }
    var htmlArr = [];
    var tempHtml = "";
    do {
        if (no === 0) {
            if (!tp) {
                return false
            } else {
                tp = tp[1]
            }
            reg = new RegExp("\\{\\{" + tp + '\\s+(\\' + match + '|\\{\\"|\\}|[\\:\\[\\]\\,\\"\\w\\s\\>\\<\\!\\=\\|\\.])+\\}\\}|(\\{\\{\\/' + tp + 's*\\}\\})', "g");
            mat = reg.exec(htm);
            lf = [mat.index, reg.lastIndex]
        } else {
            mat = reg.exec(htm)
        }
        if (mat[2]) {
            no -= 1
        } else {
            no += 1
        }
        if (no === 0) {
            rt = [mat.index, reg.lastIndex];
            tempHtml = htm.slice(0, lf[0]);
            temp = [{
                html: tempHtml
            }, {
                html: htm.slice(lf[1], rt[0]),
                express: htm.slice(lf[0] + 2, lf[1] - 2)
            }];
            htm = right = htm.slice(rt[1]);
            tp = regold.exec(right);
            out = out.concat(temp)
        }

    } while (mat && tp);
    out.push({
        html: right
    });
    return out
};


var extendParse={
  keySign:(function(){
  var rd=(100*(Math.random())).toFixed(0);
  return "pocket_var"+rd;
})(),
  _toSignString:function(attr,val,alias){
    var ts=this;
    var keySign=ts.keySign;
    var item=ts.signItem+=1;
    item=item.toString();
    ts.signStore[item]={attr:attr,value:val,alias:alias};
    return "#"+keySign+item+keySign+"#";
  },
   stringEachArr: function(str, obs, item, blg) {//从_render进入的入口
       var ts = this;
       var reg = ts.regMatch();//得到正则表达式
       var match=null,matchStr="";
       var outstr="",ind=0,lastInd=0;
       var copyOutStr="";
       var matchVal;
       var middleStr="";
       
       while(match=reg.exec(str)){
         matchStr=match[1];
         ind=match.index;
         middleStr=str.slice(lastInd,ind);
         outstr+=middleStr;
         copyOutStr+=middleStr;

         matchVal=ts.handleStr(matchStr,obs,item,blg);
      
         if(typeof matchVal!=="object"){
           outstr+=matchVal;
           copyOutStr+=matchVal;
         }
         else if("copyHtml" in matchVal){
           outstr+=matchVal.html;
           copyOutStr+=matchVal.copyHtml;
         }
         else{
          //  console.log(matchVal)
            outstr+=matchVal.value;
            copyOutStr+=ts._toSignString(matchVal.attr,matchVal.value,matchVal.alias);
         }
        //  outstr+=matchVal;
         lastInd=reg.lastIndex;
       }
       middleStr=str.slice(lastInd);
       outstr+=middleStr;
       copyOutStr+=middleStr;
      //  outstr+=str.slice(lastInd);
       return {html:outstr,copyHtml:copyOutStr};
   },
   handleStr: function(str, obs, item, blg) {
       var ts = this;
       var mat = ts.handExpress(str, obs, item, blg);
       var keySign=ts.keySign;
       
       if (["number", "string"].indexOf(typeof mat) !== -1) {
           return mat;
       }
        else if(mat[keySign]===true){
          return mat;
        }
        else {
           return ts._render(mat, "middle");
       }
   },
   _render: function(opt, mid) {
       var strhtml = opt.template,
           data = opt.data;
       var prefix = opt.prefix;
      //  var noMerge = opt.noMerge;
       var ts = this;
       var match = this.match;
       var strarr = anaTag(strhtml, match);//分析{{}}关键字
       var callback = opt.callback;
       var lastData = opt.lastData;
       var template = "";
       var newItem;
       var tempData = null;
       var temp = null;
       if (typeHim(strarr) === "array") {
           var i = 0,
               n = strarr.length,
               temp = null;
           var tpob = {};
           var item = 0;
           var exp = "";
           for (; i < n; i += 1) {
               temp = strarr[i];
               if (temp.express) {
                   newItem =ts.storeExpItem += 1;
                   exp = "XJ" + newItem;
                   ts.storeExp[exp] = temp;
                   template += match + exp + "|EXPRESS" + match
               } else {
                   template += temp.html
               }
           }
       } else if (strarr === false) {
           template = strhtml
       }
        var combineHtml=null;
       
       var tp = typeHim(data);
       temp = null;
       var outstr = "",copyOutStr="";
       var i = 0,
           n;
       if (tp === "array" && mid === null) {//data的格式
           i = 0, n = data.length;
           for (; i < n; i += 1) {
               temp = data[i];
               if (typeof temp === "object") {
                   temp.NUMBER = i.toString()
               }
               tempData = temp;
               if (lastData) {
                   tempData = createInherit(lastData, tempData)
               }
               combineHtml=ts.stringEachArr(template, tempData, i, n);
               outstr+=combineHtml.html;
               copyOutStr+=combineHtml.copyHtml;
              //  outstr += ts.stringEachArr(template, tempData, i, n)
           }
       } else if (tp === "array" && prefix) {//根据情况，先写一样的，
           i = 0, n = data.length;
           for (; i < n; i += 1) {
               temp = data[i];
               if (typeof temp === "object") {
                   temp.NUMBER = i.toString()
               }
               tempData = {};
               tempData[prefix] = temp;
               if (lastData) {
                   tempData = createInherit(lastData, tempData)
               }
               //传入当前的别名进去
               combineHtml=ts.stringEachArr(template, tempData, i, n);
               outstr+=combineHtml.html;
               copyOutStr+=combineHtml.copyHtml;
              //  outstr += ts.stringEachArr(template, tempData, i, n)
           }
       } else if (tp === "object" && prefix) {
           var attrStr = "";
           for (attrStr in data) {
               temp = data[attrStr];
               temp = {
                   value: temp,
                   attr: attrStr
               };
               tempData = {};
               tempData[prefix] = temp;
               if (lastData) {
                   tempData = createInherit(lastData, tempData)
               }
               combineHtml=ts.stringEachArr(template, tempData);
               outstr+=combineHtml.html;
               copyOutStr+=combineHtml.copyHtml;
              //  outstr += ts.stringEachArr(template, tempData)
           }
       } else {
           if (lastData) {
               data = createInherit(lastData, data)
           }
           combineHtml=ts.stringEachArr(template, data, 0, 1);
           outstr=combineHtml.html;
           copyOutStr=combineHtml.copyHtml;
       }
var returnOut={html:outstr,copyHtml:copyOutStr};
      if(!mid){//表示为初始运行环境，才出去入口
//data为初次原始的data
      ts._handleDom(returnOut,callback);
    }
       return returnOut;
   }
}
    miniExtend(prototypePocket, extendParse);

    var runMountFun = function (amount, outDom,ts) {
    var afunAttr = null,
        afun = null,
        afargs = null;
    if(!amount){return false;}
    for (afunAttr in amount) {
        if (afunAttr in outDom) {
            afun = amount[afunAttr];
            afargs = getParaName(afun);
            afargs.forEach(function (arg, ind) {
                if (ind === 0) {
                    afargs[ind] = outDom[afunAttr];
                } else {
                    if (arg in outDom) {
                        afargs[ind] = outDom[arg];
                    } else {
                        afargs[ind] = null;
                    }
                }
            });
            afun.apply(ts, afargs);
        }
    }

}


var anaContent = function (txOb, bigOb, syncData, refAttr, idval, txId, item) {
    var uOb = bigOb[refAttr];
    if (!(refAttr in bigOb) || typeof bigOb[refAttr] !== "object") {
        uOb = bigOb[refAttr] = [];
        uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value,
        alias = txOb.alias;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};
    outOb.type = "textContent",
    outOb.value = val,
    outOb.attr = attr;
    outOb.identity = idval.toString() + txId;
    outOb.domId = idval;
    outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    if (alias) {
        outOb.alias = alias;
        fixPushArray(alias, syncData, outOb);
    }
    uOb.push(outOb);
}

var anaClass = function (txOb, bigOb, syncData, refAttr, ind, idval, txId, item) {
    var uOb = bigOb[refAttr];
    if (!(refAttr in bigOb) || typeof bigOb[refAttr] !== "object") {
        uOb = bigOb[refAttr] = [];
        uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value,
        alias = txOb.alias;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};
    // if (!(attr in uOb)) {
    //     outOb = uOb[attr] = {};
    // } else {
    //     outOb = uOb[attr];
    // }
    outOb.value = val,
    outOb.type = "class";
    outOb.classItem = ind;
    outOb.attr = attr;
    outOb.identity = idval.toString() + txId;
    outOb.domId = idval;
    outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    if (alias) {
        outOb.alias = alias;
        fixPushArray(alias, syncData, outOb);
    }
    uOb.push(outOb);
}

var anaStyle = function (txOb, bigOb, syncData, refAttr, styleAttr, idval, txId, item) {
    var uOb = bigOb[refAttr];
    if (!(refAttr in bigOb) || typeof bigOb[refAttr] !== "object") {
        uOb = bigOb[refAttr] = [];
        uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value,
        alias = txOb.alias;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};
    // if (!(attr in uOb)) {
    //     outOb = uOb[attr] = {};
    // } else {
    //     outOb = uOb[attr];
    // }
    outOb.value = val,
    outOb.type = "style";
    outOb.style = styleAttr;
    outOb.attr = attr;
    outOb.identity = idval.toString() + txId;
    outOb.domId = idval;
    outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    if (alias) {
        outOb.alias = alias;
        fixPushArray(alias, syncData, outOb);
    }
    uOb.push(outOb);
};

var anaFormValue = function (txOb, bigOb, syncData, refAttr, idval, txId, item) {

    var uOb = bigOb[refAttr];
    if (!(refAttr in bigOb) || typeof bigOb[refAttr] !== "object") {
        uOb = bigOb[refAttr] = [];
        uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value,
        alias = txOb.alias;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};

    outOb.value = val,
    outOb.type = "formValue";

    outOb.attr = attr;
    outOb.identity = idval.toString() + txId;
    outOb.domId = idval;
    outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    if (alias) {
        outOb.alias = alias;
        fixPushArray(alias, syncData, outOb);
    }
    uOb.push(outOb);
};

var anaPockData = function (txOb, bigOb, syncData, refAttr, idval, txId, item) {
    var uOb = bigOb[refAttr];
    if (!(refAttr in bigOb) || typeof bigOb[refAttr] !== "object") {
        uOb = bigOb[refAttr] = [];
        uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value,
        alias = txOb.alias;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};

    outOb.value = val,
    outOb.type = "pocketData";
    outOb.attr = attr;
    outOb.identity = idval.toString() + txId;
    outOb.domId = idval;
    outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    if (alias) {
        outOb.alias = alias;
        fixPushArray(alias, syncData, outOb);
    }
    uOb.push(outOb);
}

var tagAnaOne = function (ref, copyDom, store, sign, idval, updateObject, syncData, domItem) { //store为解析的时候存档的attr，value，idval表示dom代表的id，sign表示匹配的关键字
    var reg = new RegExp("\\#" + sign + "(\\d+)" + sign + "\\#", "gm");
    var textCont = getTextEle(copyDom[0]);
    if (textCont.trim()) {
        var textMatch,
            txId,
            txOb;
        while (textMatch = reg.exec(textCont)) {
            txId = textMatch[1];
            txOb = store[txId];
            anaContent(txOb, updateObject, syncData, ref, idval, txId, domItem);
        }
    }

    var tagName = copyDom[0].tagName;
    if (["INPUT", "TEXTAREA"].indexOf(tagName) !== -1) { //如果为可以输入的内容
        var tagValue;
        if (tagName === "INPUT") {
            tagValue = copyDom.val();
        } else {
            tagValue = copyDom.text();
        }
        while (textMatch = reg.exec(tagValue)) {
            txId = textMatch[1];
            txOb = store[txId];
            anaFormValue(txOb, updateObject, syncData, ref, idval, txId, domItem);
        }
    }

    var pockData = copyDom.attr("pocket-data");
    while (textMatch = reg.exec(pockData)) {
        txId = textMatch[1];
        txOb = store[txId];
        anaPockData(txOb, updateObject, syncData, ref, idval, txId, domItem);
    }

    var cla = copyDom.attr("class");
    if (cla) {
        cla = getAllClass(cla);
        cla.forEach(function (str, ind) {
            reg.lastIndex = 0;
            while (textMatch = reg.exec(str)) {
                txId = textMatch[1];
                txOb = store[txId];
                anaClass(txOb, updateObject, syncData, ref, ind, idval, txId, domItem);
            }
        });
    }
    var dv = $("<div></div>");
    dv.append(copyDom.clone(true));

    var cssMatch = /^\<[^\<\>]+style=[\'\"]?([\(\)\;\s\-\w\:\[\]\#]+)[\'\"]?[^\<\>]+\>/g.exec(dv.html()); //匹配头标签

    if (cssMatch) {
        cssMatch = cssMatch[1]
        cssMatch = cssMatch.split(";");
        cssMatch.forEach(function (strOb, ind) {
            strOb = strOb.split(":");
            var cattr = strOb[0],
                cval = strOb[1];
            reg.lastIndex = 0;
            while (textMatch = reg.exec(cval)) {
                txId = textMatch[1];
                txOb = store[txId];
                anaStyle(txOb, updateObject, syncData, ref, cattr, idval, txId, domItem);
            }
        });
    }
}

var tagAna = function (ref, copyDom, store, sign, idval, updateObject, syncData) {
    if (copyDom.length > 1) {
        copyDom.each(function (ind, dm) {
            dm = $(dm);
            tagAnaOne(ref, dm, store, sign, idval, updateObject, syncData, ind);
        });
    } else {
        tagAnaOne(ref, copyDom, store, sign, idval, updateObject, syncData);
    }
};

var extendDom = {
    _handleDom: function (htmlOb) {

        var htmlStr = htmlOb.html;
        var htmlCopy = htmlOb.copyHtml;
        var ts = this;
        var refOb = ts.refOb;
        // var mode=ts.mode;
        
        var dom = $(htmlStr);
        var root = $("<div></div>");
        root.append(dom);
        var copyDom = $(htmlCopy);
        
        var nd = null;
        var attr = null,
            val = null;
            //挂载函数集合
        var bmount = ts._beforeMount,
            amount = ts._afterMount;
        var record = ts.record; //是否记录；
        var kw = ts.keyword;
        var outDom = {};
        // var outRecord={};
        var aim = ts.aim,
            insertType = ts.insertType;

        for (attr in refOb) { //attr 代表名字
            if (refOb.hasOwnProperty(attr)) {
                val = refOb[attr];
                // 这个地方做的是,每个dom的统一指向，后面是具体指向
                nd = root.find('[data-xjref=' + attr + ']');
                //移除特质属性
                if(nd[0].hasAttribute("pocket-data")){nd.removeAttr("pocket-data");}
                outDom[attr] = nd;
                nd.removeAttr("data-xjref");
                nd.attr("data-"+kw, val);
            }
        }
        if (typeof aim === "string") {
            aim = $(aim);
        }
        
        if (bmount) {
            runMountFun(bmount, outDom,ts);
        }

        //在挂载前运行，callback
        var cback=ts.callback;
        var tpBack=typeof cback;
        if(tpBack==="function"){
          cback(dom);//这里一次性可以拿到所有渲染的dom，而update只能根据ref来。
        }
        else if(tpBack==="object"&&typeof cback.beforeMount==="function"){
          cback.beforeMount(dom);
        }
        delete ts.callback;

        if (insertType === "append") {
            aim.append(dom);
        } else if (insertType === "prepend") {
            aim.prepend(dom);
        } else {
            aim.html("").append(dom);
        }

        if (amount) { //先重复写，不用函数，以后和bmount有可能不一样
            runMountFun(amount, outDom,ts);
        }
        
        
        if (record === true) { //需要update情况下
            var copyRoot = $("<div></div>");
            copyRoot.append(copyDom);
            var signStore = ts.signStore,
                keySign = ts.keySign,
                updateObject = {},
                syncData={};//做同步内容使用
            for (attr in refOb) { //这里重复是不影响视图挂载。
                if (refOb.hasOwnProperty(attr)) {
                    val = refOb[attr];
                    updateObject[attr]=val;
                    var copyNd = copyRoot.find('[data-xjref=' + attr + ']');
                    //对每个元素进行分析。
                    tagAna(attr, copyNd, signStore,keySign,val,updateObject,syncData);
                }
            }

            ts.updateObject = updateObject;
            ts.syncData=syncData;
            var pockTs=Object.getPrototypeOf(ts);
            var expArr=pockTs._exps;
            if(!("_exps" in pockTs)){
              expArr=pockTs._exps=[];
            }
            //插入单个实例
            expArr.push(ts);
  
        }
        
        
        if(tpBack==="object"&&typeof cback.afterMount==="function"){
          cback.afterMount(dom);
        }


    
        ts.loaded = true;
        
        delete ts.storeExp;
        delete ts.refOb;
        delete ts.insertType;
        delete ts.aim;
        delete ts.record;
        delete ts.signStore;
        delete ts.signItem;
        delete ts.aliasArray;
        delete ts.storeExpItem;
        
        var tast=ts.loadTast;
        if(tast&&tast.length>0){
          tast.forEach(function(sk,ind){
            // ts._update(sk.ref,sk.attr,sk.value,sk.sync);
            ts._update.apply(ts,sk);
          });
        }
        
        var removeTask=ts.removeTask;
        if(removeTask&&removeTask.length>0){
          removeTask.forEach(function(sk,ind){
            ts.remove(sk);
          });
        }
        
        delete ts.loadTast;
        delete ts.removeTask;
    }

};
    miniExtend(prototypePocket, extendDom);

    var extendDomLife = {
    beforeMount: function (funOb) {
        if (typeHim(funOb) === "object") {
            if (!this._beforeMount) {
                this._beforeMount = funOb;
            } else {
                coverExtend(this._beforeMount, funOb)
            }
        }
    },
    afterMount: function (funOb) {
        if (typeHim(funOb) === "object") {
            if (!this._afterMount) {
                this._afterMount = funOb;
            } else {
                coverExtend(this._afterMount, funOb)
            }
        }
    },
    beforeUpdate: function (funOb) {
        if (typeHim(funOb) === "object") {
            if (!this._beforeUpdate) {
                this._beforeUpdate = funOb;
            } else {
                coverExtend(this._beforeUpdate, funOb)
            }
        } 
    },
    beforeRemove:function(funOb){
      if (typeHim(funOb) === "object") {
          if (!this._beforeRemove) {
              this._beforeRemove = funOb;
          } else {
              coverExtend(this._beforeRemove, funOb)
          }
      }
    },
    bind:function(newts){//newts要为新对象
      if(newts.loaded!==true){//必须是record并且加载完了的。
        return false;
      }
      var ts=this;
      var _exps=ts._exps;
      if(typeHim(_exps)==="array"){
        _exps.push(newts);
      }
    },
    noBind:function(){//清空这个对象绑定的内容，在父元素也找不到他。
      var ts=this;
      var proto=Object.getPrototypeOf(ts);
      var _exps=proto._exps;
      var ind;
      // delete ts.updateObject,delete ts.syncData;
      if(_exps&&(ind=_exps.indexOf(ts))!==-1){
        _exps.splice(ind,1);
      }
    },
    clear:function(){
      var ts=this;
      var proto=Object.getPrototypeOf(ts);
      var _exps=proto._exps;
      if(proto._exps){
        delete proto._exps;
      }
    },
    _removeRefInfo:function(ref){
      var ts=this;
      var syncData=ts.syncData,updateObject=ts.updateObject;
      var temp=null;
      var keys=[];
      for(var i in syncData){
        keys.push(i);
      }
        var n=keys.length,j=n-1,attr;
      for(;j>=0;j-=1){
        attr=keys[j];
        temp=syncData[attr];
        if(temp.ref===ref){
          delete syncData[attr];
        }
      }
        delete updateObject[ref];
    },
    _afterRemove:function(dom,ref){
      var ts=this;
      return function(){
      ts._removeRefInfo(ref);
        dom.remove();
      }
    },
    removeAll:function(ref,bcallback){
      var ts=this;
      var _exps=ts._exps;
      if(!_exps){return false;}
      _exps.forEach(function(obj,ind){
          obj.remove(ref,bcallback);
      });
    },
    remove: function (ref,bcallback) {
      var ts=this;
      if(!ref){return false;}
      if(ts.loaded!==true){
        var task=ts.removeTask;
        if(!("removeTask" in ts)){
          task=ts.removeTask=[];
        }
        task.push(ref);
      }
      else{
        var updateObject=ts.updateObject;
        var refOb=updateObject[ref];
        if(!refOb){return false;}//找不到返回
        var id,kw=ts.keyword;
        if(typeof refOb==="object"){
          id=refOb._pocket_id;
        }
        else{
          id=refOb;
        }
        var dom=$('[data-' + kw + '=' + id + ']');
        if(dom.length===0){//表示人为删除过这个dom
        ts._removeRefInfo(ref);
        return false;
        }
        var syncData=ts.syncData;
        if(typeof bcallback!=="function"){
          var beforeRemove=ts._beforeRemove;
              if(beforeRemove&&(ref in beforeRemove)){
                bcallback=beforeRemove[ref];
              }
        }
        if(typeof bcallback==="function"){
            bcallback.call(ts,dom,ts._afterRemove(dom,ref));
        }
        else{
            ts._afterRemove(dom,ref)();
        }
      }
    },
    updateAll:function(opt){
      var ts=this;
      var _exps=ts._exps;
      if(!_exps){return false;}
      _exps.forEach(function(obj,ind){
          obj.update(opt);
      });
    },
    update: function (opt) {
        var ts = this;
        var loaded = ts.loaded;
        // var sync=opt.sync;
        var ref = opt.ref,
            value = opt.value,
            sync = opt.sync,
            attr = opt.attr,
            beforeUpdate = opt.beforeUpdate;

        if (loaded !== true) {
            var tast = ts.loadTast;
            if (!ts.loadTast) {
                tast = ts.loadTast = [];
            }
            // tast.push({attr:attr,ref:ref,value:value,sync:sync,beforeUpdate:beforeUpdate});
            tast.push([ref, attr, value, sync, beforeUpdate])
        } else {
            ts._update(ref, attr, value, sync, beforeUpdate);
        }
    }
}
    miniExtend(prototypePocket, extendDomLife);
    var equalstyle=function(style,val1,val2){//这里暂时只是做了少许的认证
  var ifPx=false;
  if(val1.indexOf("px")!==-1){
    ifPx=true;
    val1=valPx(val1);
  }
  if(val2.indexOf("px")!==-1){
    ifPx=true;
    val2=valPx(val2);
  }
  if(ifPx===true){
    return +val1===+val2;
  }
  else{
    return val1===val2;
  }
}
var extendUpdate={
  _syncData: function (alias, identity, value, triggerDom) {
        var ts = this;
        var syncData = ts.syncData;
        var kw = this.keyword;
        var aliasArr = syncData[alias];
        if (!aliasArr) { //如果没有取到，清空
            return;
        }
    
        aliasArr.forEach(function (iob, ind) {
            var iden = iob.identity;
            if (iden !== identity) {
                ts._runAna(iob, value, $('[data-' + kw + '=' + iob.domId + ']'), null, null, triggerDom);
            }
        });
    },
    _updateCb: function (obj,refDom,sync) {
        var ts = this;

        return function (val) {

            var alias = obj.alias;
            var identity = obj.identity;
            var type=obj.type;
          // console.log(formValue)
            if (type === "textContent") { //后面要判断是否为可以编辑的dom
                if (hasData(val)) { //如果值不为空
                    var textDom = getTextEle(refDom[0],val);
                    // console.log(123)
                    // textDom.nodeValue = val;
                    obj.value = val; //覆盖旧的值
                }
            } else if (type === "class") {
                if (hasData(val)) {
                    var cla = getAllClass(refDom.attr("class"));
                    var lg = cla.length;
                    var classItem = obj.classItem;
                    var aimClass = cla[classItem];
                    if (aimClass !== val) { //在不想等的情况下才会重新复制
                        refDom.removeClass(aimClass).addClass(val);
                        obj.classItem = lg - 1; //换到最后一个。
                        obj.value = val;
                    }
                }
              
            } else if (type === "style") {
                if (hasData(val)) {
                    var style = obj.style;
                    var nowSvalue = refDom.css(style);
                    if (!equalstyle(style, nowSvalue, val)) { //这里的判断以后要更加的细致。10和10px是一样的。
                        refDom.css(style, val);
                        obj.value = val;
                    }
                }
            } else if (type === "formValue") {
                //不会再反射到dom的value上面了，因为是根据东西来的，除非值不一样。
                var fvalue = refDom.val();
                if (hasData(val) && val.toString() !== fvalue.toString()) { //两次值不等的情况下
                    refDom.val(val);
                    obj.value = val;
                } else {
                    obj.value = fvalue;
                } 
            }
            else if(type==="pocketData"){
              if(obj.value!==val){
              obj.value=val;
            }
            }
            if (sync === true && alias) {
              if(alias.indexOf(",")===-1){
                ts._syncData(alias, identity, obj.value, refDom); //只有表单才是只传入value值
              }
              else{
                alias=alias.split(",");
                alias.forEach(function(al){
                  ts._syncData(al, identity, obj.value, refDom);
                })
              }
            }
        }
    },
    _runAna: function (obj, val, refDom, sync, beforeUpdate, triggerDom) { //无trigger表示当前的发生
        var ts = this;
        var oldValue = obj.value; //旧的值
        var domItem = obj.domItem; //ref为集合的时候，取到具体一个
        var attr = obj.attr;
        if (typeof domItem === "number") {
            refDom = refDom.eq(domItem);
        } //取得具体dom
        var obBeforeUpdate = ts._beforeUpdate;
        
        if (typeof beforeUpdate !== "function"&&typeof obBeforeUpdate==="object") {
            beforeUpdate = obBeforeUpdate[obj.ref+"?"+attr];
        }
        //得到回调的update的运行对象
        var runObj = {
            lastValue: oldValue,
            value: val,
            trigger: triggerDom,
            current: refDom
        };
        
        // console.log(obj)
        if (typeof beforeUpdate === "function") {
            beforeUpdate.call(ts,runObj, ts._updateCb(obj,refDom,sync)); //可以为异步请求，
        } else {
            ts._updateCb(obj,refDom,sync)(val);
        }
    },
    _update: function (ref, attr, value, sync, beforeUpdate) {
        var ts = this;

        var syncData = ts.syncData,
            updateObject = ts.updateObject;
        if (!syncData) {
            return false;
        }
        
        var infoDom = updateObject[ref];

        
        if (!infoDom) {
            return false;
        }
        var kw = ts.keyword;
        var id = infoDom._pocket_id;

        var refDom = $('[data-' + kw + '=' + id + ']');
        if(refDom.length===0){
          ts._removeRefInfo(ref);
          return false;
        }
        // console.warn(refDom);

        infoDom.forEach(function (ob, ind) {//满足的统一处理
            if (ob.attr === attr) { //如果属性为attr，减少运行次数
                ts._runAna(ob, value, refDom, sync, beforeUpdate);
            }
        })
    }
}
    miniExtend(prototypePocket, extendUpdate);
    Pocket.prototype = prototypePocket;
    // gbl.Pocket = Pocket;

    if ( typeof define === "function" && define.amd ) {
    	define( "pocket", [], function() {
    		return Pocket;
    	} );
    }
    
    gbl.Pocket = Pocket;
    

})(typeof window !== 'undefined' ? window : null)