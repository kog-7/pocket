var runMountFun = function (amount, outDom,ts) {
    var afunAttr = null,
        afun = null,
        afargs = null;
    if(!amount){return false;}
    for (afunAttr in amount) {
        if (afunAttr in outDom) {
            afun = amount[afunAttr];
            afargs = getParaName(afun);
            afargs.forEach(function (arg, ind) {
                if (ind === 0) {
                    afargs[ind] = outDom[afunAttr];
                } else {
                    if (arg in outDom) {
                        afargs[ind] = outDom[arg];
                    } else {
                        afargs[ind] = null;
                    }
                }
            });
            afun.apply(ts, afargs);
        }
    }

}


'@include(utils/tagAna.JS)'

var extendDom = {
    _handleDom: function (htmlOb) {

        var htmlStr = htmlOb.html;
        var htmlCopy = htmlOb.copyHtml;
        var ts = this;
        var refOb = ts.refOb;
        // var mode=ts.mode;
        
        var dom = $(htmlStr);
        var root = $("<div></div>");
        root.append(dom);
        var copyDom = $(htmlCopy);
        
        var nd = null;
        var attr = null,
            val = null;
            //挂载函数集合
        var bmount = ts._beforeMount,
            amount = ts._afterMount;
        var record = ts.record; //是否记录；
        var kw = ts.keyword;
        var outDom = {};
        // var outRecord={};
        var aim = ts.aim,
            insertType = ts.insertType;

        for (attr in refOb) { //attr 代表名字
            if (refOb.hasOwnProperty(attr)) {
                val = refOb[attr];
                // 这个地方做的是,每个dom的统一指向，后面是具体指向
                nd = root.find('[data-xjref=' + attr + ']');
                //移除特质属性
                if(nd[0].hasAttribute("pocket-data")){nd.removeAttr("pocket-data");}
                outDom[attr] = nd;
                nd.removeAttr("data-xjref");
                nd.attr("data-"+kw, val);
            }
        }
        if (typeof aim === "string") {
            aim = $(aim);
        }
        
        if (bmount) {
            runMountFun(bmount, outDom,ts);
        }

        //在挂载前运行，callback
        var cback=ts.callback;
        var tpBack=typeof cback;
        if(tpBack==="function"){
          cback(dom);//这里一次性可以拿到所有渲染的dom，而update只能根据ref来。
        }
        else if(tpBack==="object"&&typeof cback.beforeMount==="function"){
          cback.beforeMount(dom);
        }
        delete ts.callback;

        if (insertType === "append") {
            aim.append(dom);
        } else if (insertType === "prepend") {
            aim.prepend(dom);
        } else {
            aim.html("").append(dom);
        }

        if (amount) { //先重复写，不用函数，以后和bmount有可能不一样
            runMountFun(amount, outDom,ts);
        }
        
        
        if (record === true) { //需要update情况下
            var copyRoot = $("<div></div>");
            copyRoot.append(copyDom);
            var signStore = ts.signStore,
                keySign = ts.keySign,
                updateObject = {},
                syncData={};//做同步内容使用
            for (attr in refOb) { //这里重复是不影响视图挂载。
                if (refOb.hasOwnProperty(attr)) {
                    val = refOb[attr];
                    updateObject[attr]=val;
                    var copyNd = copyRoot.find('[data-xjref=' + attr + ']');
                    //对每个元素进行分析。
                    tagAna(attr, copyNd, signStore,keySign,val,updateObject,syncData);
                }
            }

            ts.updateObject = updateObject;
            ts.syncData=syncData;
            var pockTs=Object.getPrototypeOf(ts);
            var expArr=pockTs._exps;
            if(!("_exps" in pockTs)){
              expArr=pockTs._exps=[];
            }
            //插入单个实例
            expArr.push(ts);
  
        }
        
        
        if(tpBack==="object"&&typeof cback.afterMount==="function"){
          cback.afterMount(dom);
        }


    
        ts.loaded = true;
        
        delete ts.storeExp;
        delete ts.refOb;
        delete ts.insertType;
        delete ts.aim;
        delete ts.record;
        delete ts.signStore;
        delete ts.signItem;
        delete ts.aliasArray;
        delete ts.storeExpItem;
        
        var tast=ts.loadTast;
        if(tast&&tast.length>0){
          tast.forEach(function(sk,ind){
            // ts._update(sk.ref,sk.attr,sk.value,sk.sync);
            ts._update.apply(ts,sk);
          });
        }
        
        var removeTask=ts.removeTask;
        if(removeTask&&removeTask.length>0){
          removeTask.forEach(function(sk,ind){
            ts.remove(sk);
          });
        }
        
        delete ts.loadTast;
        delete ts.removeTask;
    }

};