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
        // cc.game.addPersistRootNode(this.node);
        this._initMask();
        this._regEvts();
        // this.setBlockInput(false);
    },
    _regEvts(){
        GM.EventCenter.listen(GM.EventType.GM_UI_LOADING_START, this._onLoadStart, this);
        GM.EventCenter.listen(GM.EventType.GM_UI_LOADING_END, this._onLoadEnd, this);
    },
    _onLoadStart(){
        this.setBlockInput(true);
    },
    _onLoadEnd(){
        this.setBlockInput(false);
    },
    _initMask(){
        this._blockComp = this.node.getComponent(cc.BlockInputEvents);
    },
    setBlockInput(isBlock){
        this._blockComp.enabled = isBlock;
    },
    // _close(){},
    // start () {},
    // onEnable (){},
    // onDestroy (){},
    // onDisable(){},
    // update (dt) {},
});
