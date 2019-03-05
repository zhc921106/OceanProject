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
        // cfg.GM_DEBUG && this.log('onLoad','woca');
        this._initPersist();
        
        // this.schedule(()=>{
        //     let scene = util.getScene();
        //     for(let i = 0; i < scene.children.length; i++){
        //         cfg.GM_DEBUG && cc.error(this.name,scene.children[i].name,scene.children[i].zIndex);
        //     }
        // },3);
        vm.openQueuePrefab('Prefabs/Hall_Pop_Confirm',{'hi':1});
        // vm.openQueuePrefab('Prefabs/Hall_Pop_Turn',{'hi':1});
        // vm.openQueuePrefab('Prefabs/Hall_Pop_Activity',{'hi':1});
    },

    onClickTest(event,custom){
        cfg.GM_DEBUG && this.log('onClickTest',custom);
        if(custom == 2){
            vm.openPrefab('Prefabs/Hall_Pop_Confirm',{'hi':1});
        }else if(custom == 1){
            vm.openQueuePrefab('Prefabs/Hall_Pop_Turn',{'hi':1});
            vm.openQueuePrefab('Prefabs/Hall_Pop_Confirm',{'hi':1});
            vm.openQueuePrefab('Prefabs/Hall_Pop_Turn',{'hi':1});
            vm.openQueuePrefab('Prefabs/Hall_Pop_Activity',{'hi':1});
            // vm.openPrefab('Prefabs/Hall_Pop_Confirm',{'hi':1},this.node.getChildByName('bg_sp'));
        }
    },
    // _regEvts(){},
    // start () {},
    // onEnable (){},
    // onDestroy (){},
    // onDisable(){},
    // update (dt) {},
    // 一些全局的通知 公告 应该属于scene

    /*
    *    显示全屏view
    */
    pop_full_view(assetUrl){
        let parent = this.node.getChildByName('pop_view');
        vm.openPrefab('Prefabs/Hall_View',{'hi':1},parent);
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
});