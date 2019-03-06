GM.EventCenter = {

    events : {},

    listen : function(eName, handler, scope){
        this.events[eName] = this.events[eName] || [];
        this.events[eName].push({
            scope: scope || this,
            handler: handler
        });
    },

    ignore : function(eName, handler, scope){
        scope = scope || this;
        let fns = this.events[eName];

        if(!fns){
            return;
        }

        this.events[eName] = fns.filter(function(fn){
            return fn.scope!=scope || fn.handler!=handler;
        });
    },

    ignoreScope : function (scope) {
    	let obs;
        for(let msg in this.events){
            obs = this.events[msg];
            if(obs){
                this.events[msg] = obs.filter(function(fn){
                    if(fn.scope != scope){
                        return true;
                    } else{
                        return false;
                    }
                });
            }
        }
    },

    trigger : function(eventName, params){
        let fns = this.events[eventName];
        if(!fns){
            cc.error('GM EventCenter no Listen:',eventName);
            return;
        }
        let fn;
        for(var i = 0,len = fns.length; i < len; i++){
            fn = fns[i];
            if(fn && fn.handler && typeof fn.handler == "function"){
                fn.handler.call(fn.scope, params);
            }
        }
    },
    dumpAllEvts(){},
};
GM.EventType = {
	// 内部事件
	GM_UI_LOADING_START: 'gm_ui_loading_start', // UI加载等待开始
	GM_UI_LOADING_END: 'gm_ui_loading_end',     //       ...结束
	GM_UI_SCENE_BG_REPALCE: 'gm_ui_scene_bg_replace',   // 不同view的背景替换事件
	GM_UI_REPLACE_FULL_VIEW: 'gm_ui_replace_full_view', // 全屏view 切换

	// tcp事件
	TCP_ERROR: 'tcp_error',
    TCP_CLOSE: 'tcp_close',
    TCP_OPENED: 'tcp_opened', // 连接建立好之后的回调
    TCP_RECONNECT: 'tcp_reconnect',
    TCP_RECEIVE: 'tcp_receive',
	// 页面消息事件
	// 平台事件
};
let util = {
    // property
    max_zindex:Math.pow(2, 15)-1000,
    
    // function
    getScene(){
        return cc.director.getScene();
    },
    getRes(assetUrl,callback){
    	let prefab = cc.loader.getRes(assetUrl);
    	if(prefab){callback(prefab);return;}
    	cc.loader.loadRes(assetUrl,cc.Prefab,(completedCount, totalCount)=>{
    		// TODO 加载进度更新
    		GM.EventCenter.trigger(GM.EventType.GM_UI_LOADING_START,{progress:(completedCount / totalCount)});
    	},(err,prefab)=>{
    		GM.EventCenter.trigger(GM.EventType.GM_UI_LOADING_END);
    		if(err){ cc.error('util loadRes error:',err); return;}
    		callback(prefab);
    	});
    },

};
GM.util = util;
/*
    cc.js.formatStr.apply(null, arguments)

*/