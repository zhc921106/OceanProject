(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Comps/gm_util.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1e616Gj4udOpoVvxli/tff8', 'gm_util', __filename);
// Script/Comps/gm_util.js

"use strict";

var util = {
    // property
    max_zindex: Math.pow(2, 15) - 1000,

    // function
    getScene: function getScene() {
        return cc.director.getScene();
    }
};
GM.util = util;
/*
    cc.js.formatStr.apply(null, arguments)

*/

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=gm_util.js.map
        