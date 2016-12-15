/*
 * @Author: jxj
 * @Date:   2016-10-10 15:05:41
 * @Last Modified by:   jxj
 * @Last Modified time: 2016-12-16 00:26:44
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
    
    var keyword="pocket_record_id";

var matchReg=function(match){
    return new RegExp("\\" + match + "([\\w\\.\\-\\:\\|\\,\\#\\s\\&\\u4e00-\\u9fa5]+)\\" + match, "gm");
};



var UserException=function(message) {
 this.message = message;
 this.name = "UserException";
};
    
    var templateCache = {};
    var Pocket = function (aim,url) {
      if(typeof aim==="string"){this.aim=aim;}
      if(typeof url==="string"){this.url=url;}
      this._init();
    };

    var prototypePocket = {
        constructor: Pocket,
        sn:{id:0}
    };
    
    var extendInit={
  _init:function(){
    this.id=this.sn.id+=1;
  }
}
    miniExtend(prototypePocket, extendInit);

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
};

Pocket.setFilter=function(opt){
  coverExtend(filters, opt);
}

miniExtend(renderPrototype,extendFilter);

var extendMatch={
  match: "?",
  regMatch: function() {
      var lf = this.match;
      return matchReg(lf);
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

miniExtend(renderPrototype,extendMatch);


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



//处理相关变量字符串，比如data:xxx|filter，把相关内容取出来。
var parseVariable = function(str) {
    var  vary, filter;
    var divide = "|";
    var potDivide = ":";
    var ind = str.indexOf(divide);
    // var lg = str.length;
    var potInd;
    var filterArr = null;
    var ifsave=false;
    // var status=null;
    if (ind !== -1) {//操作过滤器
        vary = str.slice(0, ind);
        filter = str.slice(ind + 1);
        if(filter&&filter.substr(-1,1)==="\&"){
          ifsave=true;
          filter=filter.slice(0,-1);
        }
        if (filter) {
            filterArr = filter.split(",")
        }
    } 
    else {
      if(str.substr(-1,1)==="\&"){
        ifsave=true;
        str=str.slice(0,-1);
      }
        vary = str
    }
    var firstAttr;
      firstAttr=vary.split(",")[0].split(":")[0];
      return {
          filter: filterArr,
          variable: vary,
          firstAttr:firstAttr,
          save:ifsave
      }
  
};



//对环境标签中{{ }}是for还是if进行具体处理
var parseS = function(str, match) {
  //如下的判断后面要改一下下
    var blankInd=str.indexOf(" ");
    // console.warn(blankInd)
    var tp=str;
    if(blankInd!==-1){
      tp = str.slice(0,blankInd);
    }

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
    } else if (tp === "template") {
        reg = /template\s*([\w\-]*)/;
        mat = reg.exec(str);
        obs = [mat[1]];
        obs.type="template";//由于copy和scope的长度都为1
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
      // var tsId=ts.id;
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
        //获得相关express
          var res = storeExp[attr];
          var expob = parseS(res.express, match);

          if (expob.type === "for") {
              var forVal = expob[1],forNameVal=expob[0];
              if(forVal[0]===match){//如果第一个是变量，要去掉匹配
                forVal=forVal.slice(1,-1);
                var forVaryOb = parseVariable(forVal);
                //解析for xx in yy的yy
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
          else if(expob.type==="template"){//细小子模版的内容
              var tmpInit=expob[0];
              tmpInit=tmpInit==="init"?true:false;
              return {
                init:tmpInit,
                type:"template",
                data:ob,
                template:res.html
              };
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
          // var kw=ts.keyword;
          //赋予唯一内容
          if(!(ref in refOb)){
            soleItem=ts.sn.id+=1;
            refOb[ref]=ref+"-"+soleItem;//埋入id,最后一个数字为唯一的id
          }
          return 'data-xjref="' + ref+'"';
      } 
      else {//单变量解析
          tmpob = ts.getMatchValue(varyOb, ob, item, blg);
          // if(typeof tmpob==="object"){tmpob=tmpob.toString();}
          
          var parOb={value:tmpob,attr:varyOb.firstAttr,save:varyOb.save};
          //变量要做随机标记
          parOb[ts.keySign]=true;
          return parOb;
          // return tmpob
      }
  }
};

miniExtend(renderPrototype,extendExpress);

//分析{{  }}环境标签
var anaTag = function(htm, match) {
  if(typeof htm!=="string"){return;}
 var regold = new RegExp('\\{\\{(\\w+)\\s*(\\' + match + '|\\{\\"|\\}|[\\:\\"\\,\\w\\s\\>\\<\\=\\|\\.\\!\\[\\]])*\\}\\}');
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
    regold.lastIndex=0;
    // try {
    //     tp = regold.exec(htm);
    // } catch (e) {
    //     console.log("loop write error");
    //     return;
    // }
    // var htmlArr = [];
    var tempHtml = "";
    do {
        if (no === 0) {
            if (!tp) {
                return false
            } else {
                tp = tp[1]
            }
            reg = new RegExp("\\{\\{" + tp + '\\s*(\\' + match + '|\\{\\"|\\}|[\\:\\[\\]\\,\\"\\w\\s\\>\\<\\!\\=\\|\\.])*\\}\\}|(\\{\\{\\/' + tp + 's*\\}\\})', "g");
            mat = reg.exec(htm);

            lf = [mat.index, reg.lastIndex]
        } else {
            mat = reg.exec(htm);

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
            //进一步的遍历
            tp = regold.exec(right);
            regold.lastIndex=0;
            out = out.concat(temp)
        }

    } while (mat && tp);
    out.push({
        html: right
    });
    return out
};


var extendParse={
  keySign:(function(){//只是作为当前运行的一个添加
  var rd=(100*(Math.random())).toFixed(0);
  return "pocket_var"+rd;
})(),
  _toSignString:function(attr,val,save){//save表示保存相关的变量值
    if(save!==true){return val;}//不保存，原内容返回
    var ts=this;
    var keySign=ts.keySign;
    var item=ts.signItem+=1;
    item=item.toString();
    ts.signStore[item]={attr:attr,value:val};
    return "#"+keySign+item+keySign+"#";
  },
   stringEachArr: function(str, obs, item, blg) {//从render进入的入口
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
            copyOutStr+=ts._toSignString(matchVal.attr,matchVal.value,matchVal.save);
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
       //变量赋值化字符串内容
       var mat = ts.handExpress(str, obs, item, blg);
       var keySign=ts.keySign;
  
       if (["number", "string"].indexOf(typeof mat) !== -1) {
           return mat;
       }
        else if(mat[keySign]===true){
          return mat;
        }
        else {
           return ts.render(mat, "middle");
       }
   },
   _changeToTemplate:function(htm){
    var keySign=this.keySign;
    return '<script class="'+keySign+'" type="text/html">'+htm+'<\/script>'; 
   },
   render: function(opt, mid) {
       var strhtml = opt.template,
           data = opt.data;
       var prefix = opt.prefix;
      //  var noMerge = opt.noMerge;
       var ts = this;
       var match = this.match;
       var strarr = anaTag(strhtml, match);//分析{{}}关键字
       var callback = opt.callback;
       var lastData = opt.lastData;
       var type=opt.type;

       //针对临时模版的渲染
       var init=opt.init;

       var template = "";
       var newItem;
       var tempData = null;
       var temp = null;

       var outstr = "",copyOutStr="";
      if(type==="template"){//如果是模版型号，初始存一个副本
        outstr=copyOutStr=ts._changeToTemplate(strhtml);
        if(init!==true){//如果不为true表示模版不需要初始化
          return {html:outstr,copyHtml:copyOutStr};
        }
      }

       //把html字符串再进行{{}}解析
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
      var i = 0,n;

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
               //如果数据是数组，遍历执行
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
           outstr+=combineHtml.html;
           copyOutStr+=combineHtml.copyHtml;
       }

      var returnOut={html:outstr,copyHtml:copyOutStr};

      if(!mid){//表示为初始运行环境，才出去入口
//data为初次原始的data
      // ts._handleDom(returnOut);
      if(typeof callback==="function"){
        callback(returnOut,ts.refOb,ts.signStore,ts.keySign);
      }
    }


       return returnOut;
   }
}

miniExtend(renderPrototype,extendParse);


Render.prototype=renderPrototype;
var UpdateRun=(function(){
  var clear = function () {
    this._runFuns = [];
    this._args = [];
    this.break = true;
}
var get = function (fun) {
    var runFuns = this._runFuns;
    runFuns.push(fun);
    return this;
};
var endCallback = function (fun) {
    if (typeof fun !== "function") {
        return false;
    }
    this._endFun = fun;
};

var setLength = function (lg) {
    if (typeof lg !== "number") {
        return false;
    }
    this.length = lg;
};

var cycle = function (outNo, length, defStart) {
    if (!defStart) {
        defStart = 0;
    }
    // var outNo=startNo+addNo;
    var mod,
        divide;
    var cut;
    var outLength = length + defStart - 1;
    if (outNo > outLength) {
        cut = outNo - outLength; //得到差值
        mod = cut % length; //得到余数
        if (mod === 0) {
            outNo = outLength; //如果参数都是周期则。。
        } else {
            outNo = defStart - 1 + mod; //多加初始值，要减去一的
        }
    } else if (outNo < defStart) { //小于开始的默认值
        cut = defStart - outNo; //差值
        mod = cut % length;
        if (mod === 0) {
            outNo = 0;
        } else {
            outNo = outLength + 1 - mod; //由于0到length也有一个长度所以要+
        }
    }
    return outNo;
};;
var setArg = function (opt) { //逻辑为如果有item，则给固定的item对应设置函数，
    //否则给全部的args的数量来绑定arg，如果为insert为append，则追加arg到arg后面
    //遍历的数量，要么数量确定，要么，根据funs的长度来
    //opt:{item:0,arg:[xx],insert:append}
    //即使全部一样设置，也能做到特殊性
    var item = opt.item,
        arg = opt.arg, //arg为数组
        insert = opt.insert;
    var args = this._args;
    var runfuns = this._runFuns;
    //判断长度，如果没有取runfuns的长度
    var lg = this.length;
    if (!lg) {
        lg = runfuns.length;
    }

    if (typeof item === "number") {
        if (!args[item]) {
            args[item] = [];
        }
        if (insert === "append") { //append表示插入
            args[item] = args[item].concat(arg);
        } else {
            args[item] = arg;
        }
    } else { //全部覆盖的
        var i = 0;
        for (; i < lg; i += 1) {
            //取到某个arg
            var targ = args[i];
            if (!targ) { //没有的话初始化为数组
                args[i] = [];
            }
            if (insert === "append") { //添加
                args[i] = args[i].concat(arg);
            } else { //覆盖
                args[i] = arg;
            }
        }
    }
}

var Sync = (function () {
    var go = function (startNo) { //里面传入参数,这个arg要为数组。而后面next的内容可以随便
        var runFuns = this._runFuns;
        // if(!runFuns){return false;}
        var lg = this.length;
        if (!lg) {
            lg = runFuns.length;
        }

        var nowFocus = 0;
        //新生成一个对象
        var f = function () {};
        f.prototype = this;
        var nowThis = new f();

        nowThis.focus = nowFocus; //开始焦点
        nowThis.collectData = [];
        nowThis.break = false; //设置终端
        nowThis.length = lg; //设置长度
        nowThis._args = [].concat(nowThis._args);

        setTimeout(function () {
            var args = nowThis._args;
            var nowFocus = nowThis.focus;
            var fun = runFuns[nowFocus];
            var arg = args[nowFocus];
              nowThis.focus += 1;
            fun.call(nowThis, {setup: arg});
          
        }, 0);

        return nowThis;
    };

    //除了第一个函数是按setup传入，其他的都是{setup:,flow:}来传入
    var next = function () { //传入的参数优先级更高，其次才是_arg
        var endFun = this._endFun;
        if (this.break === true) { //如果终端则停止
            if (endFun) {
                endFun(this.collectData);
            }
            return;
        }
        var arg = Array.prototype.slice.call(arguments, 0); //flow参数
        var args = this._args; //setup参数
        var lg = this.length; //运行长度
        var focus = this.focus;
        var runFuns = this._runFuns;
        var funLength = runFuns.length; //函数总长度

        var outFocus = cycle(focus, funLength); //得到循环的具体长度

        var setupArg = args[focus]; //setup参数,只按照focus的走

        var funArg = {
            setup: setupArg,
            flow: arg
        };

        var data = this.collectData;
        data.push(funArg); //收集数据
this.focus += 1; //焦点添加1
        if (focus >= lg) { //如果超过了长度，也就是必须在最后运行函数里面加上next
            this.focus = 0;
            if (endFun) {
                endFun.call(null, data);
            }
        } else { //如果这里继续运行的，会在这里形成，，，等待递归，this.focus必须在前面
            //真正取得的函数

            //如果只有一个，则循环运行，达到长度为止
            //这里如果是同步运行，会在辞典一直运行下去
            runFuns[outFocus].call(this, funArg);
            // (this._runFuns.shift()).apply(this,arg);
        }
        
    }
    Sync = function () {
        this._runFuns = [];
        this._args = [];
        // this.focus = 0;
        // this.break = false; //中断运行
    }

    Sync.prototype = {
        constructor: Sync,
        clear: clear,
        get: get,
        setArg: setArg,
        setCallback: endCallback,
        go: go,
        setLength: setLength,
        next: next
    };

    return Sync;
})();

var Collect = (function () {

    var go = function (startNo) { //里面传入参数,这个arg要为数组。而后面next的内容可以随便
        var runFuns = this._runFuns;
        // if(runFuns.length===0){return false;}
        var lg = this.length;
        if (!lg) {
            lg = runFuns.length;
        }

        var nowFocus = 0;
        //新生成一个对象
        var f = function () {};
        f.prototype = this;
        var nowThis = new f();

        nowThis.focus = nowFocus; //开始焦点
        nowThis.collectData = [];
        nowThis.break = false; //设置终端
        nowThis.length = lg; //设置长度
        nowThis._args = [].concat(nowThis._args);
        //延迟运行
        setTimeout(function () {
            var args = nowThis._args;
            var nowFocus = nowThis.focus;
            var runfuns = nowThis._runFuns;
            var lg = nowThis.length; //有可能回调后再取一次，所以，
            var funLength = runfuns.length;
            var i = 0;
            var fun = null;
            var outFocus;
            var arg = null;
            for (; i < lg; i += 1) {
                outFocus = cycle(i, funLength);
                fun = runfuns[outFocus]; //取得真实的运行函数
                arg = args[i];
                
                fun.call(nowThis,{setup:arg});
            }
        }, 0);
        return nowThis;
    };

    var next = function () { //传入的参数优先级更高，其次才是_arg
        var endFun = this._endFun;
        if (this.break === true) { //如果终端则停止
            if (endFun) {
                endFun(this.collectData);
            }
            return;
        }
        var arg = Array.prototype.slice.call(arguments, 0); //flow参数
        var lg = this.length; //运行长度
        var focus = this.focus;
        var data = this.collectData;
        data.push(arg); //收集数据
        this.focus += 1; //焦点添加1
        
        if (focus >= lg - 1) { //如果超过了长度，也就是必须在最后运行函数里面加上next
            this.focus = 0;
            if (endFun) {
                endFun.call(null, data);
            }
        }
        
    }

    Collect = function () {
        this._runFuns = [];
        this._args = [];
        // this.focus = 0;
        // this.break = false; //中断运行
    }

    Collect.prototype = {
        constructor: Collect,
        clear: clear,
        get: get,
        setArg: setArg,
        setCallback: endCallback,
        go: go,
        setLength: setLength,
        next: next
    }
    return Collect;
})();
  var f=function(factory,updateCallbacks,updateInfos){
    //updateCallbacks是包含各种状态的回调运行函数，updateInfos是变量存储的各种内容
  
    this.updateCallbacks=updateCallbacks;
    this.updateInfos=updateInfos;
    this.factory=factory;
    this.binds={};
  };
  
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

var extendRender = {
    setTemplate: function (url, jsonp) {
        if (typeof url === "string") { //暂时不做强判断
            // this.usePrivate("url",url);
            this.url = url;
        }
        if (jsonp === "jsonp") {
            this.jsonp = true;
        }
    },
    setHtml: function (tmp) {
        if (typeof tmp === "string") { //暂时不做强判断
            // this.usePrivate("template",tmp);
            this.template = tmp;
        }
    },
    setContainer: function (sel) {
        if (typeof sel === "string") { //暂时不做强判断
            // this.usePrivate("aim",sel);
            this.aim = sel;
        }
    },
    setCallback:function(fun){
      var ts=this;
      if(typeof fun==="function"){
        ts.mountCallback=fun;
      }
    },
    _sendData: function (lazyData) {
        var ts = this;
        return function (data) {
            if (typeof lazyData === "object" && data) {
                lazyData.data = data;
            } else {
                lazyData = {
                    data: data
                };
            }
            ts.render(lazyData, ts);
        }
    },
    useData: function (fun) {
        var ts = this;
        if (!(typeof fun === "function")) {
            return ts;
        }
        var newTs = createInherit(ts);
        newTs._cbData = true;
        setTimeout(function () {
            var lazyData = newTs.lazyData;
            newTs._cbData = false;
            // newTs.lazyData
            fun(newTs._sendData(lazyData));
            delete newTs.lazyData;
            delete newTs._cbData;
        }, 0);
        return newTs;
    },
    render: function (opt, newTs) {
        var ts = this;
        if (ts._cbData === true) { //只是取值的过程
            ts.lazyData = opt;
            return ts;
        }

        var aim,
            attrs,
            data,
            strhtml,
            url,
            record,
            insert,
            jsonp,
            mode;
        if (opt) {
            aim = opt.aim,
            attrs = opt.attrs; //放入attrs属性
            data = opt.data,
            strhtml = opt.template;
            url = opt.url;
            insert = opt.insert;
            jsonp = opt.jsonp;
            // mode=opt.mode;
        }
        //参数处理,传入和默认的做对比，优先参数传入的，
        strhtml = strhtml
            ? strhtml
            : ts.template;
        url = url
            ? url
            : ts.url;
        aim = aim
            ? aim
            : ts.aim;

        //参数处理结束
        if (!(newTs && ("render" in newTs))) {
            newTs = createInherit(ts);
        }
        newTs.aim = aim; //新的对象拥有自己的aim属性
        // newTs.insertType = insert; //表示插入模式
       
        if (jsonp === undefined) {
            jsonp = ts.jsonp;
        }
        if (attrs !== undefined) {
            newTs.attrs = attrs;
        }

        if (url && url in templateCache) {
            strhtml = templateCache[url];
        }
        
        var outData = {
            template: strhtml,
            data: data,
            callback:function(htmlObj,refOb,signStore,keySign){
                newTs._handleDom(htmlObj,insert,refOb,signStore,keySign);
            }
        };

        var newRender=new Render();
        setTimeout(function () {
            if (strhtml) {
                // newTs._render(outData);
                newRender.render(outData);
            } else {
                anaInclude({
                    url: url,
                    callback: function (ob) {
                        var html = templateCache[url] = ob.html;
                        outData.template = html;
                        newRender.render(outData);
                        // newTs._render(outData)
                    },
                    jsonp: jsonp
                })
            }
        }, 0);

        //返回的内容
        var updateOb = new Update();
        newTs.updateOb = updateOb;
        //前端大多异步，所以返回是无用的
        // return updateOb;
    }
}
    miniExtend(prototypePocket, extendRender);


    var runMountFun = function (amount, outDom, ts) {
    var afunAttr = null,
        afun = null,
        afargs = null;
    if (!amount) {
        return false;
    }
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

// var fixPushArray=function(alias,syncData,outOb){
//   var aliasArr=alias.split(",");
//   var temp=null;
//   //别名有多个，然后al分拆下来，如果这个内容没有在对象syncdata里面有的话，则生成为[]，然后push outOb
//   aliasArr.forEach(function(al,ind){
//     temp=syncData[al];
//     if(!(al in syncData)){
//       temp=syncData[al]=[];
//     }
//     temp.push(outOb);
//   });
// }


var _anaContent = function (updateObject,txOb, refAttr, idval, txId, item) {
  var ts=this;
    var uOb = updateObject[refAttr];
    if (!(refAttr in updateObject) || typeof updateObject[refAttr] !== "object") {
        uOb = updateObject[refAttr] = [];
        // uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};
    outOb.type = "textContent",
    outOb.value = val,
    outOb.attr = attr;
    // outOb.identity = idval.toString() + txId;
    // outOb.domId = idval;
    // outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    uOb.push(outOb);
}


var _anaClass = function (updateObject,txOb, refAttr, ind, idval, txId, item) {
  var ts=this;
    var uOb = updateObject[refAttr];
    if (!(refAttr in updateObject) || typeof updateObject[refAttr] !== "object") {
        uOb = updateObject[refAttr] = [];
        // uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};
    outOb.value = val,
    outOb.type = "class";
    outOb.classItem = ind;
    outOb.attr = attr;
    // outOb.identity = idval.toString() + txId;
    // outOb.domId = idval;
    // outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }

    uOb.push(outOb);
}

var _anaStyle = function (updateObject,txOb, refAttr, styleAttr, idval, txId, item) {
  var ts=this;

    var uOb = updateObject[refAttr];
    if (!(refAttr in updateObject) || typeof updateObject[refAttr] !== "object") {
        uOb = updateObject[refAttr] = [];
        // uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};
    outOb.value = val,
    outOb.type = "style";
    outOb.style = styleAttr;
    outOb.attr = attr;
    // outOb.identity = idval.toString() + txId;
    // outOb.domId = idval;
    // outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    uOb.push(outOb);
};



var _anaFormValue = function (updateObject,txOb,refAttr, idval, txId, item) {
  var ts=this;

    var uOb = updateObject[refAttr];
    if (!(refAttr in updateObject) || typeof updateObject[refAttr] !== "object") {
        uOb = updateObject[refAttr] = [];
        // uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};

    outOb.value = val,
    outOb.type = "formValue";

    outOb.attr = attr;
    // outOb.identity = idval.toString() + txId;
    // outOb.domId = idval;
    // outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    uOb.push(outOb);
};


var _anaPockData = function (updateObject,txOb, refAttr, idval, txId, item) {
  var ts=this;
    var uOb = updateObject[refAttr];
    if (!(refAttr in updateObject) || typeof updateObject[refAttr] !== "object") {
        uOb = updateObject[refAttr] = [];
        // uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};
    outOb.value = val,
    outOb.type = "pocketData";
    outOb.attr = attr;
    // outOb.identity = idval.toString() + txId;
    // outOb.domId = idval;
    // outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    uOb.push(outOb);
}



var _tagAnaOne = function (updateObject,ref, copyDom, store, sign, domId, domItem) { //store为解析的时候存档的attr，value，domId表示dom代表的id，sign表示匹配的关键字
//domItem表示集合中第几个dom
    var reg = new RegExp("\\#" + sign + "(\\d+)" + sign + "\\#", "gm");
    var textCont = getTextEle(copyDom[0]);
    //txid是针对到每个属性的id，是更细化的，因为dom可能会有多个变量
    if (textCont.trim()) {
        var textMatch,
            txId,
            txOb;
        while (textMatch = reg.exec(textCont)) {
            txId = textMatch[1];
            txOb = store[txId];
            //对每一个变量所在的位置进行分析。
            _anaContent(updateObject,txOb, ref, domId, txId, domItem);
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
            _anaFormValue(updateObject,txOb, ref, domId, txId, domItem);
        }
    }

    var pockData = copyDom.attr("pocket-data");
    while (textMatch = reg.exec(pockData)) {
        txId = textMatch[1];
        txOb = store[txId];
        _anaPockData(updateObject,txOb, ref, domId, txId, domItem);
    }

    var cla = copyDom.attr("class");
    if (cla) {
        cla = getAllClass(cla);
        cla.forEach(function (str, ind) {
            reg.lastIndex = 0;
            while (textMatch = reg.exec(str)) {
                txId = textMatch[1];
                txOb = store[txId];
                _anaClass(updateObject,txOb,ref, ind, domId, txId, domItem);
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
                _anaStyle(updateObject,txOb ,ref, cattr, domId, txId, domItem);
            }
        });
    }
}


var tagAna = function (updateObject,ref, copyDom, signStore, sign, domId) {
    if (copyDom.length > 1) {
        copyDom.each(function (ind, dm) {
            dm = $(dm);
            _tagAnaOne(updateObject,ref, dm, signStore, sign, domId,ind);
        });
    } else {
        _tagAnaOne(updateObject,ref, copyDom, signStore, sign, domId);
    }
};

var extendDom = {
    keyword:keyword,
    _handleDom: function (htmlOb,insertType,refOb,signStore,keySign) {
        var htmlStr = htmlOb.html;
        var htmlCopy = htmlOb.copyHtml;
        var ts = this;
        // 从render来
        // var refOb = ts.refOb;
        //         //拿到匹配的数据
        // var signStore = ts.signStore,
        //     keySign = ts.keySign; //keysign为# ..    ..#的标识符
        var dom = $(htmlStr);
        var root = $("<div></div>");
        root.append(dom);
        var copyDom = $(htmlCopy);
        var nd = null;
        var ref = null,
            domId = null;
        //挂载函数集合
        var bmount = ts._beforeMount,
            amount = ts._afterMount;
        var attrs = ts.attrs;
        //放出的接口
        var updateOb = ts.updateOb; 
        var kw = ts.keyword;
        var outDom = {};
        var aim = ts.aim;
            // insertType = ts.insertType;
        var copyRoot = $("<div></div>");
        copyRoot.append(copyDom);

        var updateObject = {};

        for (ref in refOb) { //ref 代表名字
            if (refOb.hasOwnProperty(ref)) {
                domId = refOb[ref];
                // 这个地方做的是,每个dom的统一指向，后面是具体指向
                nd = root.find('[data-xjref=' + ref + ']');
                copyNd = copyRoot.find('[data-xjref=' + ref + ']');

                //移除特质属性
                if (nd[0].hasAttribute("pocket-data")) {
                    nd.removeAttr("pocket-data");
                }
                outDom[ref] = nd;
                nd.removeAttr("data-xjref");
                //正式绑定关键字id
                nd[0].setAttribute("data-" + kw, domId);
                tagAna(updateObject, ref, copyNd, signStore, keySign, domId);
            }
        }

        updateOb.init(updateObject, attrs, refOb, ts._update); //传入更新的对象。
        if (typeof aim === "string") {
            aim = $(aim);
        }
        
        if(typeof ts.mountCallback==="function"){
          ts.mountCallback.call(updateOb);//把新生成的updateOb放进去作为相关的回调
        }
        
        if (bmount) {
            runMountFun(bmount, outDom,updateOb);
        }
        if (insertType === "append") {
            aim.append(dom);
        } else if (insertType === "prepend") {
            aim.prepend(dom);
        } else {
            aim.html("").append(dom);
        }

        if (amount) { //先重复写，不用函数，以后和bmount有可能不一样
            runMountFun(amount, outDom, updateOb);
        }
        
        // delete updateOb.loadTast;
        updateOb.loaded = true;
        
        delete ts.updateOb;
//只是临时生成，然后就会消失，不用delete
        // delete ts.storeExp;
        // delete ts.refOb;
        // delete ts.insertType;
        // delete ts.aim;
        // delete ts.signStore;
        // delete ts.signItem;
        // delete ts.aliasArray;
        // delete ts.storeExpItem;
        // delete ts.updateOb;
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
    update: function (funOb) {//格式为 refa:{action:{"click":function(){}}}
        if (typeHim(funOb) === "object") {
            if (!this._update) {
                this._update = funOb;
            } else {
                coverExtend(this._update, funOb)
            }
        } 
    }
}
    miniExtend(prototypePocket, extendDomLife);

    Pocket.prototype = prototypePocket;

    if ( typeof define === "function" && define.amd ) {
    	define( "pocket", [], function() {
    		return Pocket;
    	} );
    }
    if ( typeof module === "object" && typeof module.exports === "object" ) {
      module.exports=Pocket;
    }
    
    
    gbl.Pocket = Pocket;
    

})(typeof window !== 'undefined' ? window : null)