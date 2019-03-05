let util = {
    // property
    max_zindex:Math.pow(2, 15)-1000,
    
    // function
    getScene(){
        return cc.director.getScene();
    },
};
GM.util = util;
/*
    cc.js.formatStr.apply(null, arguments)

*/