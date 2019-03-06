/*================================================================
 * FileName hall_pop_turn
 * Description 幸运转盘
 * Created on 05/03/19 by ocean
 * Copyright (c) 2019 OCEAN
================================================================*/
const cfg = GM.cfg;
const util = GM.util;
cc.Class({
    extends: require("CustomComponent"),
    properties: {

    },
    onLoad () {
        cfg.GM_DEBUG && this.log('onLoad');
    },
    onEnable (){
        cfg.GM_DEBUG && this.log('onEnable');
    },
    onDisable(){
        cfg.GM_DEBUG && this.log('onDisable');
    },
    onDestroy (){
        cfg.GM_DEBUG && this.log('onDestroy');    
    },
    init(){
        // cfg.GM_DEBUG && this.log('init');   
    },
    onClickChou(){
        GM.vm.openPrefab('Prefabs/Hall_Pop_Confirm',{'hi':1});
    },
    // _regEvts(){},
    // _close(){},
    // start () {},    
    // update (dt) {},
});