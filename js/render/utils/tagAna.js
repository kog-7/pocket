var anaContent = function (txOb, bigOb, syncData, refAttr, idval, txId, item) {
    var uOb = bigOb[refAttr];
    if (!(refAttr in bigOb) || typeof bigOb[refAttr] !== "object") {
        uOb = bigOb[refAttr] = [];
        uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value,
        alias = txOb.alias;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};
    outOb.type = "textContent",
    outOb.value = val,
    outOb.attr = attr;
    outOb.identity = idval.toString() + txId;
    outOb.domId = idval;
    outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    if (alias) {
        outOb.alias = alias;
        fixPushArray(alias, syncData, outOb);
    }
    uOb.push(outOb);
}

var anaClass = function (txOb, bigOb, syncData, refAttr, ind, idval, txId, item) {
    var uOb = bigOb[refAttr];
    if (!(refAttr in bigOb) || typeof bigOb[refAttr] !== "object") {
        uOb = bigOb[refAttr] = [];
        uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value,
        alias = txOb.alias;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};
    // if (!(attr in uOb)) {
    //     outOb = uOb[attr] = {};
    // } else {
    //     outOb = uOb[attr];
    // }
    outOb.value = val,
    outOb.type = "class";
    outOb.classItem = ind;
    outOb.attr = attr;
    outOb.identity = idval.toString() + txId;
    outOb.domId = idval;
    outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    if (alias) {
        outOb.alias = alias;
        fixPushArray(alias, syncData, outOb);
    }
    uOb.push(outOb);
}

var anaStyle = function (txOb, bigOb, syncData, refAttr, styleAttr, idval, txId, item) {
    var uOb = bigOb[refAttr];
    if (!(refAttr in bigOb) || typeof bigOb[refAttr] !== "object") {
        uOb = bigOb[refAttr] = [];
        uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value,
        alias = txOb.alias;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};
    // if (!(attr in uOb)) {
    //     outOb = uOb[attr] = {};
    // } else {
    //     outOb = uOb[attr];
    // }
    outOb.value = val,
    outOb.type = "style";
    outOb.style = styleAttr;
    outOb.attr = attr;
    outOb.identity = idval.toString() + txId;
    outOb.domId = idval;
    outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    if (alias) {
        outOb.alias = alias;
        fixPushArray(alias, syncData, outOb);
    }
    uOb.push(outOb);
};

var anaFormValue = function (txOb, bigOb, syncData, refAttr, idval, txId, item) {

    var uOb = bigOb[refAttr];
    if (!(refAttr in bigOb) || typeof bigOb[refAttr] !== "object") {
        uOb = bigOb[refAttr] = [];
        uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value,
        alias = txOb.alias;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};

    outOb.value = val,
    outOb.type = "formValue";

    outOb.attr = attr;
    outOb.identity = idval.toString() + txId;
    outOb.domId = idval;
    outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    if (alias) {
        outOb.alias = alias;
        fixPushArray(alias, syncData, outOb);
    }
    uOb.push(outOb);
};

var anaPockData = function (txOb, bigOb, syncData, refAttr, idval, txId, item) {
    var uOb = bigOb[refAttr];
    if (!(refAttr in bigOb) || typeof bigOb[refAttr] !== "object") {
        uOb = bigOb[refAttr] = [];
        uOb._pocket_id = idval;
    }
    var attr = txOb.attr,
        val = txOb.value,
        alias = txOb.alias;
    attr = attr
        ? attr
        : "__default";
    var outOb = {};

    outOb.value = val,
    outOb.type = "pocketData";
    outOb.attr = attr;
    outOb.identity = idval.toString() + txId;
    outOb.domId = idval;
    outOb.ref = refAttr;
    if (item !== undefined) {
        outOb.domItem = item;
    }
    if (alias) {
        outOb.alias = alias;
        fixPushArray(alias, syncData, outOb);
    }
    uOb.push(outOb);
}

var tagAnaOne = function (ref, copyDom, store, sign, idval, updateObject, syncData, domItem) { //store为解析的时候存档的attr，value，idval表示dom代表的id，sign表示匹配的关键字
    var reg = new RegExp("\\#" + sign + "(\\d+)" + sign + "\\#", "gm");
    var textCont = getTextEle(copyDom[0]);
    if (textCont.trim()) {
        var textMatch,
            txId,
            txOb;
        while (textMatch = reg.exec(textCont)) {
            txId = textMatch[1];
            txOb = store[txId];
            anaContent(txOb, updateObject, syncData, ref, idval, txId, domItem);
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
            anaFormValue(txOb, updateObject, syncData, ref, idval, txId, domItem);
        }
    }

    var pockData = copyDom.attr("pocket-data");
    while (textMatch = reg.exec(pockData)) {
        txId = textMatch[1];
        txOb = store[txId];
        anaPockData(txOb, updateObject, syncData, ref, idval, txId, domItem);
    }

    var cla = copyDom.attr("class");
    if (cla) {
        cla = getAllClass(cla);
        cla.forEach(function (str, ind) {
            reg.lastIndex = 0;
            while (textMatch = reg.exec(str)) {
                txId = textMatch[1];
                txOb = store[txId];
                anaClass(txOb, updateObject, syncData, ref, ind, idval, txId, domItem);
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
                anaStyle(txOb, updateObject, syncData, ref, cattr, idval, txId, domItem);
            }
        });
    }
}

var tagAna = function (ref, copyDom, store, sign, idval, updateObject, syncData) {
    if (copyDom.length > 1) {
        copyDom.each(function (ind, dm) {
            dm = $(dm);
            tagAnaOne(ref, dm, store, sign, idval, updateObject, syncData, ind);
        });
    } else {
        tagAnaOne(ref, copyDom, store, sign, idval, updateObject, syncData);
    }
};
