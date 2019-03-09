/*
* 1. 基于componet生命周期控制
* 2. 基于自身计时器控制
* 3. 基于对象的计时器控制 即可存在多个 理论上这个设计最好
*/
let MsgFactory = cc.Class({
    name: 'MsgFactory',
    ctor () {
        this._gameid      = 111;
        this._msgkey      = 'GM';  // 当前消息中心标志
        this._modelMap    = {};    // 所有的model数据
        this._sequence    = [];    // 消息队列
        this._isLock      = false; // 锁住消息处理
        this._delay       = 0;     // 延迟处理消息
        this._useSequence = true;  // 是否使用缓存
        this._msgCaches = [];      // 断网时缓存需要发送的消息
        this.init();
    },
    properties: {
        cmd:{
            get(){
                return this._cmd;
            },
            set(cmd){
                this._cmd = cmd;
            },
        },
        data:{
            get(){
                return this._data;
            },
            set(data){
                this._data = data.result || data;
            }
        },
        gameId:{
            get(){
                return this._gameid;
            },
            set(gameid){
                this._gameid = gameid;
            },
        }
    },
    init(){
        GM.Notify.listen(GM.Event.TCP_HEART_BEAT, this._onHeartBeat, this);  
    },
    _onHeartBeat(){
        this._sendHeartBeat();
    },
    _sendHeartBeat(){
        let cmd = {
            'cmd':'heart_beat',
            params: {
                'userId': GM.UserInfo.userId,
                'gameId': GM.SystemInfo.appId,
                'clientId': GM.SystemInfo.clientId,
                'deviceId': GM.SystemInfo.deviceId
            }
        };
        this.requestMsg(cmd);
    },
    /*
    *    是否使用队列
    */
    setQueEnable(enable){
        if (!enable && this.useSequence) {
            // 取消
        } else if (enable &&!this.useSequence ) {
            // 开启
        }
        this._useSequence = enable;
    },

    /*
    *    注册需要监听的协议 暂时不使用 {cmd:'',params:'',result:'',action:''(新增辅助)}
    *    服务器过来的消息 直接 trigger cmd
    *    MsgFactory 监听cmd
    *    protocols = {} key: cmd+'_'+action value: {cmd:'',result:''}
    *    唯一标志 cmd+action 
    */
    regProtocols(protocols){
        let obs = {};
        for (let k in protocols) {
            let proto = protocols[k];
            let cmd   = proto.cmd            
            if (!obs['cmd']) {
                this._regListener(cmd);
                obs['cmd'] = 1;
            }
        }
        this.protocols = protocols;
    },
    _regListener(cmd, handler, scope, once){
        GM.Notify.listen(cmd, this.onResponse, this);
    },

    /*
    *    监听处理所有消息 && 带过滤条件
    */
    onResponse(response){
        cc.error('onResponse',response);
        // 1. check gameid
        // let isGame = response.result && response.result.gameId == this.gameId
        // if(!isGame){return;}
        // 2.check Protocols
        let result = response.result,
            cmd    = response.cmd,
            action = result.action,
            error  = response.error;
        let protoKey = cmd + (action ? '_' + action : '');    
        // let protocol = this.protocols[protoKey];
        // if(!protocol){return;}
        // 3.check error
        if(error){
            cc.error('onResponse error');
            return;
        }
        if(this._useSequence){
            this._addToSequence(response);
            return;
        }
        // 4. 没有使用队列 直接trigger
        let model = this._createModel(protoKey);
        model.parse(response);
        GM.Notify.trigger(protoKey,result); // protocol.notice 注意 trigger的key 可以配置不用写死。
    },

    /*
    *    注册自定义model
    */
    regModels(models){
        for (let key in models) {
            let ModelCtor = models[key];
            if (typeof ModelCtor == 'function') {
                var model = new ModelCtor();
                this._addModel(model);
            }
        }
    },

    /*
    *    断网时的缓存消息
    */
    requestCached(){
        for (let i = 0, len = this._msgCaches.length; i < len; ++i) {
            // this.APP.sendCmd(this._msgCaches[i]);
        }
        this._msgCaches = [];
    },

    /*
    *    缓存协议数据
    */
    _addToSequence(response){
        this._sequence.unshift(response);
    },

    /*
    *    驱动消息处理
    */
    onUpdate(dt){
        if (this._isLock) {
            if (this._delay > 0) {
                this._delay -= dt;
                if (this._delay <= 0) {
                    this._isLock = false;
                }
            }
            return;
        }
        if (this._sequence.length === 0) {
            return;
        }
        this._pop();
    },
    
    /*
    *    从队列后边抛出一个缓存数据
    */
    _pop(){
        let response = this._sequence.pop();
        let cmd      = response.cmd,
            result   = response.result,
            action   = result.action;
        let protoKey = cmd + (action ? '_' + action : '');
        cc.log('pop',protoKey,response);
        // let protocol = this.APP.Protocols[protoKey];
        let model = this._createModel(protoKey);
        model.parse(response);
        GM.Notify.trigger(protoKey,result);
    },

    /*
    *    网络请求发送, 由消息中心处理 交由tcp处理
    */
    requestMsg(cmd){
        // 网络有问题 缓存发送的消息
        if(!GM.sdk.isConnectSdk()){
            this._msgCaches.push(cmd);
            return;
        }
        GM.sdk.sendSdk(cmd);
    },

    /*
    *    根据协议创建model实例
    */
    _createModel(modelName){
        var model = this._modelMap[modelName];
        if (!model) {
            var BaseModel = require('base_model');
            model         = new BaseModel();
            model.name    = modelName;
            this._addModel(model);
        }
        return model;
    },

    /*
    *    获取缓存的model协议
    */
    getModel(modelName){
        return this._modelMap[modelName];
    },

    /*
    *    缓存model对象
    */
    _addModel(model){
        let newModel = model;
        if (typeof model == 'string') {
            var ModelClass = require(model);
            newModel       = new ModelClass();
            // TODO 这里的名字有点问题
            newModel.name  = model;
        }
        this._modelMap[newModel.name] = newModel;
    },

    hasModel(modelName){
        return this._modelMap[modelName] != null;
    },

    removeModel(modelName,isClean){
        this._modelMap[modelName] = null;
        // var model = this._modelMap[modelName];
        // model.destroy();
    },

    /*
    *    清理缓存数据
    */
    cleanMsg(){
        this._sequence = [];
    },

    /*
    *    暂停发送服务器通知
    */
    lock(time){
        if (!this._useSequence) {
            return;
        }
        if (this._isLock) {
            return;
        }
        this._isLock = true;
        this._delay  = time || 0;
    },

    /*
    *    开始发送服务器消息
    */
    unlock(){
        this._isLock = false;
        this._delay  = 0;
    },

    destroy(){
        this._sequence  = [];
        this._msgCaches = [];
        this._modelMap  = {};
        GM.Notify.ignoreAll(this);
    },

});
module.exports = MsgFactory;
