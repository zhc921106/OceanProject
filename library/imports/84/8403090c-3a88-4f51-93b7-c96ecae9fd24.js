"use strict";
cc._RF.push(module, '84030kMOohPUZO3yW7K6f0k', 'hall_pop_confirm');
// Script/Module/Pop/hall_pop_confirm.js

'use strict';

/*================================================================
 * FileName hall_pop_confirm
 * Description 确定框弹窗
 * Created on 05/03/19 by ocean
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
        cfg.GM_DEBUG && this.log('onEnable'); //this.node.zIndex
    },
    onDisable: function onDisable() {
        cfg.GM_DEBUG && this.log('onDisable');
    },
    onDestroy: function onDestroy() {
        cfg.GM_DEBUG && this.log('onDestroy');
    },
    init: function init() {
        // cfg.GM_DEBUG && this.log('init');   
    },
    onClickYes: function onClickYes() {
        this.close();
    },
    onClickNo: function onClickNo() {
        this.close();
    }
}
// _regEvts(){},
// _close(){},
// start () {},    
// update (dt) {},
);

cc._RF.pop();