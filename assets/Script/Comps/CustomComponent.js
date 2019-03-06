let CustomComponent = cc.Class({
	name: '',
    extends: cc.Component,
    // editor: CC_EDITOR && {
    //     executeInEditMode: true,
    //     disallowMultiple: true
    // },
    properties: {
        isCache: true,

    },
    log(){
        let arr = [this.name];
        for(let i = 0, len = arguments.length; i < len; i++){
            arr.push(arguments[i]);
        }
        cc.log.apply(null,arr);
        // cc.log(this.name,cc.js.formatStr.apply(null, arguments));
    },
    err(){
        let arr = [this.name];
        for(let i = 0, len = arguments.length; i < len; i++){
            arr.push(arguments[i]);
        }
        cc.error.apply(null,arr);
    	// cc.error(this.name,cc.js.formatStr.apply(null, arguments));
    },
    // onLoad (){},
    /*
    *    通知视图管理器
    */
    close(){
        if(this.isCache){
            this.node.active = false;
            // GM.vm.checkActivePop(this.node);
            GM.vm._checkDeadPop(this.node);
            return;    
        }
        GM.vm._checkDeadPop(this.node);
        this.node.destroy();
    },
    
});
module.exports = CustomComponent;
