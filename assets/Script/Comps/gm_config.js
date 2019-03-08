/*
* 开关
*/
let cfg = {
    'GM_DEV':1,
    'GM_DEBUG':1,
};
let StateInfo = {
	'isOnForeground': false,
};
let SystemInfo = {
	'webSocketUrl':'',
	'loginUrl':'https://fzfz.mnbgame666.com/',
	'appId':9999,
	'gameId':720,
	'clientId':'H5_5.1_weixin,tyGuest.alipayweb.0-hall720.tuyouxcx.shanxixcx',
	'guestWxAppId':'wx6ac3f5090a6b99c5',
};
let UserInfo = {
	userId:'111',
	authorCode:'',

};
GM.cfg = cfg;
GM.StateInfo = StateInfo;
GM.SystemInfo = SystemInfo;
GM.UserInfo = UserInfo;
/*
*  GM: 全局
*  GM.vm          视图管理
*  GM.sm          声音管理
*  GM.cfg         配置文件
*  GM.StateInfo   一堆配置信息
*  GM.SystemInfo  一堆配置信息
*  GM.util        工具类
*  GM.Notify      通知中心
*  GM.Event       事件名称
*  GM.Http        http请求
*  GM.Tcp         普通tcp
*  GM.TcpWx       微信tcp
*  GM.Timer       定时器
*  GM.sdk         登陆网路连接相关
*  GM.mf          消息队列分发
*  GM.Req         发消息中心
*  
*  
*  
*  
*/


