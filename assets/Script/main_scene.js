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
const cfg = GM.cfg;
const util = GM.util;
const vm = GM.vm;
cc.Class({
    extends: require("CustomComponent"),
    properties: {
        top_prefab:cc.Prefab,
    },
    onLoad () {
        this._regEvts();
        this._initPersist();
        this._init();
        this._test();
    },
    _test(){
        // this.schedule(()=>{
        //     let scene = util.getScene();
        //     for(let i = 0; i < scene.children.length; i++){
        //         cfg.GM_DEBUG && cc.error(this.name,scene.children[i].name,scene.children[i].zIndex);
        //     }
        // },3);
        // vm.openPrefab('Prefabs/Shop/Shop_View',{'hi':1},parent);
        // vm.openPrefab('Prefabs/Shop/Match_View',{'hi':1},parent);
    },
    onClickTest(event,custom){
        cfg.GM_DEBUG && this.log('onClickTest',custom);
        if(custom == 1){
            let params = {vKey:'Shop_View',data:{'shop':1}};
            GM.EventCenter.trigger(GM.EventType.GM_UI_REPLACE_FULL_VIEW,params);
        }else if(custom == 2){
        }else if(custom == 3){    
        }else if(custom == 4){
            vm.openPrefab('Prefabs/Pop/Hall_Pop_Confirm',{'hi':1});
            vm.openQueuePrefab('Prefabs/Pop/Hall_Pop_Turn',{'hi':1});
            vm.openQueuePrefab('Prefabs/Pop/Hall_Pop_Confirm',{'hi':1});
            vm.openQueuePrefab('Prefabs/Pop/Hall_Pop_Turn',{'hi':1});
            vm.openQueuePrefab('Prefabs/Pop/Hall_Pop_Activity',{'hi':1});
        }
    },
    _regEvts(){
        GM.EventCenter.listen(GM.EventType.GM_UI_REPLACE_FULL_VIEW, this.onPopView, this);
    },


    /*
    *    显示全屏view {assetUrl:'',vKey:'',data:{}}
    */
    onPopView(params){
        let tcfg = {
            'Hall_View':'Prefabs/Hall/Hall_View',  // key node节点的名字 value 预制体地址
            'Shop_View':'Prefabs/Shop/Shop_View',
            'Match_View':'Prefabs/Match/Match_View',
        };
        let assetUrl = tcfg[params.vKey];
        let param = params.data || {};
        vm.openPrefab(assetUrl,param,this._pview,()=>{
            this._checkFullView(params.vKey);
        });
        
    },
    _checkFullView(vname){
        let children = this._pview.children;
        let len = children.length;
        if(len == 1){return;}
        for(let i = 0; i < len; i++){
            let child = children[i];
            if(child.name == vname){
                child.active = true;
            }else{
                child.active = false;
            }
        }
    },

    /*
    *     scene 变量
    */
    _init(){
        this._bgsp = this.node.getChildByName('bg_sp').getComponent(cc.Sprite);   // scene bg
        this._pview = this.node.getChildByName('pop_view');                       // scene full view parent

    },

    /*
    *    scene 更换背景
    */
    _replaceBg(spf){
        this._bgsp.spriteFrame = spf;
    },

    /*
    *    常驻点 层级最高    
    */
    _initPersist(){
        let node = cc.instantiate(this.top_prefab);
        let scene = util.getScene();
        node.zIndex = util.max_zindex;
        node.parent = scene;
    },
    // start () {},
    // onEnable (){},
    // onDestroy (){},
    // onDisable(){},
    // update (dt) {},
    // 一些全局的通知 公告 应该属于scene
});