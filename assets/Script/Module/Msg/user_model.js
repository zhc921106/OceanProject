const BaseModel = require('./base_model');
let UserModel = cc.Class({
	name: 'UserModel',
    extends: BaseModel,
    ctor(){
    	this._name = 'user_info'; 
    },
    properties: {
    	userId:0,
    	authorCode:'',
    	userName:'',
    	userPic:'',
    	wxgame_session_key:'',
    },
    getUserName(){

    },
    parseSnsData(result){
    	this.userId = result.userId;
        this.userName = result.userName;
        this.userPic = result.purl;
        this.authorCode = result.authorCode;
        this.wxgame_session_key = result.wxgame_session_key;
    },
});
GM.UserInfo = new UserModel();
module.exports = UserModel;
