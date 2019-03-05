(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Comps/CustomComponent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f622cyy2vxJ3pw6UKmY/djs', 'CustomComponent', __filename);
// Script/Comps/CustomComponent.js

'use strict';

var CustomComponent = cc.Class({
    name: '',
    extends: cc.Component,
    // editor: CC_EDITOR && {
    //     executeInEditMode: true,
    //     disallowMultiple: true
    // },
    properties: {
        isCache: true

    },
    log: function log() {
        cc.log(this.name, cc.js.formatStr.apply(null, arguments));
    },
    err: function err() {
        cc.error(this.name, cc.js.formatStr.apply(null, arguments));
    },

    // onLoad (){},
    /*
    *    通知视图管理器
    */
    close: function close() {
        if (this.isCache) {
            this.node.active = false;
            // GM.vm.checkActivePop(this.node);
            GM.vm._checkDeadPop(this.node);
            return;
        }
        GM.vm._checkDeadPop(this.node);
        this.node.destroy();
    }
});
module.exports = CustomComponent;

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
        //# sourceMappingURL=CustomComponent.js.map
        