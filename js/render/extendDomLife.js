

var extendDomLife = {
    beforeMount: function (funOb) {
        if (typeHim(funOb) === "object") {
            if (!this._beforeMount) {
                this._beforeMount = funOb;
            } else {
                coverExtend(this._beforeMount, funOb)
            }
        }
    },
    afterMount: function (funOb) {
        if (typeHim(funOb) === "object") {
            if (!this._afterMount) {
                this._afterMount = funOb;
            } else {
                coverExtend(this._afterMount, funOb)
            }
        }
    },
    beforeUpdate: function (funOb) {
        if (typeHim(funOb) === "object") {
            if (!this._beforeUpdate) {
                this._beforeUpdate = funOb;
            } else {
                coverExtend(this._beforeUpdate, funOb)
            }
        } 
    },
    beforeRemove:function(funOb){
      if (typeHim(funOb) === "object") {
          if (!this._beforeRemove) {
              this._beforeRemove = funOb;
          } else {
              coverExtend(this._beforeRemove, funOb)
          }
      }
    },
    bind:function(newts){//newts要为新对象
      if(newts.loaded!==true){//必须是record并且加载完了的。
        return false;
      }
      var ts=this;
      var _exps=ts._exps;
      if(typeHim(_exps)==="array"){
        _exps.push(newts);
      }
    },
    noBind:function(){//清空这个对象绑定的内容，在父元素也找不到他。
      var ts=this;
      var proto=Object.getPrototypeOf(ts);
      var _exps=proto._exps;
      var ind;
      // delete ts.updateObject,delete ts.syncData;
      if(_exps&&(ind=_exps.indexOf(ts))!==-1){
        _exps.splice(ind,1);
      }
    },
    clear:function(){
      var ts=this;
      var proto=Object.getPrototypeOf(ts);
      var _exps=proto._exps;
      if(proto._exps){
        delete proto._exps;
      }
    },
    _removeRefInfo:function(ref){
      var ts=this;
      var syncData=ts.syncData,updateObject=ts.updateObject;
      var temp=null;
      var keys=[];
      for(var i in syncData){
        keys.push(i);
      }
        var n=keys.length,j=n-1,attr;
      for(;j>=0;j-=1){
        attr=keys[j];
        temp=syncData[attr];
        if(temp.ref===ref){
          delete syncData[attr];
        }
      }
        delete updateObject[ref];
    },
    _afterRemove:function(dom,ref){
      var ts=this;
      return function(){
      ts._removeRefInfo(ref);
        dom.remove();
      }
    },
    removeAll:function(ref,bcallback){
      var ts=this;
      var _exps=ts._exps;
      if(!_exps){return false;}
      _exps.forEach(function(obj,ind){
          obj.remove(ref,bcallback);
      });
    },
    remove: function (ref,bcallback) {
      var ts=this;
      if(!ref){return false;}
      if(ts.loaded!==true){
        var task=ts.removeTask;
        if(!("removeTask" in ts)){
          task=ts.removeTask=[];
        }
        task.push(ref);
      }
      else{
        var updateObject=ts.updateObject;
        var refOb=updateObject[ref];
        if(!refOb){return false;}//找不到返回
        var id,kw=ts.keyword;
        if(typeof refOb==="object"){
          id=refOb._pocket_id;
        }
        else{
          id=refOb;
        }
        var dom=$('[data-' + kw + '=' + id + ']');
        if(dom.length===0){//表示人为删除过这个dom
        ts._removeRefInfo(ref);
        return false;
        }
        var syncData=ts.syncData;
        if(typeof bcallback!=="function"){
          var beforeRemove=ts._beforeRemove;
              if(beforeRemove&&(ref in beforeRemove)){
                bcallback=beforeRemove[ref];
              }
        }
        if(typeof bcallback==="function"){
            bcallback.call(ts,dom,ts._afterRemove(dom,ref));
        }
        else{
            ts._afterRemove(dom,ref)();
        }
      }
    },
    updateAll:function(opt){
      var ts=this;
      var _exps=ts._exps;
      if(!_exps){return false;}
      _exps.forEach(function(obj,ind){
          obj.update(opt);
      });
    },
    update: function (opt) {
        var ts = this;
        var loaded = ts.loaded;
        // var sync=opt.sync;
        var ref = opt.ref,
            value = opt.value,
            sync = opt.sync,
            attr = opt.attr,
            beforeUpdate = opt.beforeUpdate;

        if (loaded !== true) {
            var tast = ts.loadTast;
            if (!ts.loadTast) {
                tast = ts.loadTast = [];
            }
            // tast.push({attr:attr,ref:ref,value:value,sync:sync,beforeUpdate:beforeUpdate});
            tast.push([ref, attr, value, sync, beforeUpdate])
        } else {
            ts._update(ref, attr, value, sync, beforeUpdate);
        }
    }
}