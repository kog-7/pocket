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

var pokChat=new Pocket("#article","example/chat/project/templates/chat.html");

var pokItem=new Pocket();
pokItem.setTemplate("example/chat/project/templates/display-item.html");
var data={position:0,face:null,focus:null};

pokChat.beforeMount({
  chat:function(dom){
    this.allFace.bind("select","edit.insert");
  },
  send:function(dom,display,edit){
    var ts=this;
    dom.on("click",function(){
      pokItem.render({
        insert:"append",
        aim:display,
        data:{content:edit.html()}
      });
    });
  },
  edit:function(dom){
    var ts=this;
    data.focus=dom[0];
    dom.on("keyup click",function(){
      var node=this;
      ts.edit.sync().updateState("focus",function(cb,run){
        var focusInfo=focusPos(node);
        data.position=focusInfo.pos;
        data.focus=focusInfo.focus;
        run(data);
      });
    });
  },
  face:function(dom,allFace){
    dom.on("click",function(){
      allFace.toggleClass("face-active");
    });
  },
  allFace:function(dom){
    var ts=this;
    dom.on("click","img",function(e){
     var img=this;
        ts.allFace.sync().updateState("select",function(cb,run,lastValue,store){
          data.face=img.cloneNode();
          run(data);
        });
    });
  }
  
});
pokChat.afterMount({
});

pokChat.update({
  edit:{
  focus:function(opt,cb){
    //暂时没有内容
  },
  insert:function(opt,cb){
    var current=opt.current[0];
    var value=opt.value;
    var focusDom=value.focus,pos=value.position,imgStr=getHtml(value.face);
    var htmlOb=null,tp=focusDom.nodeType,newFocus=null;
    if(!focusDom){return;}
    var parent=focusDom.parentNode;
    if(!parent){return;}
    console.log(focusDom===current)
    if(tp===3){//如果是字符串类型
    // htmlOb=splitStr(focusDom.nodeValue,pos);
    createAndParse(focusDom,pos,imgStr,parent);
    }
    else if(tp===1&&focusDom===current){//如果是初始的外壳dom
      htmlOb=splitStr(focusDom.innerHTML,pos);
      focusDom.innerHTML=htmlOb.left+imgStr+htmlOb.right;
    }
    else{//如果是换行的新dom
      var childNode=focusDom.children[pos];
      focusDom.insertBefore(value.face,childNode);
      // focusDom.append(value.face);
    }
  }
  },
  allFace:{
    select:function(opt,cb){
      var trigger=opt.trigger,current=opt.current;
      var value=opt.value;
      cb(value);
    }
  }
});

pokChat.useData(function(cb){
  $.ajax({dataType:"json",url:"data/data.json"}).done(function(da){
    cb(da);
  });
}).render();