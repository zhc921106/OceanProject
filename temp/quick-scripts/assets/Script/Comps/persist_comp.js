(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Comps/persist_comp.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c2dfdhRMytOfK/4beUzd7Bb', 'persist_comp', __filename);
// Script/Comps/persist_comp.js

"use strict";

/*================================================================
 * FileName persist_comp
 * Description 常驻节点
 * Created on 04/03/19 by ocean
 * Copyright (c) 2019 OCEAN
================================================================*/
var util = GM.util;
var cfg = GM.cfg;
cc.Class({
    extends: cc.Component,
    properties: {},
    onLoad: function onLoad() {
        // this.node.zIndex = util.max_zindex;
        // cc.game.addPersistRootNode(this.node);
        this._init();
        // cc.error('persist zIndex-',this.node.zIndex);
    },
    _init: function _init() {}
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
        //# sourceMappingURL=persist_comp.js.map
        