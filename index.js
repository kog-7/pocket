/*
 * @Author: jxj
 * @Date:   2016-10-10 15:05:41
 * @Last Modified by:   jxj
 * @Last Modified time: 2016-11-10 13:37:16
 */

(function (gbl) {
  if(!gbl){return;}
    '@include(js/utils.js)'
    
    '@include(js/config.js)'
    
    var templateCache = {};
    var Pocket = function (aim,url) {
      if(typeof aim==="string"){this.aim=aim;}
      if(typeof url==="string"){this.url=url;}
      this._init();
    };
    var prototypePocket = {
        constructor: Pocket
    };
    
    
    '@include(js/render/extendInit.js)'
    miniExtend(prototypePocket, extendInit);
    
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

    Pocket.prototype = prototypePocket;
    // gbl.Pocket = Pocket;

    if ( typeof define === "function" && define.amd ) {
    	define( "pocket", [], function() {
    		return Pocket;
    	} );
    }
    if ( typeof module === "object" && typeof module.exports === "object" ) {
      module.exports=Pocket;
    }
    
    
    gbl.Pocket = Pocket;
    

})(typeof window !== 'undefined' ? window : null)
