var splitStr=function(str,pos){
  var lf=str.slice(0,pos);
  var rt=str.slice(pos);
  return {left:lf,right:rt}
}

var getHtml=function(node){
  var div=document.createElement("div");
  div.appendChild(node);
  return div.innerHTML;
}

var createSpan=function(str){
  var span=document.createElement("span");
  span.innerHTML=str;
  return span;
}

