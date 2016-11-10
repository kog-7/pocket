# Pocket

Pocket 是轻量的javascript视图层框架

* **简单便捷** : Pocket使用起来简单。预先设置视图生命周期处理函数，在templates文件夹里面设置模版，根据情况渲染和更新视图。
* **异步化** : 数据获取和功能运行，支持异步的写法和处理。
* **组件支持** : 使用文件模式来组合组件，方便移植和接入其他框架。
* **使用场景** : 适用于中小型项目，大项目中某部分视图，广告和第三方视图内容的获取，基于jquery操作ajax，操作dom内容
* **小体积** : 60.1k,压缩后只有18.3k

![](http://pocketjs.oss-cn-hongkong.aliyuncs.com/pocketjs.gif)

## 例子
###### templates/election.html ... templates/sub/status.html ... templates/sub/other.html
```html 
//election.html
<div ?REFelection?>
<input type="text" name="exp"  ?REFput? value="?:default name@name?"/>
<button ?REFbtn?>?city.guangzhou@name?<span ?REFbtnItem?>?click?</span></button>
<p ?REFvote?>?city.shanghai@name|upper?</p>
<button ?REFtoggle?>toggle</button>
{{scope info as ?message?}} @include(sub/status.html) {{/scope}}
</div>

//status.html 
<div ?REFstatus?>?info.age?</div>
@include(other.html)
```

###### index.html
```js 
<div id="content"></div>
<script type="text/javascript" src="http://cdn.bootcss.com/jquery/3.1.1/jquery.min.js"></script>
<script src="http://pocketjs.oss-cn-hongkong.aliyuncs.com/pocket.min.js"></script>
<script>
var election = new Pocket("templates/election.html","#content");//生成一个新的视图模型实例
election.beforeMount({
    put: function(put, toggle) {var ts=this;var time=ts.attrs.time;
        //绑定jq对象dom的事件，输入相关内容后同步更新其他dom的内容
        toggle.on("click",function(){put.toggleFade(time);});
        put.on("keyup",function(){ts.update({ref:"put",attr:"name",sync:true});})},
    btn:function(btn){var ts=this,item=0;
        btn.on("click",function(){item+=1;ts.update({ref:"btnItem",attr:"click",value:item})})}
});
election.afterMount({
    status: function(dom) {//....}
});
election.beforeUpdata({
    "vote?city.shanghai": function(opt, cb) {
        var val = opt.value, trigger = opt.trigger, current = opt.current;
        //....some process
        setTimeout(function() {cb(val+"like ajax async get data")}, 2000);
    },//当更新当前元素的相关位置时，异步处理数据后再插入
    "btnItem?click":function(opt,cb){cb(opt.value+" number");}
});
//返回操作具体渲染元素的实例

var newEle=election.useData(function(cb){
    cb({city:{shanghai:"li",guangzhou:"liu"},click:0,message:{age:100}});//可以ajax请求成功后cb(data)
    })
    .render({insert:"append",attrs:{time:2000}})//追加dom的模式
    .setCallback(function(){console.log("render over")});

setTimeout(function() {newEle.remove("status");}, 6000);
</script>
```

## 定义并操作视图


#### 例子 templates/election.html ... templates/ele/smallSize.html ...  templates/ele/bigSize.html  ... templates/ele/img/put.html 
```js 
//templates/election.html
<h2>?title|upper?</h2>
{{for ele in ?elements?}}
    {{for tps in ["image","text"]}}
        <div>tps</div>
    {{/for}}
        {{if ?ele.width? < 200}}
            {{scope smallSize as ?ele?}}
            @include(ele/smallSize.html);
            {{/scope}}
        {{/if}}
        {{if ?ele.width? > 1000}}
            {{scope bigSize as ?ele?}}
            @include(ele/bigSize.html)
            {{/scope}}
        {{/if}}
{{/for}}

//templates/ele/smallSize.html  
<div>?smallSize.width?</div>
....
@include(img/put.html);
....
//同样类似bigSize.html  等等



```

#### 定义一个视图

```js 
//第一个参数为模版的url地址，第二个参数为目标容器的id，参数可选
//可以使用election.setTemplate("templates/election.html") setTemplate第二个参数可以为"jsonp",表示请求为jsonp ,或者是election.setHtml("<div>exp</div>")直接指定html，
//可以使用election.setContainer("#content")指定容器
var election = new Pocket("templates/election.html","#content");
```

#### 预先设置视图生成的相关周期
```js 
//假设已经设置了模版 <button ?REFbtn?>button</button><div ?REFcont?>?user.msg|upper,format?</div>
//通过REF指定相关dom然后传入运行周期
//对btn进行处理，function(button,cont) ->第一个参数表示btn元素，参数名字任意。第二个用具体名字cont指向了REFcont这个div元素
//button,cont都是jq对象
election.beforeMount({//表示渲染的视图插入#content元素之前
    btn:function(button,cont){
        // this代表渲染后生成的渲染对象，可以使用this.update(....)来更新相关dom
        var attrs=this.attrs;//attrs是在渲染视图后传入的attrs数据
        button.on("click",function(){cont.html()...})
    }
});
//表示渲染的视图插入#content元素之后
election.afterMount({
    btn:function(btn){}
});

```

#### 预先设置视图更新和删除的相关周期
```js
//假设已经设置了模版 <input ?REFnumber? value=?data.item@no?><div>content<span ?REFsn?>?data.item@no?</span></div>
//使用@联合ref名字和变量名字（需要使用"包住）
//每一次用update({ref:"number",attr:"data.item",sync:true,value:"abcdef"}); 
//sync为true表示同步，number更新后sn-span也会同步更新
//value表示要更改的内容，如果没有value属性，在input中，为input输入的内容
election.beforeUpdate({
    "number@data.item":function(opt,cb){
        var val=opt.value;//这里表示input输入的value值 
        var trigger=opt.trigger;//这里表示是哪个dom触发了number的更新。如果直接给number,data.item update，trigger为undefined
        var current=opt.current;//表示当前元素
        var lastValue=opt.lastValue;//表示上一次的数据
        cb(val+" ..example");
    },
    "sn@data.item":function(opt,cb){
        var val=opt.value,trigger=opt.trigger;//如果是number触发，这里为number jq dom元素
        var current=opt.current;//为sn元素
        setTimeout(function() {//异步更新
            cb(val+" ...example");
        }, 3000);
    }
});
election.beforeRemove({
    number:function(dom,cb){
        //dom表示number这个jq 对象
        dom.fadeOut("slow",function(){
            cb();//执行cb才会真正的删除对象
        });
    }
})

```


#### 设置过滤器 
```js 
//给所有的模版设置过滤器，暂时没有做每个视图单独设置过滤器
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


#### 传入数据并渲染
```js 
//使用数据并且渲染视图,useData中运行cb会把数据传给render
//render可以使用可选参数，render({attrs:{somemsg:...},insert:"append",jsonp:false,url:"/templates/ele.html",record:true})  
//attrs表示临时传入的数据,insert可以为append或者prepend表示视图插入前面还是后面,jsonp为true的话表示请求类型为jsonp，
//url参数会覆盖election对象设置的templateurl。template属性可以直接指定<div>xx</div>，用了相关属性会忽略url参数。
//data属性，如果没有使用useData，可以直接在render里面指定data。record属性为true表示渲染后的视图有更新功能，默认为true,设置为false则后续的视图不能update，remove。
var electme=election.useData(function(cb){$.ajax({url:"info/vote",dataType:"json"}).done(function(data){cb(data);});}).render();
```

#### 更新规则与执行更新

```js
 <input ?REFnumber? value=?data.item@no?><div>content<span ?REFsn?>?data.item@no?</span></div>
 //可以在beforeMount和beforeMount中使用this.update(..)来更新
 //其中ref表示引用的ref值，attr表示更新哪块内容，sync表示当前元素更新时候，是否有其他元素同步跟新，同步更新的元素通过?...@no?来决定。
 //可以使用?data.item@no,age? 表示多个同步。
 
 //在使用input 更新的时候，electme.update({ref:"number",attr:"data.item",sync:true})不用value属性将会使用input的输入值
 electme.update({ref:"number",attr:"data.item",sync:true,value:"exp"});//更新当前render出来的视图
//如果使用election.updateAll({ref:"number",attr:"data.item",sync:true,value:"exp"});那么所有render出来的视图都会被更新
//如果使用?@no? 这种初始没有属性的变量内容，在update中用__default代替，比如electme.update({ref:"number",attr:"__default",sync:true,value:"exp"});

```

#### 支持的更新类型 
* 内容更新 
```js  
<div ?REFheader?>?cont@val?</div>
electme.update({value:"new cont",attr:"cont",ref:"header"});
```
* class更新
```js 
<div class="?ani? header" ?REFheader?></div>
electme.update({value:"fade",attr:"ani",ref:header})
```
* style更新 
```js 
<div style="width:?wd?;background:red" ?REFheader?></div>
electme.update({value:"100",attr:"wd",ref:header});
```
* input更新 
```js  
<input type="text"  ?REFput? value="?val@val?"/>
electme.update({attr:"val",ref:"put",sync:true});
```
* textarea更新
```js 
<textarea ?REFtext?>?val@val?</textarea>
electme.update({attr:"val",ref:"text",sync:true});
```
* 自定义数据更新 
```js  
//pocket-data属性会在dom渲染的时候自动删除,只是作为一个数据参考点
<div pocket-data="?data@val?" ?REFheader?></div>
electme.update({attr:"data",ref:"header",sync:true});
```



#### 更新实现方式
* 在每次渲染后会根据ref，attr存储少量字符串信息组成对象，然后在使用update后对比对象信息，进行更新。

#### 删除
```js 
//如果设置了beforeRemove({number:function(){...}})，会先运行相关函数，然后再删除dom
electme.remove("number");
//render的所有number对象被删除
election.removeAll("number");
```

#### 视图实例与具体渲染实例的绑定
```js 
electme.noBind();//解除election对electme的绑定，election.updateAll(..)不会影响到electme

election.clear();//清除在视图实例上的所有绑定

```



## 编写组件模版


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

```
#### 通过scope形成子组件
```js 
//使用scope,  pic.js 将会使用数据 ?data.content.pic?,并赋予给pic
//?data.content.pic? 为 {x:66,y:2},在ele/pic.html中,能使用 ?pic.x? 得到66
//?data.content.pic? 为 6 ,在ele/pic.html中,能使用?pic? 得到6
//跟变量等同也可以使用过滤?data.content.pic|picHandle?
{{scope pic as ?data.content.pic?}}
'@include(ele/pic.html)'
{{/scope}}

//在ele/pic.html 
<div>?pic.x?</div>
<div>?pic.y?</div>
```

#### 同步更新元素设置
```js 
//在得到相关数据后，如果更新item值并且设置为同步更新，那么div的内容会变化
//如果在更新input并设置模式为同步，div和span的content值也会变化
<div ?REFnumber?>?:0@item,age?</div>
<button ?REFpraise?>?praise@item?</button>
<input type="text" ?REFageInput?  ?age@age? />
age is:<span ?REFdes?>?age@age?</span>
```


#### @include
```js 
//载入其他位置的html，使用相对于当前文件的url
@include(ele/pic.html);
```

## 代码打包方式

>使用gulp-jspool打包代码,npm install gulp-jspool,[gulp-jspool](https://www.npmjs.com/package/gulp-jspool) 

源码文件 index.js+js   目标文件dest

## 备注与更新
* 支持amd require，输出名字为pocket

