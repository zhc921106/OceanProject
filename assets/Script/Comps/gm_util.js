GM.Notify = {

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

    ignoreAll : function (scope) {
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
            cc.error('GM Notify no Listen:',eventName);
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
GM.Event = {
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
    TCP_LOGOUT:'logout',
    TCP_HEART_BEAT:'tcp_heart_beat',

    SDK_LOGIN_SUCCESS:'sdk_login_success',
    SDK_LOGIN_FAIL:'sdk_login_fail',

    CMD_USER_INFO:'user_info',
    CMD_MODULE_TIP:'module_tip_update',
    CMD_UPDATE_NOTIFY:'update_notify',
    CMD_GAME_DATA:'game_data',
    CMD_TODO_TASKS:'todo_tasks',
    CMD_ROOM_ONLINT_INFO:'room_online_info',
    CMD_UPDATE_NOTIFY5:'update_notify5',
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
    		GM.Notify.trigger(GM.Event.GM_UI_LOADING_START,{progress:(completedCount / totalCount)});
    	},(err,prefab)=>{
    		GM.Notify.trigger(GM.Event.GM_UI_LOADING_END);
    		if(err){ cc.error('util loadRes error:',err); return;}
    		callback(prefab);
    	});
    },
    getTime(){
        let d = new Date();
        let t = d.getTime();
        let ts = Math.round(t/1000).toString();
        return ts;
    },
    getTimeTs(){
        let d = new Date();
        return d.getTime();
    },

    /*
    *    登陆相关的
    */
    getLocalUUID (){
        return this.createUUID();
    },
    createUUID: function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "";

        var uuid = s.join("");
        return uuid;
    },
    dataToUrlStr: function (data) {
        var arr = [];
        for (var key in data) {
            arr.push(key + '=' + encodeURIComponent(data[key]));
            // arr.push(key + '=' + data[key]);
        }
        return arr.join('&');
    },
    
    /*
    *	加密解密相关
    */
    decodeMessage (data) {
        if (typeof ArrayBuffer != 'undefined' && data instanceof ArrayBuffer) {
            var databytes = new Uint8Array(data);
            var content = '';
            for (var i = 0, len = databytes.length; i < len; i++) {
                var tmpc = String.fromCharCode(databytes[i]);
                content += tmpc;
            }
            return content;
        }
        var data = this.base64Decode(data);
        var mask = data.slice(0, 4);
        data = data.slice(4);
        for (var i = 0, len = data.length; i < len; i++) {
            var charcode = data[i];
            charcode ^= mask[i % 4];
            data[i] = charcode;
        }
        var result = this.utf8Decode(data);
        return result;
    },
    base64Encode: function(input) {
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = tywx.EncodeDecode.utf8Encode(input);
        var len = input.length;
        while (i < len) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);

        }

        return output;
    },
    base64Decode: function(input) {
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        var len = input.length;
        var output = [];
        while (i < len) {

            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output.push(chr1);

            if (enc3 != 64) {
                output.push(chr2);
            }
            if (enc4 != 64) {
                output.push(chr3);
            }
        }
        return output;
    },
    utf8Encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0, len = string.length; n < len; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }

        return utftext;
    },
    utf8Decode: function(input) {
        var string = "";
        var i = 0, c1, c2;
        var c = c1 = c2 = 0;
        var len = input.length;
        while (i < len) {
            c = input[i];
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = input[i + 1];
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = input[i + 1];
                c3 = input[i + 2];
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    },

};
GM.util = util;
/*
    cc.js.formatStr.apply(null, arguments)

*/