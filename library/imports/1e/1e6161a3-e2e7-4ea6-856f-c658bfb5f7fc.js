"use strict";
cc._RF.push(module, '1e616Gj4udOpoVvxli/tff8', 'gm_util');
// Script/Comps/gm_util.js

"use strict";

var util = {
    // property
    max_zindex: Math.pow(2, 15) - 1000,

    // function
    getScene: function getScene() {
        return cc.director.getScene();
    }
};
GM.util = util;
/*
    cc.js.formatStr.apply(null, arguments)

*/

cc._RF.pop();