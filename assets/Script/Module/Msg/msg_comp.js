const MsgFactory = require('./msg_factory');
cc.Class({
    extends: cc.Component,
    properties: {
    },
    onLoad () {
        GM.mf = new MsgFactory();
        GM.Notify.listen(GM.Event.TCP_RECEIVE, this._onReceive, this);
    },
    _onReceive(params){
        // TODO 可以采取监听的方式 分发给多个 MsgFactory 对象
        // params = params || {};
        // let cmd = params.cmd;
        // if (cmd) {
        //     GM.Notify.trigger(cmd, params);
        // }
        // 全局只有一个MsgFactory 全局交由它处理
        GM.mf.onResponse(params);
    },
    update (dt) {
        GM.mf.onUpdate(dt);    
    },
    onDestroy(){

    },
});
