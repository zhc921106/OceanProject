/*
* 1. 网络连接菊花
* 2. 预制体加载进入菊花
* 3. 重要确定弹窗 
*	以上全部在最上层
*/
let vm = {
    _zorder:100,
    _cacheArr:{},  // 已经缓存过的预制体  key(url)  value(当前节点)     ok
    _activeArr:{}, // 当前父节点激活的 子节点 key(父节点) value([显示队列]) 需要在激活时，隐藏销毁时，检查下 ok
    _waitArr:[],   // 当前在等待显示的队列。
    	
	init(){
	}, 	

    /*
    *	assetUrl: 预制体路径,
    *	params: 所需参数,
    *	parent: 当前Node父节点
    */
    openPrefab(assetUrl,params,parentReal,callback){
    	let scene = this._checkScene();
    	if(!scene){ cc.error('VM not scene'); return;}
    	let parent = parentReal || scene;
        let pos = parentReal ? cc.v2(0,0) : cc.v2(568,320);
    	let node = this._checkCache(assetUrl);
    	if(node){
    		// TODO 直接激活节点
            cc.warn('VM getCache',assetUrl);
    		this._showPrefab(node,params,parent,assetUrl);
            node.setPosition(pos);
            callback && callback();
    		return;
    	}
    	let prefab = cc.loader.getRes(assetUrl);
    	if(prefab){
    		// TODO 
            cc.warn('VM getRes',assetUrl);
			node = this._addPrefab(prefab,params,parent,assetUrl);
            node.setPosition(pos);
            callback && callback();
			return;
    	}
        cc.warn('VM loadRes',assetUrl);
    	cc.loader.loadRes(assetUrl,cc.Prefab,(completedCount, totalCount)=>{
    		// TODO 加载进度更新

    	},(err,prefab)=>{
    		// TODO 加载更新完成

    		if(err){
    			// TODO 发生错误
    			return;
    		}
    		node = this._addPrefab(prefab,params,parent,assetUrl);
            node.setPosition(pos);
            callback && callback();
    	});
    },

    /*
    * vm_cache {url1:{name1:parent1,name2:parent2},url2:{name1:parent1}}
    */
    _checkCache(assetUrl){
        let node = this._cacheArr[assetUrl];
        if(node){
            if(!cc.isValid(node)){
                return null;
            }
            return node;
        }
        return null;
    },
    _pushCache(assetUrl,node){  
        this._cacheArr[assetUrl] = node;

        // 测试打印
        for(let k in this._cacheArr){
            cc.log('VM ','url:'+k,'name:'+this._cacheArr[k].name); // node name
        }
    },
    _clearCache(assetUrl){
        if(assetUrl){
            delete this._cacheArr[assetUrl];
            return;
        }
        this._cacheArr = {};
    },

    /*
    *    激活显示当前预制体
    */
    _showPrefab(node,params,parent,assetUrl){
        if(node.parent != parent){
            node.parent = parent;
        }
		node.zIndex = this._getZorder();
		node.active = true;
        this._actComp(node,params,assetUrl);
        return node;
    },
    _addPrefab(prefab,params,parent,assetUrl){
    	let node = cc.instantiate(prefab);
    	node.zIndex = this._getZorder();
        node.parent = parent;
        this._actComp(node,params,assetUrl);
        return node;
    },
    _actComp(node,params,assetUrl){
        let scripts = node.getComponents(cc.Component).filter(function (component) {
            return component.__classname__.indexOf('cc.') !== 0;
        });
        for(let i = 0; i < scripts.length; i++){
            let script = scripts[i];
            script.init && script.init(params);
        }
        this._pushCache(assetUrl,node);

        // 做一些check
        this._checkActivePop(node);
        

        // 测试打印
        // let scene = this._checkScene();
        // for(let i = 0; i < scene.children.length; i++){
        //     let child = scene.children[i];
        //     cc.error('current scene child-',child.name,child.zIndex);
        // }
        
    },

    /*
    *    等待预制队列
    */
    openQueuePrefab(assetUrl,params,parentReal,callback){
        let item = {
            assetUrl:assetUrl,
            params:params,
            parentReal:parentReal,
            callback:callback,
        };
        this._pushWait(item);
        if(this._waitArr.length == 1){
            this.openPrefab(assetUrl,params,parentReal,callback);
        }
    },
    _pushWait(item){
        this._waitArr.push(item);
        if(this._waitArr.length > 1){
            let len = this._waitArr.length;
            let item = this._waitArr[len-1];
            this._quietLoadAsset(item.assetUrl);
        }
    },
    popWait(){
        this._waitArr.shift();
        if(this._waitArr.length > 0){
            let item = this._waitArr[0];
            this.openPrefab(item.assetUrl,item.params,item.parentReal,item.callback);
        }
    },

    /*
    *    当前激活队列
    */
    checkActivePop(node){
        if(!node.getComponent('dialog_comp')){return;}
        let parent = node.parent;
        let popArr = [];
        for(let i = 0; i < parent.children.length; i++){
            let child = parent.children[i];
            if(child.active && child.getComponent('dialog_comp')){
                popArr.push(child.getComponent('dialog_comp'));
            }
        }
        let len = popArr.length;
        if(len > 1){
            popArr.sort((compa,compb)=>{
                return compb.node.zIndex - compa.node.zIndex; //降序 105,104,103,102
            });
            for(let i = 1; i < popArr.length; i++){
                let comp = popArr[i];
                comp.resetOpacity(0);
                cc.error(comp.name,comp.node.zIndex);
            }
        }
        if(popArr[0]){popArr[0].resetOpacity();}
    },
    _checkActivePop(node){
        if(!node.dialog){return;}
        let parent = node.parent;
        let arr = this._activeArr[parent.name] || [];
        arr.push(node);
        if(arr.length == 1){
            arr[0].dialog.resetOpacity();
            this._activeArr[parent.name] = arr;
            return;
        }
        arr.sort((na,nb)=>{
            return nb.zIndex - na.zIndex; //降序 105,104,103,102
        });
        for(let i = 1; i < arr.length; i++){
            let pop = arr[i];
            pop.dialog.resetOpacity(0);
        }
        arr[0].dialog.resetOpacity();
    },
    _checkDeadPop(node){
        this.popWait();
        if(!node.dialog){return;}
        let parent = node.parent;
        let arr = this._activeArr[parent.name] || [];
        for(let i = 0; i < arr.length; i++){
            if(arr[i] == node){
                arr.splice(i,1);
                break;
            }
        }
        arr.sort((na,nb)=>{
            return nb.zIndex - na.zIndex; //降序 105,104,103,102
        });
        if(arr[0]){arr[0].dialog.resetOpacity();}
        this._activeArr[parent.name] = arr;
    },

    /*
    *  辅助类
    */
    _checkScene(){
        let scene = cc.director.getScene();
        return scene;
    },
    _getZorder(){
        return this._zorder++;
    },

    /*
    * 静默加载预制体。
    */
    _quietLoadAsset(assetUrl){
        if(cc.loader.getRes(assetUrl)){return;}
    	cc.loader.loadRes(assetUrl, (error,prefab)=>{});
    },
};
GM.vm = module.exports = vm;