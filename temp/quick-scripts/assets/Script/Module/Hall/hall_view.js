(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Module/Hall/hall_view.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3a33dPnOulEaZrhF7RMHpvK', 'hall_view', __filename);
// Script/Module/Hall/hall_view.js

'use strict';

/*================================================================
 * FileName hall_view
 * Description 主界面
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
    },
    onClickShop: function onClickShop() {
        var params = { vKey: 'Shop_View', data: { 'shop': 1 } };
        GM.EventCenter.trigger(GM.EventType.GM_UI_REPLACE_FULL_VIEW, params);
    },
    onClickMatch: function onClickMatch() {
        var params = { vKey: 'Match_View', data: { 'match': 1 } };
        GM.EventCenter.trigger(GM.EventType.GM_UI_REPLACE_FULL_VIEW, params);
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
        //# sourceMappingURL=hall_view.js.map
        