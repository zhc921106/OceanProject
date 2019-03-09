/*
* Timer
*/
let Timer = {
    /**
     * 参数的含义依次是：回调的obj、回调函数、tick的间隔、不算这次还要重复的次数，开始tick的delay时间
     */
    setTimer (callback, interval,params){
        params = params || {};
        let repeatNum = params.repeatNum || cc.macro.REPEAT_FOREVER;
        let delay = params.delay || 0;
        let obj = params.obj || this._getScene();
        let paused = false;
        let scheduler = this._getScheduler();
        scheduler.schedule(callback, obj, interval, repeatNum, delay, paused);        
    },
    /**
     * 取消定时器
     */
    cancelTimer:function(callback,obj){
        obj = obj || this._getScene();
        let scheduler = this._getScheduler();
        scheduler.unschedule(callback, obj);
    },
    /**
     * 判断定时器
     */
    isScheduledTimer:function(callback,obj){
        obj = obj || this._getScene();
        let scheduler = this._getScheduler();
        return scheduler.isScheduled(callback, obj);
    },
    _getScene(){
        return cc.director.getScene();
    },
    _getScheduler(){
        return cc.director.getScheduler();
    },    
};
/*
*    http tcp 服务
*/
let TcpClient = {
    ws:null,
    CONNECT_STATUS_OK : 1,
    CONNECT_STATUS_OPENING : 2,
    CONNECT_STATUS_CLOSING : 3,
    CONNECT_STATUS_FAIL : 0,
    connectStatus : 0,
    isTimerInited : false,
    tickCount : 0,
    filterCmds : {'heart_beat':1,'room_online_info':1},

    /**
     * 该方法包含了心跳和tcp状态检查两项功能,结合connect中的逻辑,是一个无限重试的机制
     */
    timerSchedule () {
        this.tickCount = (this.tickCount + 1) % 3;
        if (this.tickCount == 2 && this.connectStatus == this.CONNECT_STATUS_OK) {
            //监听者进行具体的协议实现
            GM.Notify.trigger(GM.Event.TCP_HEART_BEAT);
        }
        // 每1秒检查一下长连接，如果不通，则重连。
        this.reconnet();
    },
    startCheckTimer () {
        this.isTimerInited = true;
        Timer.setTimer(this.timerSchedule.bind(this), 1);
    },
    stopCheckTimer () {
        this.isTimerInited = false;
        Timer.cancelTimer(this.timerSchedule);
    },
    connect (url){
        if (this.connectStatus == this.CONNECT_STATUS_OPENING
            || this.connectStatus == this.CONNECT_STATUS_OK) {
            return;
        }
        this.connectStatus = this.CONNECT_STATUS_OPENING;
        this.doConnect(url);
    },
    doConnect (url) {
        var ws = new WebSocket(url);
        ws.onopen = (res)=>{
            this.connectStatus = this.CONNECT_STATUS_OK;
            if (!this.isTimerInited) {
                //启动TCP的定时检查机制,成功连接1次后将永久进行检查
                this.startCheckTimer();
            }
            GM.Notify.trigger(GM.Event.TCP_OPENED);
        };
        ws.onerror = (res)=> {
            this.connectStatus = this.CONNECT_STATUS_FAIL;
            GM.Notify.trigger(GM.Event.TCP_ERROR);
        };
        ws.onclose = (res)=> {
            this.connectStatus = this.CONNECT_STATUS_FAIL;
            GM.Notify.trigger(GM.Event.TCP_CLOSE);
        };
        ws.onmessage = (res)=> {
            // TODO 在后台不处理消息 
            if (!GM.StateInfo.isOnForeground){
                return;
            }
            // 处理长连接的消息
            var content = GM.util.decodeMessage(res["data"]);
            if (content == null || content == '0000') {
                return;
            }
            var msgStr = unescape(content.replace(/\\u/gi,'%u'));
            var strJson = content.substr(0, content.length - 0);
            if (strJson != null && strJson.length > 0) {
                var _json = JSON.parse(strJson);
                if (!this.filterCmds[_json.cmd]){
                    // cc.log("MsgClientTcp Receive:", msgStr);
                }
                GM.Notify.trigger(GM.Event.TCP_RECEIVE, _json);
            }
        };
        this.ws = ws;
    },
    reconnet () {
        if (!GM.StateInfo.isOnForeground){
            return;
        }
        if (this.connectStatus == this.CONNECT_STATUS_FAIL) {
            GM.Notify.trigger(GM.Event.TCP_RECONNECT);
            this.connect(GM.SystemInfo.webSocketUrl);
        }
    },
    sendMsg (data) {
        if (this.connectStatus != this.CONNECT_STATUS_OK) {
            return;
        }
        var msgStr = JSON.stringify(data);
        if(!this.filterCmds[data.cmd]){
            // cc.log("MsgClientTcp Send:", msgStr);
        }
        this.ws.send(msgStr);
    },
    close (){
        this.connectStatus = this.CONNECT_STATUS_CLOSING;
        if(!this.ws){
            return;
        }
        this.ws.close();
        this.ws.onopen = null;
        this.ws.onerror  = null;
        this.ws.onclose  = null;
        this.ws.onmessage = null;
        this.ws = null;
        this.stopCheckTimer();
    },
    isConnected (){
        return this.connectStatus == this.CONNECT_STATUS_OK;
    },
};
let TcpWxClient = {
    CONNECT_STATUS_OK : 1,
    CONNECT_STATUS_OPENING : 2,
    CONNECT_STATUS_CLOSING : 3,
    CONNECT_STATUS_FAIL : 0,
    connectStatus : 0,
    isTimerInited : false,
    tickCount : 0,
    filterCmds : {'heart_beat':1,'room_online_info':1,'led':1},
    /**
     * 该方法包含了心跳和tcp状态检查两项功能,结合connect中的逻辑,是一个无限重试的机制
     */
    timerSchedule () {
        this.tickCount = (this.tickCount + 1) % 3;
        if (this.tickCount == 2 && this.connectStatus == this.CONNECT_STATUS_OK) {
            //每3秒发送心跳
            //监听者进行具体的协议实现
            GM.Notify.trigger(GM.Event.TCP_HEART_BEAT);
        }
        // 每1秒检查一下长连接，如果不通，则重连。
        this.reconnet();
    },
    startCheckTimer () {
        this.isTimerInited = true;
        Timer.setTimer( this.timerSchedule, 1);
    },
    stopCheckTimer () {
        this.isTimerInited = false;
        Timer.cancelTimer( this.timerSchedule);
    },

    //以下为websocket连接相关方法
    connect (url){
        if (this.connectStatus == this.CONNECT_STATUS_OPENING
            || this.connectStatus == this.CONNECT_STATUS_OK) {
            return;
        }
        this.connectStatus = this.CONNECT_STATUS_OPENING;
        this.doWechatConnect(url);
    },
    doWechatConnect: function(url) {
        wx.connectSocket({
            url: url
        });
        wx.onSocketOpen(function(res) {
            this.connectStatus = this.CONNECT_STATUS_OK;
            GM.Notify.trigger(GM.Event.TCP_OPENED);
            if (!this.isTimerInited) {
                //启动TCP的定时检查机制,成功连接1次后将永久进行检查
                this.startCheckTimer();
            }
        });
        wx.onSocketError(function(res) {
            this.connectStatus = this.CONNECT_STATUS_FAIL;
            GM.Notify.trigger(GM.Event.TCP_ERROR);
        });
        wx.onSocketClose(function(res) {
            this.connectStatus = this.CONNECT_STATUS_FAIL;
            GM.Notify.trigger(GM.Event.TCP_CLOSE);
        });
        wx.onSocketMessage(function(res) {
            if (!GM.StateInfo.isOnForeground){//在后台不处理消息
                return;
            }
            // 处理长连接的消息
            var content = GM.util.decodeMessage(res["data"]);
            if (content == null || content == '0000') {
                return;
            }

            var msgStr = unescape(content.replace(/\\u/gi,'%u'));
            var strJson = content.substr(0, content.length - 0);
            if (strJson != null && strJson.length > 0) {
                var _json = JSON.parse(strJson);
                if(!this.filterCmds[_json.cmd]){
                    cc.log('TcpWxClient Receive:',msgStr);
                }
                GM.Notify.trigger(GM.Event.TCP_RECEIVE, _json);
            }
        });
    },
    decodeMessage: function(data) {
        if (typeof ArrayBuffer != 'undefined' && data instanceof ArrayBuffer) {
            var databytes = new Uint8Array(data);
            var content = ''
            for (var i = 0, len = databytes.length; i < len; i++) {
                var tmpc = String.fromCharCode(databytes[i]);
                content += tmpc;
            }
            return content;
        }
        var data = GM.util.base64Decode(data);
        var mask = data.slice(0, 4);
        data = data.slice(4);
        for (var i = 0, len = data.length; i < len; i++) {
            var charcode = data[i];
            charcode ^= mask[i % 4];
            data[i] = charcode;
        }
        var result = GM.util.utf8Decode(data);
        return result;
    },

    reconnet:function () {
        if (!GM.StateInfo.isOnForeground){
            //在后台不重连(IOS会出问题)
            return;
        }
        if (this.connectStatus == this.CONNECT_STATUS_FAIL) {
            GM.Notify.trigger(GM.Event.TCP_RECONNECT);
            this.connect(GM.SystemInfo.webSocketUrl);
        }
    },

    sendMsg: function(data) {
        if (this.connectStatus != this.CONNECT_STATUS_OK) {
            return;
        }

        var msgStr = JSON.stringify(data);
        if(!this.filterCmds[data.cmd]){
            cc.log('TcpWxClient Send:',msgStr);
        }
        wx.sendSocketMessage({
            data:msgStr,
            success: function(params){
            },
            fail: function(params) {
                var errMsg = params[0];
                if (errMsg && errMsg['errMsg'] === 'sendSocketMessage:fail taskID not exist'){
                    wx.closeSocket();
                    this.connectStatus = this.CONNECT_STATUS_FAIL;
                }
                cc.error('sendSocketMessage fail')
            },
            complete: function(params) {
            }
        });
    },
    close: function(){
        this.connectStatus = this.CONNECT_STATUS_CLOSING;
        wx.closeSocket();
        this.stopCheckTimer();
    }
};
let HttpClient = {
    /*
    *    wechat mini game http
    */
    httpWxPost (cfgObj){
        wx.request({
            url : cfgObj.url,
            data : cfgObj.postData,
            header : cfgObj.header,
            method : 'POST',
            dataType : 'json',
            success (res) {
                if (res.statusCode == 200){
                    cc.error('MsgClient httpWxPost ok');
                }else{
                    cc.error('MsgClient httpWxPost fail',res.statusCode);
                }
            },
            fail (res) {
                cc.error('MsgClient httpWxPost error',cfgObj.url);
            }
        });
    },
    httpWxGet (cfgObj, successcb, failcb,ignoreJoinParams){
        wx.request({
            url : cfgObj.url,
            method : 'GET',
            success (res) {
                if (res.statusCode == 200){
                    if(successcb) {
                        successcb(res.data);
                    }
                }else{
                    cc.error('MsgClient httpWxGet fail',res.statusCode);
                }
            },
            fail (res) {
                cc.error('MsgClient httpWxGet error',cfgObj.url);
                if(failcb) {failcb(res);}
            }
        });
    },

    /*
    *   creator http
    */
    request (url, obj, requestType) {
        requestType = requestType || 'POST';
        obj = obj || {};
        var xhr = new XMLHttpRequest();
        var time = 15 * 1000;//超时时间
        var timeout = false;
        var timer = setTimeout(()=>{
            timeout = true;
            xhr.abort();//请求中止
        }, time);
        xhr.open(requestType, url, true);
        xhr.onreadystatechange = function () {
            var response = xhr.responseText;
            if (timeout) {
                if (typeof obj.onFail == 'function') { obj.onFail('time out');}return;
            }
            clearTimeout(timer);//取消等待的超时
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var resJson = JSON.parse(response);
                if (typeof obj.onSuccess == 'function') {obj.onSuccess(resJson);}
            } else {
                // readyState 0 请求未初始化 1请求已建立还没有发送 2请求已发送正在处理 3请求处理中已有部分数据可用 4 相应已完成
                if(xhr.status == 200 && (xhr.readyState == 2 || xhr.readyState == 3)){
                    return;
                }
                if (typeof obj.onFail == 'function') {obj.onFail(response);}
            }
        };
        xhr.send();
    },
    get (url, callback, dataInfo){
        if (dataInfo) {
            var connecter = '?';
            if (url[url.length - 1] === '&') {
                connecter = '';
            } else if (url.indexOf('?') >0) {
                connecter = '&';
            }
            var params = this._joinParams(dataInfo);
            params.length > 0 && (url += connecter + params);    
        }

        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 30 * 1000;
        xhr.ontimeout = () => {
            cc.error('MsgClient get timeout');
        };
        xhr.onreadystatechange = () => {
            xhr.readyState === 4 && callback && callback(xhr.status, xhr.responseText);
        };
        xhr.open('GET', encodeURI(url), true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();
    },
    post (url, callback, dataInfo) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = () => {
            xhr.readyState === 4 && callback && callback(xhr.status, xhr.responseText);
        };
        xhr.open('POST', encodeURI(url), true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(this.joinParams(dataInfo));
    },
    loadZipText (url, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = () => {
            xhr.readyState === 4 && callback && callback(xhr.status, xhr.responseText);
        };
        xhr.open('GET', encodeURI(url), true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send();
    },
    _joinParams (dataInfo) {
        if (typeof dataInfo === 'object') {
            if (dataInfo === null) {
                return;
            } else if (Array.isArray(dataInfo)) {
                return JSON.stringify(dataInfo);
            } else {
                var keys = Object.keys(dataInfo);
                var params = keys.map((key, index) => {
                    return key + '=' + dataInfo[key] + (index === keys.length - 1 ? '': '&');
                });
                return params.join('');        
            }
        } else {
            return dataInfo + '';
        }
    }
};
GM.Http = HttpClient;
GM.Tcp = TcpClient;
GM.TcpWx = TcpWxClient;
GM.Timer = Timer;