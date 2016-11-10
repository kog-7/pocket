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