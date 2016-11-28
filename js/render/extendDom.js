var runMountFun = function (amount, outDom, ts) {
    var afunAttr = null,
        afun = null,
        afargs = null;
    if (!amount) {
        return false;
    }
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

'@include(./utils/tagAna.js)'

var extendDom = {
    _handleDom: function (htmlOb) {
        var htmlStr = htmlOb.html;
        var htmlCopy = htmlOb.copyHtml;
        var ts = this;
        var refOb = ts.refOb;
        var dom = $(htmlStr);
        var root = $("<div></div>");
        root.append(dom);
        var copyDom = $(htmlCopy);
        var nd = null;
        var ref = null,
            domId = null;
        //挂载函数集合
        var bmount = ts._beforeMount,
            amount = ts._afterMount;
        var attrs = ts.attrs;
        var updateOb = ts.updateOb; //得到最后返回的实例
        var kw = ts.keyword;
        var outDom = {};
        var aim = ts.aim,
            insertType = ts.insertType;
        var copyRoot = $("<div></div>");
        copyRoot.append(copyDom);
        //拿到匹配的数据
        var signStore = ts.signStore,
            keySign = ts.keySign; //keysign为# ..    ..#的标识符
        var updateObject = {};
      
        for (ref in refOb) { //ref 代表名字
            if (refOb.hasOwnProperty(ref)) {
                domId = refOb[ref];
                // 这个地方做的是,每个dom的统一指向，后面是具体指向
                nd = root.find('[data-xjref=' + ref + ']');
                copyNd = copyRoot.find('[data-xjref=' + ref + ']');
                //移除特质属性
                if (nd[0].hasAttribute("pocket-data")) {
                    nd.removeAttr("pocket-data");
                }
                outDom[ref] = nd;
                nd.removeAttr("data-xjref");
                //正式绑定关键字id
                nd[0].setAttribute("data-" + kw, domId);
                tagAna(updateObject, ref, copyNd, signStore, keySign, domId);
            }
        }

        updateOb.init(updateObject, attrs, refOb, ts._update); //传入更新的对象。
        if (typeof aim === "string") {
            aim = $(aim);
        }
        
        if(typeof ts.mountCallback==="function"){
          ts.mountCallback.call(updateOb);
        }
        
        if (bmount) {
            runMountFun(bmount, outDom,updateOb);
        }
        if (insertType === "append") {
            aim.append(dom);
        } else if (insertType === "prepend") {
            aim.prepend(dom);
        } else {
            aim.html("").append(dom);
        }

        if (amount) { //先重复写，不用函数，以后和bmount有可能不一样
            runMountFun(amount, outDom, updateOb);
        }
        
    
        

        // delete updateOb.loadTast;

        updateOb.loaded = true;
        
        delete ts.updateOb;
//只是临时生成，然后就会消失，不用delete
        // delete ts.storeExp;
        // delete ts.refOb;
        // delete ts.insertType;
        // delete ts.aim;
        // delete ts.signStore;
        // delete ts.signItem;
        // delete ts.aliasArray;
        // delete ts.storeExpItem;
        // delete ts.updateOb;
    }

};