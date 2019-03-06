"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'main_scene');
// Script/main_scene.js

'use strict';

/*================================================================
 * FileName main_scene
 * Description 当前主场景
 * Created on 04/03/19 by ocean
 * Copyright (c) 2019 OCEAN
================================================================*/
/*
*  GM: 全局
*  GM.vm 视图管理
*  GM.sm 声音管理
*/
// cfg.GM_DEBUG && cc.error(this.name);
var cfg = GM.cfg;
var util = GM.util;
var vm = GM.vm;
cc.Class({
    extends: require("CustomComponent"),
    properties: {
        top_prefab: cc.Prefab
    },
    onLoad: function onLoad() {
        this._regEvts();
        this._initPersist();
        this._init();
        this._test();
    },
    _test: function _test() {
        // this.schedule(()=>{
        //     let scene = util.getScene();
        //     for(let i = 0; i < scene.children.length; i++){
        //         cfg.GM_DEBUG && cc.error(this.name,scene.children[i].name,scene.children[i].zIndex);
        //     }
        // },3);
        // vm.openPrefab('Prefabs/Shop/Shop_View',{'hi':1},parent);
        // vm.openPrefab('Prefabs/Shop/Match_View',{'hi':1},parent);
    },
    onClickTest: function onClickTest(event, custom) {
        cfg.GM_DEBUG && this.log('onClickTest', custom);
        if (custom == 1) {
            var params = { vKey: 'Shop_View', data: { 'shop': 1 } };
            GM.EventCenter.trigger(GM.EventType.GM_UI_REPLACE_FULL_VIEW, params);
        } else if (custom == 2) {} else if (custom == 3) {} else if (custom == 4) {
            vm.openPrefab('Prefabs/Pop/Hall_Pop_Confirm', { 'hi': 1 });
            vm.openQueuePrefab('Prefabs/Pop/Hall_Pop_Turn', { 'hi': 1 });
            vm.openQueuePrefab('Prefabs/Pop/Hall_Pop_Confirm', { 'hi': 1 });
            vm.openQueuePrefab('Prefabs/Pop/Hall_Pop_Turn', { 'hi': 1 });
            vm.openQueuePrefab('Prefabs/Pop/Hall_Pop_Activity', { 'hi': 1 });
        }
    },
    _regEvts: function _regEvts() {
        GM.EventCenter.listen(GM.EventType.GM_UI_REPLACE_FULL_VIEW, this.onPopView, this);
    },


    /*
    *    显示全屏view {assetUrl:'',vKey:'',data:{}}
    */
    onPopView: function onPopView(params) {
        var _this = this;

        var tcfg = {
            'Hall_View': 'Prefabs/Hall/Hall_View', // key node节点的名字 value 预制体地址
            'Shop_View': 'Prefabs/Shop/Shop_View',
            'Match_View': 'Prefabs/Match/Match_View'
        };
        var assetUrl = tcfg[params.vKey];
        var param = params.data || {};
        vm.openPrefab(assetUrl, param, this._pview, function () {
            _this._checkFullView(params.vKey);
        });
    },
    _checkFullView: function _checkFullView(vname) {
        var children = this._pview.children;
        var len = children.length;
        if (len == 1) {
            return;
        }
        for (var i = 0; i < len; i++) {
            var child = children[i];
            if (child.name == vname) {
                child.active = true;
            } else {
                child.active = false;
            }
        }
    },


    /*
    *     scene 变量
    */
    _init: function _init() {
        this._bgsp = this.node.getChildByName('bg_sp').getComponent(cc.Sprite); // scene bg
        this._pview = this.node.getChildByName('pop_view'); // scene full view parent
    },


    /*
    *    scene 更换背景
    */
    _replaceBg: function _replaceBg(spf) {
        this._bgsp.spriteFrame = spf;
    },


    /*
    *    常驻点 层级最高    
    */
    _initPersist: function _initPersist() {
        var node = cc.instantiate(this.top_prefab);
        var scene = util.getScene();
        node.zIndex = util.max_zindex;
        node.parent = scene;
    }
}
// start () {},
// onEnable (){},
// onDestroy (){},
// onDisable(){},
// update (dt) {},
// 一些全局的通知 公告 应该属于scene
);

cc._RF.pop();