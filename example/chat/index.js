@include(src/utils.js)
@include(src/handle.js)

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
