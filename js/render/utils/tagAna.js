// var fixPushArray=function(alias,syncData,outOb){
//   var aliasArr=alias.split(",");
//   var temp=null;
//   //别名有多个，然后al分拆下来，如果这个内容没有在对象syncdata里面有的话，则生成为[]，然后push outOb
//   aliasArr.forEach(function(al,ind){
//     temp=syncData[al];
//     if(!(al in syncData)){
//       temp=syncData[al]=[];
//     }
//     temp.push(outOb);
//   });
// }


var _anaContent = function (updateObject,txOb, refAttr, idval, txId, item) {
  var ts=this;
    var uOb = updateObject[refAttr];
    if (!(refAttr in updateObject) || typeof updateObject[refAttr] !== "object") {
        uOb = updateObject[refAttr] = [];
        // uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};
    outOb.type = "textContent",
    outOb.value = val,
    outOb.attr = attr;
    // outOb.identity = idval.toString() + txId;
    // outOb.domId = idval;
    // outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    uOb.push(outOb);
}


var _anaClass = function (updateObject,txOb, refAttr, ind, idval, txId, item) {
  var ts=this;
    var uOb = updateObject[refAttr];
    if (!(refAttr in updateObject) || typeof updateObject[refAttr] !== "object") {
        uOb = updateObject[refAttr] = [];
        // uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};
    outOb.value = val,
    outOb.type = "class";
    outOb.classItem = ind;
    outOb.attr = attr;
    // outOb.identity = idval.toString() + txId;
    // outOb.domId = idval;
    // outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }

    uOb.push(outOb);
}

var _anaStyle = function (updateObject,txOb, refAttr, styleAttr, idval, txId, item) {
  var ts=this;

    var uOb = updateObject[refAttr];
    if (!(refAttr in updateObject) || typeof updateObject[refAttr] !== "object") {
        uOb = updateObject[refAttr] = [];
        // uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};
    outOb.value = val,
    outOb.type = "style";
    outOb.style = styleAttr;
    outOb.attr = attr;
    // outOb.identity = idval.toString() + txId;
    // outOb.domId = idval;
    // outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    uOb.push(outOb);
};



var _anaFormValue = function (updateObject,txOb,refAttr, idval, txId, item) {
  var ts=this;

    var uOb = updateObject[refAttr];
    if (!(refAttr in updateObject) || typeof updateObject[refAttr] !== "object") {
        uOb = updateObject[refAttr] = [];
        // uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};

    outOb.value = val,
    outOb.type = "formValue";

    outOb.attr = attr;
    // outOb.identity = idval.toString() + txId;
    // outOb.domId = idval;
    // outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    uOb.push(outOb);
};


var _anaPockData = function (updateObject,txOb, refAttr, idval, txId, item) {
  var ts=this;
    var uOb = updateObject[refAttr];
    if (!(refAttr in updateObject) || typeof updateObject[refAttr] !== "object") {
        uOb = updateObject[refAttr] = [];
        // uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};
    outOb.value = val,
    outOb.type = "pocketData";
    outOb.attr = attr;
    // outOb.identity = idval.toString() + txId;
    // outOb.domId = idval;
    // outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    uOb.push(outOb);
}



var _tagAnaOne = function (updateObject,ref, copyDom, store, sign, domId, domItem) { //store为解析的时候存档的attr，value，domId表示dom代表的id，sign表示匹配的关键字
//domItem表示集合中第几个dom
    var reg = new RegExp("\\#" + sign + "(\\d+)" + sign + "\\#", "gm");
    var textCont = getTextEle(copyDom[0]);
    //txid是针对到每个属性的id，是更细化的，因为dom可能会有多个变量
    if (textCont.trim()) {
        var textMatch,
            txId,
            txOb;
        while (textMatch = reg.exec(textCont)) {
            txId = textMatch[1];
            txOb = store[txId];
            //对每一个变量所在的位置进行分析。
            _anaContent(updateObject,txOb, ref, domId, txId, domItem);
        }
    }
    
    var tagName = copyDom[0].tagName;
    if (["INPUT", "TEXTAREA"].indexOf(tagName) !== -1) { //如果为可以输入的内容
        var tagValue;
        if (tagName === "INPUT") {
            tagValue = copyDom.val();
        } else {
            tagValue = copyDom.text();
        }
        while (textMatch = reg.exec(tagValue)) {
            txId = textMatch[1];
            txOb = store[txId];
            _anaFormValue(updateObject,txOb, ref, domId, txId, domItem);
        }
    }

    var pockData = copyDom.attr("pocket-data");
    while (textMatch = reg.exec(pockData)) {
        txId = textMatch[1];
        txOb = store[txId];
        _anaPockData(updateObject,txOb, ref, domId, txId, domItem);
    }

    var cla = copyDom.attr("class");
    if (cla) {
        cla = getAllClass(cla);
        cla.forEach(function (str, ind) {
            reg.lastIndex = 0;
            while (textMatch = reg.exec(str)) {
                txId = textMatch[1];
                txOb = store[txId];
                _anaClass(updateObject,txOb,ref, ind, domId, txId, domItem);
            }
        });
    }
    
    var dv = $("<div></div>");
    dv.append(copyDom.clone(true));

    var cssMatch = /^\<[^\<\>]+style=[\'\"]?([\(\)\;\s\-\w\:\[\]\#]+)[\'\"]?[^\<\>]+\>/g.exec(dv.html()); //匹配头标签

    if (cssMatch) {
        cssMatch = cssMatch[1]
        cssMatch = cssMatch.split(";");
        cssMatch.forEach(function (strOb, ind) {
            strOb = strOb.split(":");
            var cattr = strOb[0],
                cval = strOb[1];
            reg.lastIndex = 0;
            while (textMatch = reg.exec(cval)) {
                txId = textMatch[1];
                txOb = store[txId];
                _anaStyle(updateObject,txOb ,ref, cattr, domId, txId, domItem);
            }
        });
    }
}


var tagAna = function (updateObject,ref, copyDom, signStore, sign, domId) {
    if (copyDom.length > 1) {
        copyDom.each(function (ind, dm) {
            dm = $(dm);
            _tagAnaOne(updateObject,ref, dm, signStore, sign, domId,ind);
        });
    } else {
        _tagAnaOne(updateObject,ref, copyDom, signStore, sign, domId);
    }
};


