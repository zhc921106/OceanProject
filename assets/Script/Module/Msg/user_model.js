const BaseModel = require('./base_model');
let UserModel = cc.Class({
	name: 'UserModel',
    extends: BaseModel,
    ctor(){
    	this._name = 'user_info'; 
    	this.init();
    },
    properties: {
    	userId:0,
    	authorCode:'',
    	userName:'',
    	userPic:'',
    	wxgame_session_key:'',
    },
    init(){
    	GM.Notify.listen(GM.Event.CMD_USER_INFO, this.onUserInfo, this);
		GM.Notify.listen(GM.Event.CMD_MODULE_TIP, this.onModuleTip, this);
		GM.Notify.listen(GM.Event.CMD_UPDATE_NOTIFY, this.onUpdateNotify, this);
		GM.Notify.listen(GM.Event.CMD_GAME_DATA, this.onGameData, this);
		GM.Notify.listen(GM.Event.CMD_TODO_TASKS, this.onTodoTasks, this);
		GM.Notify.listen(GM.Event.CMD_ROOM_ONLINT_INFO, this.onRoomOnlineInfo, this);
		GM.Notify.listen(GM.Event.CMD_UPDATE_NOTIFY5, this.onUpdateNotify5, this);
    },
    onUserInfo(params){},
    onModuleTip(params){},
    onUpdateNotify(params){},
    onUpdateNotify5(params){},
    onGameData(params){},
    onTodoTasks(params){},
    onRoomOnlineInfo(params){},
    parseSnsData(result){
    	this.userId = result.userId;
        this.userName = result.userName;
        this.userPic = result.purl;
        this.authorCode = result.authorCode;
        this.wxgame_session_key = result.wxgame_session_key;
    },
    destroy(){
		GM.Notify.ignoreAll(this);    		
    },
});
GM.UserInfo = new UserModel();
module.exports = UserModel;
