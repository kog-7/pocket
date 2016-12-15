 var keyword="pocket_record_id";

var matchReg=function(match){
    return new RegExp("\\" + match + "([\\w\\.\\-\\:\\|\\,\\#\\s\\&\\u4e00-\\u9fa5]+)\\" + match, "gm");
};



var UserException=function(message) {
 this.message = message;
 this.name = "UserException";
};