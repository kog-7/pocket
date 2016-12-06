'@include(utils/include.js)'
'@include(classUpdate/classUpdate.js)'

var extendRender = {
    setTemplate: function (url, jsonp) {
        if (typeof url === "string") { //暂时不做强判断
            // this.usePrivate("url",url);
            this.url = url;
        }
        if (jsonp === "jsonp") {
            this.jsonp = true;
        }
    },
    setHtml: function (tmp) {
        if (typeof tmp === "string") { //暂时不做强判断
            // this.usePrivate("template",tmp);
            this.template = tmp;
        }
    },
    setContainer: function (sel) {
        if (typeof sel === "string") { //暂时不做强判断
            // this.usePrivate("aim",sel);
            this.aim = sel;
        }
    },
    setCallback:function(fun){
      var ts=this;
      if(typeof fun==="function"){
        ts.mountCallback=fun;
      }
    },
    _sendData: function (lazyData) {
        var ts = this;
        return function (data) {
            if (typeof lazyData === "object" && data) {
                lazyData.data = data;
            } else {
                lazyData = {
                    data: data
                };
            }
            ts.render(lazyData, ts);
        }
    },
    useData: function (fun) {
        var ts = this;
        if (!(typeof fun === "function")) {
            return ts;
        }
        var f = function () {};
        f.prototype = ts;
        var newTs = new f();
        newTs._cbData = true;
        setTimeout(function () {
            var lazyData = newTs.lazyData;
            newTs._cbData = false;
            // newTs.lazyData
            fun(newTs._sendData(lazyData));
            delete newTs.lazyData;
            delete newTs._cbData;
        }, 0);
        return newTs;
    },
    render: function (opt, newTs) {
        var ts = this;
        if (ts._cbData === true) { //只是取值的过程
            ts.lazyData = opt;
            return ts;
        }
        var aim,
            attrs,
            data,
            strhtml,
            url,
            record,
            insert,
            jsonp,
            mode;
        if (opt) {
            aim = opt.aim,
            attrs = opt.attrs; //放入attrs属性
            data = opt.data,
            strhtml = opt.template;
            url = opt.url;
            insert = opt.insert;
            jsonp = opt.jsonp;
            // mode=opt.mode;
        }
        //参数处理,传入和默认的做对比，优先参数传入的，
        strhtml = strhtml
            ? strhtml
            : ts.template;
        url = url
            ? url
            : ts.url;
        aim = aim
            ? aim
            : ts.aim;
        //参数处理结束
        if (!(newTs && ("render" in newTs))) {
            var f = function () {};
            f.prototype = ts;
            newTs = new f();
        }
        newTs.storeExp = {};
        newTs.storeExpItem = 0;
        newTs.refOb = {};
        newTs.insertType = insert; //表示插入模式
        newTs.aim = aim; //新的对象拥有自己的aim属性

        newTs.signItem = 0;
        newTs.signStore = {};
        newTs._exps = null; //防止后此渲染而追加内容
        if (jsonp === undefined) {
            jsonp = ts.jsonp;
        }
        if (attrs !== undefined) {
            newTs.attrs = attrs;
        }

        if (url && url in templateCache) {
            strhtml = templateCache[url];
        }
        var outData = {
            template: strhtml,
            data: data
        };
        setTimeout(function () {
            if (strhtml) {
                newTs._render(outData, null, "render");
            } else {
                anaInclude({
                    url: url,
                    callback: function (ob) {
                        var html = templateCache[url] = ob.html;
                        outData.template = html;
                        newTs._render(outData, null, "render")
                    },
                    jsonp: jsonp
                })
            }
        }, 0);

        //返回的内容
        var updateOb = new Update();
        newTs.updateOb = updateOb;
        //前端大多异步，所以返回是无用的
        // return updateOb;
    }
}
