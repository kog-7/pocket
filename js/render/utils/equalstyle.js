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