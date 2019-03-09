const cfg = GM.cfg;
const util = GM.util;
const vm = GM.vm;
cc.Class({
    extends: require("CustomComponent"),
    properties: {
        top_prefab:cc.Prefab,
    },
    onLoad () {
        this._regEvts();
        this._initPersist();
        this._init();
    },
    onClickTest(event,custom){
        cfg.GM_DEBUG && this.log('onClickTest',custom);
        if(custom == 1){
            // let params = {vKey:'Shop_View',data:{'shop':1}};
            // GM.Notify.trigger(GM.Event.GM_UI_REPLACE_FULL_VIEW,params);
        }else if(custom == 2){
            // 1. 网络请求(快_派发出去) 2. 打开页面(快_成功后取下数据)
            GM.sdk.guestLogin(GM.util.getLocalUUID());
        }else if(custom == 3){  
            GM.mf.dumpModelMap();
            let model = GM.mf.getModel('user_info');
            this.log(model.name,model.cmd);
            model = GM.mf.getModel('room_online_info');
            this.log(model.name,model.cmd);
        }else if(custom == 4){
            vm.openPrefab('Prefabs/Pop/Hall_Pop_Confirm',{'hi':1});
            vm.openQueuePrefab('Prefabs/Pop/Hall_Pop_Turn',{'hi':1});
            vm.openQueuePrefab('Prefabs/Pop/Hall_Pop_Confirm',{'hi':1});
            vm.openQueuePrefab('Prefabs/Pop/Hall_Pop_Turn',{'hi':1});
            vm.openQueuePrefab('Prefabs/Pop/Hall_Pop_Activity',{'hi':1});
        }
    },
    /*
    *    网络服务
    */
    _onTcpClose(){
        this.log('_onTcpClose',util.getTime());
    },
    _onTcpOpened(){
        this.log('_onTcpOpened',util.getTime());
        GM.Req.reqBindUser();
    },
    _onTcpError(){
        this.log('_onTcpError');
    },
    _onLogout(){
        this.log('_onLogout');
    },
    _onSDKLoginFail(){
        this.log('_onSDKLoginFail');
    },
    _onSDKLoginSuccess(response){
        this.log('_onSDKLoginSuccess');
        GM.sdk.startTcp();
    },
    _regEvts(){
        GM.Notify.listen(GM.Event.GM_UI_REPLACE_FULL_VIEW, this.onPopView, this);

        GM.Notify.listen(GM.Event.SDK_LOGIN_FAIL,this._onSDKLoginFail,this);
        GM.Notify.listen(GM.Event.SDK_LOGIN_SUCCESS,this._onSDKLoginSuccess,this);
        GM.Notify.listen(GM.Event.TCP_CLOSE,this._onTcpClose, this);
        GM.Notify.listen(GM.Event.TCP_OPENED,this._onTcpOpened, this);  
        GM.Notify.listen(GM.Event.TCP_ERROR,this._onTcpError,this);
        GM.Notify.listen(GM.Event.TCP_LOGOUT,this._onLogout,this);
        
        GM.Notify.listen(GM.Event.UPDATE_UER_INFO_LOC, this._onUserInfo, this);
    },

    /*
    *    显示全屏view {assetUrl:'',vKey:'',data:{}}
    */
    onPopView(params){
        let tcfg = {
            'Hall_View':'Prefabs/Hall/Hall_View',  // key node节点的名字 value 预制体地址
            'Shop_View':'Prefabs/Shop/Shop_View',
            'Match_View':'Prefabs/Match/Match_View',
        };
        let assetUrl = tcfg[params.vKey];
        let param = params.data || {};
        vm.openPrefab(assetUrl,param,this._pview,()=>{
            this._checkFullView(params.vKey);
        });
        
    },
    _checkFullView(vname){
        let children = this._pview.children;
        let len = children.length;
        if(len == 1){return;}
        for(let i = 0; i < len; i++){
            let child = children[i];
            if(child.name == vname){
                child.active = true;
            }else{
                child.active = false;
            }
        }
    },

    /*
    *     scene 变量
    */
    _init(){
        this._bgsp = this.node.getChildByName('bg_sp').getComponent(cc.Sprite);   // scene bg
        this._pview = this.node.getChildByName('pop_view');                       // scene full view parent

    },

    /*
    *    scene 更换背景
    */
    _replaceBg(spf){
        this._bgsp.spriteFrame = spf;
    },

    /*
    *    常驻点 层级最高    
    */
    _initPersist(){
        let node = cc.instantiate(this.top_prefab);
        let scene = util.getScene();
        node.zIndex = util.max_zindex;
        node.parent = scene;
    },
    // start () {},
    // onEnable (){},
    // onDestroy (){},
    // onDisable(){},
    // update (dt) {},
    // 一些全局的通知 公告 应该属于scene
});