
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
    update: function (funOb) {//格式为 refa:{action:{"click":function(){}}}
        if (typeHim(funOb) === "object") {
            if (!this._update) {
                this._update = funOb;
            } else {
                coverExtend(this._update, funOb)
            }
        } 
    }
}