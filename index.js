/*
 * @Author: jxj
 * @Date:   2016-10-10 15:05:41
 * @Last Modified by:   jxj
 * @Last Modified time: 2016-12-16 00:26:44
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
        constructor: Pocket,
        sn:{id:0}
    };
    
    '@include(js/render/extendInit.js)'
    miniExtend(prototypePocket, extendInit);

    '@include(js/render/extendRender.js)'
    miniExtend(prototypePocket, extendRender);


    '@include(js/render/extendDom.js)'
    miniExtend(prototypePocket, extendDom);

    '@include(js/render/extendDomLife.js)'
    miniExtend(prototypePocket, extendDomLife);

    Pocket.prototype = prototypePocket;

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
