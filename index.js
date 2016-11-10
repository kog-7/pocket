/*
 * @Author: jxj
 * @Date:   2016-10-10 15:05:41
 * @Last Modified by:   jxj
 * @Last Modified time: 2016-11-10 13:37:16
 */

(function (gbl) {
  if(!gbl){return;}
    '@include(js/utils.js)'
    var templateCache = {};
    var Pocket = function (url, aim) {
        var privateInfo = {
            url: url,
            aim: aim
        };
        this.usePrivate = function (attr, val) {
            if (val !== undefined) {
                privateInfo[attr] = val; //如果优值
            } else {
                return privateInfo[attr];
            }
        };
    };
    var prototypePocket = {
        constructor: Pocket
    };
    '@include(js/render/extendFilter.js)'
    miniExtend(prototypePocket, extendFilter);

    '@include(js/render/extendRender.js)'
    miniExtend(prototypePocket, extendRender);

    '@include(js/render/extendMatch.js)'
    miniExtend(prototypePocket, extendMatch);

    '@include(js/render/extendExpress.js)'
    miniExtend(prototypePocket, extendExpress);

    '@include(js/render/extendParse.js)'
    miniExtend(prototypePocket, extendParse);

    '@include(js/render/extendDom.js)'
    miniExtend(prototypePocket, extendDom);

    '@include(js/render/extendDomLife.js)'
    miniExtend(prototypePocket, extendDomLife);
    '@include(js/render/extendUpdate.js)'
    miniExtend(prototypePocket, extendUpdate);
    Pocket.prototype = prototypePocket;
    // gbl.Pocket = Pocket;

    if ( typeof define === "function" && define.amd ) {
    	define( "pocket", [], function() {
    		return Pocket;
    	} );
    }
    
    gbl.Pocket = Pocket;
    

})(typeof window !== 'undefined' ? window : null)
