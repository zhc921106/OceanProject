"use strict";
cc._RF.push(module, '1e616Gj4udOpoVvxli/tff8', 'gm_util');
// Script/Comps/gm_util.js

'use strict';

GM.EventCenter = {

    events: {},

    listen: function listen(eName, handler, scope) {
        this.events[eName] = this.events[eName] || [];
        this.events[eName].push({
            scope: scope || this,
            handler: handler
        });
    },

    ignore: function ignore(eName, handler, scope) {
        scope = scope || this;
        var fns = this.events[eName];

        if (!fns) {
            return;
        }

        this.events[eName] = fns.filter(function (fn) {
            return fn.scope != scope || fn.handler != handler;
        });
    },

    ignoreScope: function ignoreScope(scope) {
        var obs = void 0;
        for (var msg in this.events) {
            obs = this.events[msg];
            if (obs) {
                this.events[msg] = obs.filter(function (fn) {
                    if (fn.scope != scope) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        }
    },

    trigger: function trigger(eventName, params) {
        var fns = this.events[eventName];
        if (!fns) {
            cc.error('GM EventCenter no Listen:', eventName);
            return;
        }
        var fn = void 0;
        for (var i = 0, len = fns.length; i < len; i++) {
            fn = fns[i];
            if (fn && fn.handler && typeof fn.handler == "function") {
                fn.handler.call(fn.scope, params);
            }
        }
    },
    dumpAllEvts: function dumpAllEvts() {}
};
GM.EventType = {
    // 内部事件
    GM_UI_LOADING_START: 'gm_ui_loading_start', // UI加载等待开始
    GM_UI_LOADING_END: 'gm_ui_loading_end', //       ...结束

    // tcp事件
    TCP_ERROR: 'tcp_error',
    TCP_CLOSE: 'tcp_close',
    TCP_OPENED: 'tcp_opened', // 连接建立好之后的回调
    TCP_RECONNECT: 'tcp_reconnect'
    // 页面消息事件
    // 平台事件
};
var util = {
    // property
    max_zindex: Math.pow(2, 15) - 1000,

    // function
    getScene: function getScene() {
        return cc.director.getScene();
    },
    getRes: function getRes(assetUrl, callback) {
        var prefab = cc.loader.getRes(assetUrl);
        if (prefab) {
            callback(prefab);return;
        }
        cc.loader.loadRes(assetUrl, cc.Prefab, function (completedCount, totalCount) {
            // TODO 加载进度更新
            GM.EventCenter.trigger(GM.EventType.GM_UI_LOADING_START, { progress: completedCount / totalCount });
        }, function (err, prefab) {
            GM.EventCenter.trigger(GM.EventType.GM_UI_LOADING_END);
            if (err) {
                cc.error('util loadRes error:', err);return;
            }
            callback(prefab);
        });
    }
};
GM.util = util;
/*
    cc.js.formatStr.apply(null, arguments)

*/

cc._RF.pop();