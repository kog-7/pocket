# Pocket

Pocket 是方便处理连串异步过程的javascript视图层框架


![](http://pocketjs.oss-cn-hongkong.aliyuncs.com/pocketjs.gif)


* <font size=2>pocket用于中小项目，或者是项目中的某些异步打包过程比较多的小模块。</font>
* <font size=2>pocket使用起来非常简单，核心api只有6个，能够很方便的处理连串的异步执行和异步收集执行。</font>
* <font size=2>使用文件模式创建模版和子模版，附加模版处理语法</font>
* <font size=2>由于源码里面用到了jquery的ajax和dom处理，使用之前要加载jquery</font>
* <font size=2>体积小，压缩后只有18.5k

#### 核心流程
![](http://pocketjs.oss-cn-hongkong.aliyuncs.com/pocket.png)



#### 为什么使用
平常的工作内容或者个人作业，除了大项目，还有很多偏小型的项目，比如h5页面，一些逻辑和结构偏小的web页面，或者是引入某些第三方模块这些。如果都用webpack和react这些大东西可能有些麻烦。使用pocket非常简单，提供一个视图的基本操作流程和异步或同步下的状态更新+状态回调，基于html文件的模版学习容易也方便转换。

#### 内容描述 
<font size=2>假如有个场景，界面由两个内容组成，一个是请求信息按钮，一个是即将由数据组成其内容的div。  
现在的需求是，点击按钮，div上面出现等待动画，按钮形状变成一个进度条，同时请求ajax并且进度条开始走动，在ajax请求完成的时候，div的内容被渲染出来，div的加载动画消失，按钮从进度条样式恢复成按钮样式</font>  

图:
![](http://pocketjs.oss-cn-hongkong.aliyuncs.com/pocketexp.gif)

> <font size=2>标签描述：按钮button里面有loading功能的div，有显示文字的span，div里面有使用js等待动画的三个span。</font> 

如果通过pocket完成上面的描述主要过程如下。
* <font size=2>首先确定好关于按钮标签的名字/状态(btn/begin,process,complete)，按钮进度条标签名字/状态(position/run,stop)，div信息外壳标签名字/状态(loading/run,stop).并确定好运行过程中不停变化的相关数据对象格式
* 在templates文件夹中确定好模版html片段和子模版html片段，根据情况给dom设置名字，通过?REFbtn?，设置变量```<button ?REFbtn?>?name:保存?</button>```
* <font size=2>通过pocket实例的update方法来设置相关dom和其状态在更新触发过程中需要运行的函数，比如```.update({btn:{begin:function(opt,cb){}}...)//opt属性有trigger（从哪里bind同步过来），current（当前元素），value，message```等等
* <font size=2>通过setCallback方法，类似```setCallback(function(){this.btn.bind("complete","loading.run")})```来绑定同步关系。相关过程为，在btn complete状态所对应的前面update里的回调函数在执行过程中，如果运行cb(123)，会把123和triggert:btn（jq对象）传输给loading.run在update下面的回调函数并运行(*loading.run也可以绑定其他dom的状态，让回调一直运行下去*)
* <font size=2>给目标dom位置通过```useData(function(cb){$.ajax....(cb(data))}).render();```进行数据和模版的合并，并渲染出前面描述的请求按钮和显示信息的div这些元素
* <font size=2>通过beforeMount方法（dom生成但是还没有挂载之前）给btn或者其他dom绑定事件
* <font size=2>在btn绑定的事件函数里面生成一个data对象数据，通过updateState方法来对这个数据进行一步一步的处理。并自动执行前面update方法绑定的相关回调，updateState只应该用于处理数据，包括异步和同步（异步支持队列式的一个个异步运行，也支持同时运行所有异步，在所有异步完成后再收集运行）
  ```
  //ts是在beforeMount中btn对应的函数里的this  
   var data={items:[],ctr:false};
   ts.btn.sync().updateState("begin",function(cb,run){
     run(),setTimeout(....cb(data))})
   .updateState("process",function(cb,run,lastData,store){
     run(lastData);$.ajax(..).done(data){someHandle(lastData);run(lastData);
       cb(lastData);}})
   .updateState("complete",function(cb,run,lasteData){
     ......
     })
```
* 接下来，相关代码会根据改变状态来同步或者异步的处理相关业务过程所对应的唯一一个对象数据，并根据情况来执行连串的函数回调，整体达到业务目标。

> <font size=2>相关模版片段可见文件夹example/write 通过setTimeout模拟异步

> min.js链接地址 http://pocketjs.oss-cn-hongkong.aliyuncs.com/pocket.min.js

>npm地址 https://www.npmjs.com/package/pocketjs-inbrowser


##例子
###### 模版：templates/tmp.html ... templates/sub.html 
```html
//tmp.html 
<article class="" ?REFart?>
  @include(sub.html)
<button  ?REFbtn? >
  //name是变量值，保存是变量没有匹配后的默认值，&表示模版渲染完成后保存btn里面对应的变量为name的数据
?name:保存&?
</button>
<div ?REFcontent?>内容</div>
<div ?REFnumber?>?number?</div>
//sub.html 
<h1>base example</h1>
```
###### index.html里面的内容操作
```js 
<div id="cont"></div>
<script>
//指定容器位置和模版位置
  var pok = new Pocket("#cont", "templates/tmp.html");

  //每次相关视图渲染后的回调，可以在里面绑定update中状态与状态的同步运行关系，我们设置btn和number的同步关系
  //如果有var pok2=new Pocket("#cont2"...),那么btn还可以同步到另外一个pocket实例里面的状态，使用this.btn.bind("begin","someDom.someStatus",pok2),pok2表示同步状态的环境，不写为当前pok当次渲染的环境
  pok.setCallback(function(){this.btn.bind("begin","number.add");});
  pok.beforeMount({
    btn:function(btn){
      var ts=this;
      var attrs=ts.attrs;//attrs是后面render相关模版时，临时传入的数据，可以不用
      var data={items:[],step:0};
      btn.on("click",function(){
      ts.btn.sync().updateState("begin",function(cb,run,lastData,store){//lastData为上一个步骤传过来的数据，这里是第一个步骤，所以为空
        //store为相关dom绑定的数据，比如<button ?REFbtn?>?name:保存?</button>中的变量信息
        //这里store为[{attr:"name",value:"保存",type:"contentText",domItem:0}],
        //domItem可能有，比如多个dom用了相同的REF，这里表示为第几个dom对应的数据,具体参考后面的模版-变量说明
        //store会存储初始模版中的数据，前提条件是要在最后用&，才会把数据保存
        run(data);//触发下面update方法里面的回调，data对应回调里面的opt.value
        data.step=1;
        setTimeout(function () {
          cb(data);
        }, 1000);
      })
      .updateState("process",function(cb,run,lastData,store){
        run(lastData);
        lastData.step=2;
        cb(lastData);
      })
      
    })},//处理关于btn dom的内容，同时也传入content dom，dom都是jq类型
    content:function(content,btn){//处理content为主题的相关内容
      content.on("click",function(){
        btn.toggle();
      });
    }
  });
  pok.afterMount({})//和beforeMount类似，处理，设置相关元素挂载在页面上以后的运行
  pok.update({
    btn:{begin:function(opt,cb){
      var current=opt.current;//当前元素
      var trigger=opt.trigger;//从哪个元素触发同步来，这里没有被谁触发来，为空
      var value=opt.value;//前面run里面传输的数据
      var message=opt.message;//与前面updateState里面的store同等
      setTimeout(function() {cb(value.items)}, 10);
    },
    process:function(){...}
  },
  number:function(opt,cb){
      var current=opt.current;//当前元素
      var trigger=opt.trigger;//从哪个元素触发同步来,如果是点击btn后同步触发的，这里trigger为btn这个jq对象
      var value=opt.value;//如果是btn触发同步过来的为上面btn.begin里面cb传输的value.items;
      cb();//同样还可以传输给其他的状态。
  }
  });


//具体渲染,useData里面的数据通过cb可以同步或者异步传入到render里面
pok.useData(function(cb) {setTimeout(function() {cb({name:"保存",number:0}); }, 1000) }).render({insert:"append"}).setCallback(function(){//this...});
//this等同于前面setCallback，beforeMount等等里面的this
//render的参数都可选，这里的insert:append表示为向下追加，默认为全部替换
</script>
```

##根据使用的api

####生成一个实例
```js 
//第一个参数为目标容器的id，第二个参数为模版的url地址，参数可选
//可以使用pok.setTemplate("templates/tmp.html") setTemplate第二个参数可以为"jsonp",表示请求为jsonp ,或者是pok.setHtml("<div>exp</div>")直接指定html，
//可以使用pok.setContainer("#content")指定容器
var pok = new Pocket("#content","templates/tmp.html");
```

#### 预先设置视图生成的相关周期
```js 
//假设已经设置了模版 <button ?REFbtn?>button</button><div ?REFcont?>?user.msg|upper,format?</div>
//通过REF指定相关dom然后传入运行周期
//对btn进行处理，function(button,cont) ->第一个参数表示btn元素，参数名字任意。第二个用具体名字cont指向了REFcont这个div元素
//button,cont都是jq对象
pok.beforeMount({//表示渲染的视图插入#content元素之前
    btn:function(button,cont){
        // this代表渲染后生成的更新对象集合updateOb，this.btn表示一个更新对象，this.btn.sync().updateState(..)，或者this.btn.collect().updateState(..)等
        。。
    }
});
//表示渲染的视图插入#content元素之后
pok.afterMount({
    btn:function(btn){}
});

```

#### 更新对象
```js 
//表现为前面周期中的this
//updateOb.btn  update.content 分别对应前面模版中的REFbtn,REFcontent所生成的更新对象，
updateOb.btn.updateState("begin",val);//第一个begin为状态，这里的val应该为字符串，对象等，如果为函数不会执行，只做值传输
updateOb.sync()
.updateState("begin",fun)
.updateState("begin",fun);
//这里fun为(cb,run,lastData,store)=>  ,cb是一个函数cb(someData)表示传输数据到下一个updateState中，
//run(someData),表示运行相关begin状态在前面update中对应的回调
//lastData,比如第二个updateState的lastData来自第一个updateState中的cb(someData)
updateOb
.collect(function(data){//data,为后面所有updateState里面cb(someData)数据的集合，表示所有异步过程全部完成后的回调})
.updateState("begin",fun)
.updateState("begin",fun);
//collect和sync类似，只是collect会让updateState中的内容先同时运行
//如果里面有异步，那么等待所有的异步完成后会运行collect()方法里面的回调
```

#### update预设
```js  
//设置相关dom对应状态的回调
 pok.update({
    btn:{begin:function(opt,cb){
      var current=opt.current;//当前元素
      var trigger=opt.trigger;//从哪个元素触发同步来，这里没有被谁触发来，为空
      var value=opt.value;//前面run里面传输的数据
      var message=opt.message;//与前面updateState里面的store同等
      setTimeout(function() {cb(value.items)}, 10);
    },
    process:function(){...}
  },
  number:function(opt,cb){
      var current=opt.current;//当前元素
      var trigger=opt.trigger;//从哪个元素触发同步来,如果是点击btn后同步触发的，这里trigger为btn这个jq对象
      var value=opt.value;//如果是btn触发同步过来的为上面btn.begin里面cb传输的value.items;
      cb();//同样还可以传输给其他的状态。
  }
  });
```


#### 传入数据并渲染
```js 
//使用数据并且渲染视图,useData中运行cb会把数据传给render
//render可以使用可选参数，render({attrs:{somemsg:...},insert:"append/prepend",jsonp:false})  
//attrs表示临时传入的数据,insert可以为append或者prepend表示视图插入前面还是后面
//url参数会覆盖election对象设置的templateurl。template属性可以直接指定<div>xx</div>，覆盖前面使用setHtml的内容。
var electme=election.useData(function(cb){$.ajax({url:"info/vote",dataType:"json"}).done(function(data){cb(data);});}).render();
```


## 模版相关

#### 设置过滤器 
```js 
//给所有的模版设置过滤器
Pocket.setFilter({
toPx:function(variableValue,item,length){
//variableValue 是？？解析出来的值，如果是?wd,hg?多变量的，为一个数组包括所有
//如果在for循环中，item表示当前是循环中的第几个，length表示循环的总长度
return ....//返回想显示的内容
}
});


//ps:如果使用过滤器去处理对象，比如?data|handle? 
//handle(val,item,length){val.push({a:1})}如果直接操作对象和数组，
//那么在其他地方使用?data|handle?也会得到拥有{a:1}的数据，如果不想同步影响.
//在handle(val,item,length){val=copy(val);//用一个复制函数拷贝一份}
```



#### 变量

```js 
//如果数据没有值，则用默认值200代替
?width:200|toPx?
//可以使用多个变量，然后这些变量会合并为一个数组比如[200,100...]分别传入过滤器 toPx，toScale中。
?width:200,height:100,left:20,top:20|toPx,toScale?

//使用for循环{{for da in ?data?}}
//可以直接使用固定数据 {{for da in [1,2,3]}}或者是 {{for....{"a":123,..}}}
//如果data数据是对象，那么da等同{attr:"a",value:123},,然后遍历
{{for da in ?data?}}//对象类型
?da.attr?
?da.value?
{{/for}}
{{for da in ?data?}}//数组类型
?da?
{{/for}}

// 使用if条件
//if 支持 <,>,>=,<=,==,!= 

{{if ?width? > ?smallWidth?}}
    {{if ?wd? > 5}}
    .......
    {{/if}}
{{/if}}

//如果使用?width&? 使用了&会把相关数据存起来作为前面提到的store和message
//存储规则

内容
<div ?REFheader?>?cont&?</div>
为{value:"new cont",attr:"cont",type:"contentText"};

class

<div class="?ani&? header" ?REFheader?></div>
为{value:"fade",attr:"ani",type:"class",classItem:0}//0为第1个class

style 

<div style="width:?wd&?;background:red" ?REFheader?></div>
为{value:"100",attr:"wd",type:"style",style:"width"};

input 
 
<input type="text"  ?REFput? value="?val&?"/>
为{attr:"val",ref:"put",type:"formValue"};

自定义数据 

//pocket-data属性会在dom渲染的时候自动删除,只是作为一个数据参考点
<div pocket-data="?data&?" ?REFheader?></div>
为{attr:"data",ref:"header",type:"pocketData"});

```


#### 通过scope形成子组件
```js 
//使用scope,  pic.js 将会使用数据 ?data.content.pic?,并赋予给pic
//?data.content.pic? 为 {x:66,y:2},在ele/pic.html中,能使用 ?pic.x? 得到66
//?data.content.pic? 为 6 ,在ele/pic.html中,能使用?pic? 得到6
//跟变量等同也可以使用过滤?data.content.pic|picHandle?
{{scope pic as ?data.content.pic?}}
@include(ele/pic.html)
{{/scope}}

//在ele/pic.html 
<div>?pic.x?</div>
<div>?pic.y?</div>
```

#### @include
```js 
//载入其他位置的html，使用相对于当前文件的url
//可以使用'@include(ele/pic.html)'，单引号有无都可
@include(ele/pic.html);
```

## 代码打包方式

>使用gulp-jspool打包代码,npm install gulp-jspool,[gulp-jspool](https://www.npmjs.com/package/gulp-jspool) 

源码文件 index.js+js   目标文件dest

## 备注与更新
* 支持amd require，输出名字为pocket















