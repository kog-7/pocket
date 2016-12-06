var focusPos=function(dom){//原生dom
var sel=this.getSelection();
// console.warn(sel.focusNode,sel.anchorOffset)
return {focus:sel.focusNode,pos:sel.anchorOffset};
}

var changeSafe=function(str){
  return str.replace(/\&lt\;|\&gt\;/g,function(str){
    if(str.indexOf("g")!==-1){
      return ">";
    }
    else{
      return "<";
    }
  });
}

var createAndParse=(function(){
  //有可能会变成添加然后。。
  var tmp="chat_temp_"+(Math.random()*1000).toFixed(0),lg=tmp.length;
  return function(txtNode,pos,insertHtml,dom){
    txtNode.insertData(pos,tmp+insertHtml+tmp);
    var html=dom.innerHTML;
    var first=html.indexOf(tmp)+lg,last=html.lastIndexOf(tmp);
    var inner=html.slice(first,last);
    inner=changeSafe(inner);
    dom.innerHTML=html.slice(0,first-lg)+inner+html.slice(last+lg);
  }
})()