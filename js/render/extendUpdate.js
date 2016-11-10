'@include(utils/equalstyle.js)'
var extendUpdate={
  _syncData: function (alias, identity, value, triggerDom) {
        var ts = this;
        var syncData = ts.syncData;
        var kw = this.keyword;
        var aliasArr = syncData[alias];
        if (!aliasArr) { //如果没有取到，清空
            return;
        }
    
        aliasArr.forEach(function (iob, ind) {
            var iden = iob.identity;
            if (iden !== identity) {
                ts._runAna(iob, value, $('[data-' + kw + '=' + iob.domId + ']'), null, null, triggerDom);
            }
        });
    },
    _updateCb: function (obj,refDom,sync) {
        var ts = this;

        return function (val) {

            var alias = obj.alias;
            var identity = obj.identity;
            var type=obj.type;
          // console.log(formValue)
            if (type === "textContent") { //后面要判断是否为可以编辑的dom
                if (hasData(val)) { //如果值不为空
                    var textDom = getTextEle(refDom[0],val);
                    // console.log(123)
                    // textDom.nodeValue = val;
                    obj.value = val; //覆盖旧的值
                }
            } else if (type === "class") {
                if (hasData(val)) {
                    var cla = getAllClass(refDom.attr("class"));
                    var lg = cla.length;
                    var classItem = obj.classItem;
                    var aimClass = cla[classItem];
                    if (aimClass !== val) { //在不想等的情况下才会重新复制
                        refDom.removeClass(aimClass).addClass(val);
                        obj.classItem = lg - 1; //换到最后一个。
                        obj.value = val;
                    }
                }
              
            } else if (type === "style") {
                if (hasData(val)) {
                    var style = obj.style;
                    var nowSvalue = refDom.css(style);
                    if (!equalstyle(style, nowSvalue, val)) { //这里的判断以后要更加的细致。10和10px是一样的。
                        refDom.css(style, val);
                        obj.value = val;
                    }
                }
            } else if (type === "formValue") {
                //不会再反射到dom的value上面了，因为是根据东西来的，除非值不一样。
                var fvalue = refDom.val();
                if (hasData(val) && val.toString() !== fvalue.toString()) { //两次值不等的情况下
                    refDom.val(val);
                    obj.value = val;
                } else {
                    obj.value = fvalue;
                } 
            }
            else if(type==="pocketData"){
              if(obj.value!==val){
              obj.value=val;
            }
            }
            if (sync === true && alias) {
              if(alias.indexOf(",")===-1){
                ts._syncData(alias, identity, obj.value, refDom); //只有表单才是只传入value值
              }
              else{
                alias=alias.split(",");
                alias.forEach(function(al){
                  ts._syncData(al, identity, obj.value, refDom);
                })
              }
            }
        }
    },
    _runAna: function (obj, val, refDom, sync, beforeUpdate, triggerDom) { //无trigger表示当前的发生
        var ts = this;
        var oldValue = obj.value; //旧的值
        var domItem = obj.domItem; //ref为集合的时候，取到具体一个
        var attr = obj.attr;
        if (typeof domItem === "number") {
            refDom = refDom.eq(domItem);
        } //取得具体dom
        var obBeforeUpdate = ts._beforeUpdate;
        
        if (typeof beforeUpdate !== "function"&&typeof obBeforeUpdate==="object") {
            beforeUpdate = obBeforeUpdate[obj.ref+"?"+attr];
        }
        //得到回调的update的运行对象
        var runObj = {
            lastValue: oldValue,
            value: val,
            trigger: triggerDom,
            current: refDom
        };
        
        // console.log(obj)
        if (typeof beforeUpdate === "function") {
            beforeUpdate.call(ts,runObj, ts._updateCb(obj,refDom,sync)); //可以为异步请求，
        } else {
            ts._updateCb(obj,refDom,sync)(val);
        }
    },
    _update: function (ref, attr, value, sync, beforeUpdate) {
        var ts = this;

        var syncData = ts.syncData,
            updateObject = ts.updateObject;
        if (!syncData) {
            return false;
        }
        
        var infoDom = updateObject[ref];

        
        if (!infoDom) {
            return false;
        }
        var kw = ts.keyword;
        var id = infoDom._pocket_id;

        var refDom = $('[data-' + kw + '=' + id + ']');
        if(refDom.length===0){
          ts._removeRefInfo(ref);
          return false;
        }
        // console.warn(refDom);

        infoDom.forEach(function (ob, ind) {//满足的统一处理
            if (ob.attr === attr) { //如果属性为attr，减少运行次数
                ts._runAna(ob, value, refDom, sync, beforeUpdate);
            }
        })
    }
}