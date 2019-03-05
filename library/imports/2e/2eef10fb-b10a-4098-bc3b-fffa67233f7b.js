"use strict";
cc._RF.push(module, '2eef1D7sQpAmLw7//pnIz97', 'hall_pop_turn');
// Script/Module/Pop/hall_pop_turn.js

'use strict';

/*================================================================
 * FileName hall_pop_turn
 * Description 幸运转盘
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
        cfg.GM_DEBUG && this.log('onEnable');
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
    onClickChou: function onClickChou() {
        GM.vm.openPrefab('Prefabs/Hall_Pop_Confirm', { 'hi': 1 });
    }
}
// _regEvts(){},
// _close(){},
// start () {},    
// update (dt) {},
);

cc._RF.pop();