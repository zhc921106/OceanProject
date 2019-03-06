/*================================================================
 * FileName match_view
 * Description 比赛view
 * Created on 06/03/19 by ocean
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
    init(params){
        cfg.GM_DEBUG && this.log('init',params);    
    },
    onDisable(){
        cfg.GM_DEBUG && this.log('onDisable');
    },
    onDestroy (){
        cfg.GM_DEBUG && this.log('onDestroy');    
    },

    onClickShop(){
        let params = {vKey:'Shop_View',data:{'shop':1}};
        GM.EventCenter.trigger(GM.EventType.GM_UI_REPLACE_FULL_VIEW,params);
    },
    onClickHall(){
        let params = {vKey:'Hall_View',data:{'hall':1}};
        GM.EventCenter.trigger(GM.EventType.GM_UI_REPLACE_FULL_VIEW,params);
    },
    // _regEvts(){},
    // _close(){},
    // start () {},
    // onEnable (){},
    // onDestroy (){},
    // onDisable(){},
    // update (dt) {},
});
