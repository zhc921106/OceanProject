const util = GM.util;
/*
*    平台差异性内容 由sdk内部处理
*/
let SdkHelper = cc.Class({
    name: 'SdkHelper',
    ctor(){
        this.init();
    },
    properties: {

    },
    init(){
        cc.game.on(cc.game.EVENT_HIDE,()=>{
            if (!GM.StateInfo.isOnForeground) {
                return;
            }
            GM.StateInfo.isOnForeground = false;
            // tywx.NotificationCenter.trigger(tywx.EventType.GAME_HIDE);
        });
        cc.game.on(cc.game.EVENT_SHOW, ()=>{
            if (GM.StateInfo.isOnForeground) {
                return;
            }
            GM.StateInfo.isOnForeground = true;
            // tywx.LOGE('', "+++++++++++++++++onShow+++++++++++++++++");
            // tywx.NotificationCenter.trigger(tywx.EventType.GAME_SHOW);
        });
    },
    /*
    *    开始一个Tcp连接
    */
    startTcp(){
        cc.log('SdkHelper startTcp',util.getTime());
        if(this.isConnectSdk()){return;}
        GM.Tcp.connect(GM.SystemInfo.webSocketUrl);
    },
    closeTcp(){
        
    },
    sendSdk(data){
        cc.log('SdkHelper sendSdk:',util.getTime(),data);
        GM.Tcp.sendMsg(data);
    },
    isConnectSdk(){
        return GM.Tcp.isConnected();
    },
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
                    cc.error('SdkHelper 第一个失败');
                    return;
                }
                let result = checkData.result;
                // data check
                GM.SystemInfo.isCreate = result.isCreate;
                GM.UserInfo.parseSnsData(result);
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
                GM.Notify.trigger(GM.Event.SDK_LOGIN_FAIL,params);
            },
        });
    },
});
GM.sdk = new SdkHelper();
module.exports = SdkHelper;