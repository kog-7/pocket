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
      var tsId=ts.id;
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
            refOb[ref]=ref+"-"+tsId+"-"+soleItem;//埋入id,最后一个数字为唯一的id
          }
          return 'data-xjref="' + ref+'"';
      } 
      else {//单变量解析
          tmpob = ts.getMatchValue(varyOb, ob, item, blg);
          // if(typeof tmpob==="object"){tmpob=tmpob.toString();}
          
          var parOb={value:tmpob,attr:varyOb.firstAttr,save:varyOb.save};
          parOb[ts.keySign]=true;
          return parOb;
          // return tmpob
      }
  }
};