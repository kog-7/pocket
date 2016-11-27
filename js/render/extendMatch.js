
var extendMatch={
  sn: {
      item: 0,//作为所有的唯一的序列
      id:0//作为每一个实例的id
  },
  keyword:keyword,
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