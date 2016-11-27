var filters = {
    upper: function(str) {
        return str.toUpperCase()
    },
    lower: function(str) {
        return str.toLowerCase()
    },
    length: function(str) {
        if (typeHim(str) !== "array") {
            return str
        }
        return str.length
    },
    safe: function(str) {
        if (typeof str === "string") {
            return safeHtml(str)
        }
    },
    toString:function(str){
      return str.toString();
    }
};


var extendFilter={//filters是给所有模版通用的，
    filters:filters
};

Pocket.setFilter=function(opt){
  coverExtend(filters, opt);
}


