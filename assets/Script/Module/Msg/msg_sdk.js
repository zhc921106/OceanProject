let SdkHelper = {
    guestLogin(code,force){
        let baseUrl = GM.SystemInfo.loginUrl+ 'open/v6/user/LoginBySnsIdNoVerify?';
        let data = {
            snsId: 'wxapp:' + code,
            uuid: GM.util.getLocalUUID(),
            appId: GM.SystemInfo.appId,
            gameId: GM.SystemInfo.gameId,
            clientId: GM.SystemInfo.clientId,
            wxAppId: GM.SystemInfo.guestWxAppId
        };
        let completeUrl = baseUrl + GM.util.dataToUrlStr(data);
        GM.Http.request(completeUrl,{
            onSuccess(response){
                let checkData = response;
                if (!checkData || !checkData.result || checkData.result.code !== 0){
                    cc.error('第一个失败');
                    return;
                }
                let result = checkData.result;
                let ip = result.tcpsrv.ip;
                let port = result.tcpsrv.wsport || result.tcpsrv.port;
                let webSocketUrl;
                if (GM.SystemInfo.loginUrl.indexOf("https://") > -1 || ip.indexOf("wss") > -1){
                    webSocketUrl = 'wss://' + ip + ":"+port+'/';
                }else{
                    webSocketUrl = 'ws://' + ip + ':' + port.toString() + '/';
                }
                GM.SystemInfo.webSocketUrl = webSocketUrl;
                GM.Notify.trigger(GM.Event.SDK_LOGIN_SUCCESS,result);

            },
            onFail(params){
                cc.error('0-0-000-');
                GM.Notify.trigger(GM.Event.SDK_LOGIN_FAIL,params);
            },
        });
    },
    connectTcp(){
        // TODO 这里应该还有一些check
        GM.Tcp.connect(GM.SystemInfo.webSocketUrl);
    },
    closeTcp(){
        
    },
    sendSdk(data){
        GM.Tcp.sendMsg(data);
    },
    isConnectSdk(){
        return GM.Tcp.isConnected();
    },
};    
GM.sdk = SdkHelper;