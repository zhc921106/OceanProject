(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Comps/comp_template.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4a9c5WxU7RB24xBoghMx4br', 'comp_template', __filename);
// Script/Comps/comp_template.js

'use strict';

/*================================================================
 * FileName comp_template
 * Description 组件脚本模板
 * Created on 04/03/19 by ocean
 * Copyright (c) 2019 OCEAN
================================================================*/
var cfg = GM.cfg;
var util = GM.util;
cc.Class({
    extends: require("CustomComponent"),
    properties: {},
    onLoad: function onLoad() {
        cfg.GM_DEBUG && this.log('onLoad');
    },
    onEnable: function onEnable() {
        cfg.GM_DEBUG && this.log('onEnable');
    },
    init: function init(params) {
        cfg.GM_DEBUG && this.log('init', params);
    },
    onDisable: function onDisable() {
        cfg.GM_DEBUG && this.log('onDisable');
    },
    onDestroy: function onDestroy() {
        cfg.GM_DEBUG && this.log('onDestroy');
    }
}
// _regEvts(){},
// _close(){},
// start () {},
// onEnable (){},
// onDestroy (){},
// onDisable(){},
// update (dt) {},
);

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
        //# sourceMappingURL=comp_template.js.map
        