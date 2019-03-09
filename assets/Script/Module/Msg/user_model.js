const BaseModel = require('./base_model');
let UserModel = cc.Class({
    name: 'UserModel',
    extends: BaseModel,
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
module.exports = UserModel;
GM.UserInfo = new UserModel();