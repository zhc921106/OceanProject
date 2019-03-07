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
        GM.mf.onResponse(params);
    },
    update (dt) {
        GM.mf.onUpdate(dt);    
    },
    onDestroy(){

    },
});
