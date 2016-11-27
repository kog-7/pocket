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
  _toSignString:function(attr,val,save){//save表示保存相关的变量值
    if(save!==true){return val;}//不保存，原内容返回
    var ts=this;
    var keySign=ts.keySign;
    var item=ts.signItem+=1;
    item=item.toString();
    ts.signStore[item]={attr:attr,value:val};
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
      //  var callback = opt.callback;
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
      ts._handleDom(returnOut);
    }
       return returnOut;
   }
}