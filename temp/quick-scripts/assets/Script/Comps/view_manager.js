(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Comps/view_manager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7b1aea9mBhA04Sb856AWsab', 'view_manager', __filename);
// Script/Comps/view_manager.js

'use strict';

/*
* 1. 网络连接菊花
* 2. 预制体加载进入菊花
* 3. 重要确定弹窗 
*	以上全部在最上层
*/
var vm = {
    _zorder: 100,
    _cacheArr: {}, // 已经缓存过的预制体  key(url)  value(当前节点)     ok
    _activeArr: {}, // 当前父节点激活的 子节点 key(父节点) value([显示队列]) 需要在激活时，隐藏销毁时，检查下 ok
    _waitArr: [], // 当前在等待显示的队列。

    init: function init() {},


    /*
    *	assetUrl: 预制体路径,
    *	params: 所需参数,
    *	parent: 当前Node父节点
    */
    openPrefab: function openPrefab(assetUrl, params, parentReal, callback) {
        var _this = this;

        var scene = this._checkScene();
        if (!scene) {
            cc.error('VM not scene');return;
        }
        var parent = parentReal || scene;
        var pos = parentReal ? cc.v2(0, 0) : cc.v2(568, 320);
        var node = this._checkCache(assetUrl);
        if (node) {
            // TODO 直接激活节点
            cc.warn('VM getCache', assetUrl);
            this._showPrefab(node, params, parent, assetUrl);
            node.setPosition(pos);
            callback && callback();
            return;
        }
        var prefab = cc.loader.getRes(assetUrl);
        if (prefab) {
            // TODO 
            cc.warn('VM getRes', assetUrl);
            node = this._addPrefab(prefab, params, parent, assetUrl);
            node.setPosition(pos);
            callback && callback();
            return;
        }
        cc.warn('VM loadRes', assetUrl);
        cc.loader.loadRes(assetUrl, cc.Prefab, function (completedCount, totalCount) {
            // TODO 加载进度更新

        }, function (err, prefab) {
            // TODO 加载更新完成

            if (err) {
                // TODO 发生错误
                return;
            }
            node = _this._addPrefab(prefab, params, parent, assetUrl);
            node.setPosition(pos);
            callback && callback();
        });
    },


    /*
    * vm_cache {url1:{name1:parent1,name2:parent2},url2:{name1:parent1}}
    */
    _checkCache: function _checkCache(assetUrl) {
        var node = this._cacheArr[assetUrl];
        if (node) {
            if (!cc.isValid(node)) {
                return null;
            }
            return node;
        }
        return null;
    },
    _pushCache: function _pushCache(assetUrl, node) {
        this._cacheArr[assetUrl] = node;

        // 测试打印
        for (var k in this._cacheArr) {
            cc.log('VM ', 'url:' + k, 'name:' + this._cacheArr[k].name); // node name
        }
    },
    _clearCache: function _clearCache(assetUrl) {
        if (assetUrl) {
            delete this._cacheArr[assetUrl];
            return;
        }
        this._cacheArr = {};
    },


    /*
    *    激活显示当前预制体
    */
    _showPrefab: function _showPrefab(node, params, parent, assetUrl) {
        if (node.parent != parent) {
            node.parent = parent;
        }
        node.zIndex = this._getZorder();
        node.active = true;
        this._actComp(node, params, assetUrl);
        return node;
    },
    _addPrefab: function _addPrefab(prefab, params, parent, assetUrl) {
        var node = cc.instantiate(prefab);
        node.zIndex = this._getZorder();
        node.parent = parent;
        this._actComp(node, params, assetUrl);
        return node;
    },
    _actComp: function _actComp(node, params, assetUrl) {
        var scripts = node.getComponents(cc.Component).filter(function (component) {
            return component.__classname__.indexOf('cc.') !== 0;
        });
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            script.init && script.init(params);
        }
        this._pushCache(assetUrl, node);

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
    openQueuePrefab: function openQueuePrefab(assetUrl, params, parentReal, callback) {
        var item = {
            assetUrl: assetUrl,
            params: params,
            parentReal: parentReal,
            callback: callback
        };
        this._pushWait(item);
        if (this._waitArr.length == 1) {
            this.openPrefab(assetUrl, params, parentReal, callback);
        }
    },
    _pushWait: function _pushWait(item) {
        this._waitArr.push(item);
        if (this._waitArr.length > 1) {
            var len = this._waitArr.length;
            var _item = this._waitArr[len - 1];
            this._quietLoadAsset(_item.assetUrl);
        }
    },
    popWait: function popWait() {
        this._waitArr.shift();
        if (this._waitArr.length > 0) {
            var item = this._waitArr[0];
            this.openPrefab(item.assetUrl, item.params, item.parentReal, item.callback);
        }
    },


    /*
    *    当前激活队列
    */
    checkActivePop: function checkActivePop(node) {
        if (!node.getComponent('dialog_comp')) {
            return;
        }
        var parent = node.parent;
        var popArr = [];
        for (var i = 0; i < parent.children.length; i++) {
            var child = parent.children[i];
            if (child.active && child.getComponent('dialog_comp')) {
                popArr.push(child.getComponent('dialog_comp'));
            }
        }
        var len = popArr.length;
        if (len > 1) {
            popArr.sort(function (compa, compb) {
                return compb.node.zIndex - compa.node.zIndex; //降序 105,104,103,102
            });
            for (var _i = 1; _i < popArr.length; _i++) {
                var comp = popArr[_i];
                comp.resetOpacity(0);
                cc.error(comp.name, comp.node.zIndex);
            }
        }
        if (popArr[0]) {
            popArr[0].resetOpacity();
        }
    },
    _checkActivePop: function _checkActivePop(node) {
        if (!node.dialog) {
            return;
        }
        var parent = node.parent;
        var arr = this._activeArr[parent.name] || [];
        arr.push(node);
        if (arr.length == 1) {
            arr[0].dialog.resetOpacity();
            this._activeArr[parent.name] = arr;
            return;
        }
        arr.sort(function (na, nb) {
            return nb.zIndex - na.zIndex; //降序 105,104,103,102
        });
        for (var i = 1; i < arr.length; i++) {
            var pop = arr[i];
            pop.dialog.resetOpacity(0);
        }
        arr[0].dialog.resetOpacity();
    },
    _checkDeadPop: function _checkDeadPop(node) {
        this.popWait();
        if (!node.dialog) {
            return;
        }
        var parent = node.parent;
        var arr = this._activeArr[parent.name] || [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == node) {
                arr.splice(i, 1);
                break;
            }
        }
        arr.sort(function (na, nb) {
            return nb.zIndex - na.zIndex; //降序 105,104,103,102
        });
        if (arr[0]) {
            arr[0].dialog.resetOpacity();
        }
        this._activeArr[parent.name] = arr;
    },


    /*
    *  辅助类
    */
    _checkScene: function _checkScene() {
        var scene = cc.director.getScene();
        return scene;
    },
    _getZorder: function _getZorder() {
        return this._zorder++;
    },


    /*
    * 静默加载预制体。
    */
    _quietLoadAsset: function _quietLoadAsset(assetUrl) {
        if (cc.loader.getRes(assetUrl)) {
            return;
        }
        cc.loader.loadRes(assetUrl, function (error, prefab) {});
    }
};
GM.vm = module.exports = vm;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=view_manager.js.map
        