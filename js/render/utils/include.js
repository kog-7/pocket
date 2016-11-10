'@include(./path.js)'

var regAll = function(reg, str, cback) { //还要得到fitler
    var match;
    var temp = null;
    reg.lastIndex = 0;
    var arr = [];
    var ctr = 0;
    var lastIndex = 0;
    var url="";
    //还要得到filter
    while (match = reg.exec(str)) {
        ctr = 1;
        arr.push({
            type: true,
            html: str.slice(lastIndex, match.index)
        });
        url=match[1];
        //把url的空格取消掉，不存在
        url=url.replace(/\s+/g,function(){
            return "";
        });
        arr.push({
            type: false,
            url: url,
            jsFilter: match[3]
        })
        lastIndex = reg.lastIndex;
    }
    if (ctr === 0) {
        return false;
    }
    arr.push({
        type: true,
        html: str.slice(lastIndex)
    });

    reg.lastIndex = 0;
    return arr;
}


var noBlankNoLine=function(str){//消除前后的空格和换行等
    var reg=/^[\n\s\r]+/;
    var reg2=/[\n\s\r]+$/;
    var match=reg.exec(str);
    var match2=reg2.exec(str);
    var lg,lg2;
    if(!match&&!match2){return str;}
    else{
        if(match){
            lg=match[0].length;
        }
        if(match2){
            lg2=match2[0].length;
        }
        if(lg){
            str=str.slice(lg);
        }
        if(lg2){
            str=str.slice(0,-lg2);
        }
        return str;
    }
}


var anaInclude = function(opt) {
    var html = opt.html,
        url = opt.url,
        callback = opt.callback;
      var jsonp=opt.jsonp;
    var includeReg = /\'?\@include\(([\w\.\-\/\s]+)((\|[\w\-]+(\:[\w\-]+)*)*)\)[\;]*\'?/g;
    var oriOb;
    var first = 0;
    //最开始的include是最外层js直接指向这个html，是没有basePath的，后面的才有
    if (html) {
        oriOb = {
            type: false,
            html: html
        };
    } else {
        oriOb = {
            type: false,
            url: url,
            baseUrl: ""
        };
    }

    var htmlArr = [oriOb] //false为没有解析，true为解析了
    var mark = [];

    var f = function(htmlArr, lastOb, cback) { //这里的cback指的是上一个的回调。item表示第几个

        var baseUrl = lastOb.baseUrl;
        var jsFilter;
        var ctr = 0;
        var html = "";
        var match = null;
        var url = null;
        var newBaseUrl = "";
        htmlArr.forEach(function(ob, ind) {
            if (ob.type === false) {
                url = ob.url =path.join(baseUrl,ob.url);
                ob.baseUrl = path.split(url).dirname;
                if (url) {
                    if (mark.indexOf(url) !== -1) {
                        console.warn("模版循环引用");
                        ob.html = "";
                        ob.type = true;
                        return;
                    }
                    if (url in templateCache) { //templateCache，是保存经过render模块渲染出来的最终完整的html整体的存档。
                        var ajaxHtml = templateCache[url];
                        var match = regAll(includeReg, ajaxHtml);

                        if (match) {
                            mark.push(url);
                            f(match, ob, nowCallback);
                        } else {
                            //这里直接判断如果是全部的html没有url的直接给ob绑定，并且运行上一次回调。
                            ob.type = true;
                            ob.html = ajaxHtml;
                            nowCallback();
                        }
                    } else {
                      // console.log(url)
                      var sendOb={url:url};
                      if(jsonp===true){
                        sendOb.dataType="jsonp";
                      }
                        $.ajax(sendOb).done(function(ajaxHtml){
                          
                          ajaxHtml=noBlankNoLine(ajaxHtml);
                          var match = regAll(includeReg, ajaxHtml);
                          if (match) {
                              mark.push(url);
                              f(match, ob, nowCallback);
                          } else {
                              //这里直接判断如果是全部的html没有url的直接给ob绑定，并且运行上一次回调。
                              ob.type = true;
                              ob.html = ajaxHtml;
                              nowCallback(ob.jsFilter);
                          }
                        }).fail(function(){
                            console.log("read " + url + " wrong");
                            callback({
                                html: ""
                            })
                            return;
                        })
                    }
                    ctr = 1;
                } else {

                    match = regAll(includeReg, ob.html);

                    if (match) {
                        f(match, ind, nowCallback);
                        ctr = 1;
                    } else {
                        ob.type = true;
                        html += ob.html;
                    }

                }

            } else {
                html += ob.html;
            }
        });

        if (ctr === 0) {
            //判断上一个ob是否有，如果有的话，就给他的html添加赋予当前的这个值
            if (typeof lastOb === "object") {
                lastOb.type = true;
                lastOb.html = html;
            }
            if (cback === undefined) {
                callback(lastOb);
            } else {
                cback();
            }
        }

        function nowCallback() {
            var ctr = 0;
            var html = "";
            var i = 0,
                n = htmlArr.length;
            for (; i < n; i += 1) {
                if (htmlArr[i].type === false) {
                    return;
                } else {
                    html += htmlArr[i].html;
                }
            }
            lastOb.type = true;
            lastOb.html = html;
            //如果前面没有return的话
            if (cback === undefined) {
                callback(lastOb);
            } else {
                cback();
            }
        };
    };
    f(htmlArr, oriOb)
}



