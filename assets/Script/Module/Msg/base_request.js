let BaseRequest = cc.Class({
	name: 'BaseRequest',
	ctor () {

	},
	properties:{
	},
	/*
	*	tcp ok后第一个消息
	*/
	reqBindUser(){
		let cmd = {
            cmd: 'bind_user',
            params: {
                'authorCode': GM.UserInfo.authorCode
            }
        };
        this._sendCmd(cmd);
	},
	reqUserInfo(){
		let cmd = {
			cmd:'user_info',
			params:{},
		};
		this._sendCmd(cmd);	
	},
	reqUser(){
		let cmd = {
			cmd:'user',
			params:{},
		};
		this._sendCmd(cmd);		
	},

	/*
	*	cmd = {cmd:'',params:''}	
	*/
	_sendCmd(cmd){
		if (!cmd.params.hasOwnProperty('userId')) {
            cmd.params['userId'] = GM.UserInfo.userId;
        }
        if (!cmd.params.hasOwnProperty('clientId')) {
            cmd.params['clientId'] = GM.SystemInfo.clientId;
        }
        if (!cmd.params.hasOwnProperty('gameId')) {
            cmd.params['gameId'] = GM.SystemInfo.appId;
        }
        GM.mf.requestMsg(cmd);
	},
});
GM.Req = module.exports = BaseRequest;