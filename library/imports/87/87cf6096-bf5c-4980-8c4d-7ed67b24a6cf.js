"use strict";
cc._RF.push(module, '87cf6CWv1xJgIxNftZ7JKbP', 'dialog_comp');
// Script/Comps/dialog_comp.js

'use strict';

/*================================================================
 * FileName dialog_comp
 * Description 弹框统一设置
 * Created on 05/03/19 by ocean
 * Copyright (c) 2019 OCEAN
================================================================*/
cc.Class({
    extends: cc.Component,
    properties: {
        isEmpty: {
            default: true,
            tooltip: '是否点击空白处关闭'
        },
        windNode: {
            default: null,
            tooltip: '背景窗口节点',
            type: cc.Node
        },
        animTime: {
            default: 0,
            tooltip: '背景弹窗动画时间',
            type: cc.Integer
        },
        _darkNode: cc.Node,
        _darkOpac: 160

    },
    init: function init(params) {
        params.isEmpty != undefined && (this.isEmpty = params.isEmpty);
    },
    onLoad: function onLoad() {
        this.node.dialog = this; // 重要
        this._bgBox = null;
        this._comp = null;
        this._initBgbox();
        this._initDark();
    },
    _initBgbox: function _initBgbox() {
        if (!this.windNode) {
            cc.error('dialog no windNode');return;
        }
        var box = this.windNode.getBoundingBox();
        this._bgBox = box;
        this._comp = this.node.getComponent('CustomComponent');
    },
    _initDark: function _initDark() {
        var _this = this;

        var loadDone = function loadDone(prefab) {
            if (!cc.isValid(_this.node)) {
                cc.error('dialog this.node is destoryed');return;
            }
            var node = cc.instantiate(prefab);
            _this.node.addChild(node, -1);
            _this._darkNode = node;
            node.on(cc.Node.EventType.TOUCH_END, _this.onTouchDarkNode, _this);
        };
        var prefab = cc.loader.getRes('Prefabs/Ui_Groups/dark_node');
        if (prefab) {
            loadDone(prefab);
        } else {
            cc.loader.loadRes('Prefabs/Ui_Groups/dark_node', function (err, prefab) {
                if (err) {
                    cc.error('dialog' + err);return;
                }
                loadDone(prefab);
            });
        }
    },
    onTouchDarkNode: function onTouchDarkNode(touch) {
        if (!this.isEmpty) {
            return;
        }
        if (!this.windNode) {
            cc.error('dialog no windNode');return;
        }
        var loc = touch.getLocation();
        var box = this._bgBox;
        var comp = this._comp;
        loc = this.windNode.convertToNodeSpaceAR(loc);
        if (!box.contains(loc)) {
            comp && comp.close();
        }
    },

    // _regEvts(){},
    // _close(){},
    // start () {},
    onEnable: function onEnable() {
        if (this.animTime == 0) {
            return;
        }
        this.windNode.scale = 0.5;
        this.windNode.runAction(cc.scaleTo(this.animTime, 1).easing(cc.easeBackOut()));
    },
    resetOpacity: function resetOpacity(opa) {
        if (this._darkNode && cc.isValid(this._darkNode)) {
            opa = opa == undefined ? this._darkOpac : 0;
            this._darkNode.opacity = opa;
        }
    }
}
// onDestroy (){},
// onDisable(){},
// update (dt) {},
);

cc._RF.pop();