/*================================================================
 * FileName persist_comp
 * Description 常驻节点
 * Created on 04/03/19 by ocean
 * Copyright (c) 2019 OCEAN
================================================================*/
const util = GM.util;
const cfg  = GM.cfg;
cc.Class({
    extends: cc.Component,
    properties: {

    },
    onLoad () {
        // this.node.zIndex = util.max_zindex;
        // cc.game.addPersistRootNode(this.node);
        this._init();
        // cc.error('persist zIndex-',this.node.zIndex);
    },
    _init(){
        
    },
    // _regEvts(){},
    // _close(){},
    // start () {},
    // onEnable (){},
    // onDestroy (){},
    // onDisable(){},
    // update (dt) {},
});
