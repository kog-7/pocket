var clear = function () {
    this._runFuns = [];
    this._args = [];
    this.break = true;
}
var get = function (fun) {
    var runFuns = this._runFuns;
    runFuns.push(fun);
    return this;
};
var endCallback = function (fun) {
    if (typeof fun !== "function") {
        return false;
    }
    this._endFun = fun;
};

var setLength = function (lg) {
    if (typeof lg !== "number") {
        return false;
    }
    this.length = lg;
};

var cycle = function (outNo, length, defStart) {
    if (!defStart) {
        defStart = 0;
    }
    // var outNo=startNo+addNo;
    var mod,
        divide;
    var cut;
    var outLength = length + defStart - 1;
    if (outNo > outLength) {
        cut = outNo - outLength; //得到差值
        mod = cut % length; //得到余数
        if (mod === 0) {
            outNo = outLength; //如果参数都是周期则。。
        } else {
            outNo = defStart - 1 + mod; //多加初始值，要减去一的
        }
    } else if (outNo < defStart) { //小于开始的默认值
        cut = defStart - outNo; //差值
        mod = cut % length;
        if (mod === 0) {
            outNo = 0;
        } else {
            outNo = outLength + 1 - mod; //由于0到length也有一个长度所以要+
        }
    }
    return outNo;
};;
var setArg = function (opt) { //逻辑为如果有item，则给固定的item对应设置函数，
    //否则给全部的args的数量来绑定arg，如果为insert为append，则追加arg到arg后面
    //遍历的数量，要么数量确定，要么，根据funs的长度来
    //opt:{item:0,arg:[xx],insert:append}
    //即使全部一样设置，也能做到特殊性
    var item = opt.item,
        arg = opt.arg, //arg为数组
        insert = opt.insert;
    var args = this._args;
    var runfuns = this._runFuns;
    //判断长度，如果没有取runfuns的长度
    var lg = this.length;
    if (!lg) {
        lg = runfuns.length;
    }

    if (typeof item === "number") {
        if (!args[item]) {
            args[item] = [];
        }
        if (insert === "append") { //append表示插入
            args[item] = args[item].concat(arg);
        } else {
            args[item] = arg;
        }
    } else { //全部覆盖的
        var i = 0;
        for (; i < lg; i += 1) {
            //取到某个arg
            var targ = args[i];
            if (!targ) { //没有的话初始化为数组
                args[i] = [];
            }
            if (insert === "append") { //添加
                args[i] = args[i].concat(arg);
            } else { //覆盖
                args[i] = arg;
            }
        }
    }
}

var Sync = (function () {
    var go = function (startNo) { //里面传入参数,这个arg要为数组。而后面next的内容可以随便
        var runFuns = this._runFuns;
        // if(!runFuns){return false;}
        var lg = this.length;
        if (!lg) {
            lg = runFuns.length;
        }

        var nowFocus = 0;
        //新生成一个对象
        var f = function () {};
        f.prototype = this;
        var nowThis = new f();

        nowThis.focus = nowFocus; //开始焦点
        nowThis.collectData = [];
        nowThis.break = false; //设置终端
        nowThis.length = lg; //设置长度
        nowThis._args = [].concat(nowThis._args);

        setTimeout(function () {
            var args = nowThis._args;
            var nowFocus = nowThis.focus;
            var fun = runFuns[nowFocus];
            var arg = args[nowFocus];
              nowThis.focus += 1;
            fun.call(nowThis, {setup: arg});
          
        }, 0);

        return nowThis;
    };

    //除了第一个函数是按setup传入，其他的都是{setup:,flow:}来传入
    var next = function () { //传入的参数优先级更高，其次才是_arg
        var endFun = this._endFun;
        if (this.break === true) { //如果终端则停止
            if (endFun) {
                endFun(this.collectData);
            }
            return;
        }
        var arg = Array.prototype.slice.call(arguments, 0); //flow参数
        var args = this._args; //setup参数
        var lg = this.length; //运行长度
        var focus = this.focus;
        var runFuns = this._runFuns;
        var funLength = runFuns.length; //函数总长度

        var outFocus = cycle(focus, funLength); //得到循环的具体长度

        var setupArg = args[focus]; //setup参数,只按照focus的走

        var funArg = {
            setup: setupArg,
            flow: arg
        };

        var data = this.collectData;
        data.push(funArg); //收集数据
this.focus += 1; //焦点添加1
        if (focus >= lg) { //如果超过了长度，也就是必须在最后运行函数里面加上next
            this.focus = 0;
            if (endFun) {
                endFun.call(null, data);
            }
        } else { //如果这里继续运行的，会在这里形成，，，等待递归，this.focus必须在前面
            //真正取得的函数

            //如果只有一个，则循环运行，达到长度为止
            //这里如果是同步运行，会在辞典一直运行下去
            runFuns[outFocus].call(this, funArg);
            // (this._runFuns.shift()).apply(this,arg);
        }
        
    }
    Sync = function () {
        this._runFuns = [];
        this._args = [];
        // this.focus = 0;
        // this.break = false; //中断运行
    }

    Sync.prototype = {
        constructor: Sync,
        clear: clear,
        get: get,
        setArg: setArg,
        setCallback: endCallback,
        go: go,
        setLength: setLength,
        next: next
    };

    return Sync;
})();

var Collect = (function () {

    var go = function (startNo) { //里面传入参数,这个arg要为数组。而后面next的内容可以随便
        var runFuns = this._runFuns;
        // if(runFuns.length===0){return false;}
        var lg = this.length;
        if (!lg) {
            lg = runFuns.length;
        }

        var nowFocus = 0;
        //新生成一个对象
        var f = function () {};
        f.prototype = this;
        var nowThis = new f();

        nowThis.focus = nowFocus; //开始焦点
        nowThis.collectData = [];
        nowThis.break = false; //设置终端
        nowThis.length = lg; //设置长度
        nowThis._args = [].concat(nowThis._args);
        //延迟运行
        setTimeout(function () {
            var args = nowThis._args;
            var nowFocus = nowThis.focus;
            var runfuns = nowThis._runFuns;
            var lg = nowThis.length; //有可能回调后再取一次，所以，
            var funLength = runfuns.length;
            var i = 0;
            var fun = null;
            var outFocus;
            var arg = null;
            for (; i < lg; i += 1) {
                outFocus = cycle(i, funLength);
                fun = runfuns[outFocus]; //取得真实的运行函数
                arg = args[i];
                
                fun.call(nowThis,{setup:arg});
            }
        }, 0);
        return nowThis;
    };

    var next = function () { //传入的参数优先级更高，其次才是_arg
        var endFun = this._endFun;
        if (this.break === true) { //如果终端则停止
            if (endFun) {
                endFun(this.collectData);
            }
            return;
        }
        var arg = Array.prototype.slice.call(arguments, 0); //flow参数
        var lg = this.length; //运行长度
        var focus = this.focus;
        var data = this.collectData;
        data.push(arg); //收集数据
        this.focus += 1; //焦点添加1
        
        if (focus >= lg - 1) { //如果超过了长度，也就是必须在最后运行函数里面加上next
            this.focus = 0;
            if (endFun) {
                endFun.call(null, data);
            }
        }
        
    }

    Collect = function () {
        this._runFuns = [];
        this._args = [];
        // this.focus = 0;
        // this.break = false; //中断运行
    }

    Collect.prototype = {
        constructor: Collect,
        clear: clear,
        get: get,
        setArg: setArg,
        setCallback: endCallback,
        go: go,
        setLength: setLength,
        next: next
    }
    return Collect;
})();