/*================================================================
 * FileName hall_pop_confirm
 * Description 确定框弹窗
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
        cfg.GM_DEBUG && this.log('onEnable');  //this.node.zIndex
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
    onClickYes(){
        this.close();
    },
    onClickNo(){
        this.close();
    },
    // _regEvts(){},
    // _close(){},
    // start () {},    
    // update (dt) {},
});