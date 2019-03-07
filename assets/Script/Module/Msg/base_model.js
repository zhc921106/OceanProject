let BaseModel = cc.Class({
    name: 'BaseModel',
    ctor () {//cmd,data 
        this._cmd = '';
        this._data = '';
        this._name = ''; // name 应该是这个消息结构的唯一标识
        // this._cmd = cmd;
        // this._data = data.result || data;
    },
    properties: {
        name:{
            get(){
                return this._name;
            },
            set(name){
                this._name = name;
            }
        },
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
    },
    parse(cmd,data){
        this._cmd = cmd;
        this._data = data.result || data; 
    },
    getValue(key,defaultValue){
        if(this[key] != undefined){
            return this[key];
        }else if(this._data[key] != undefined){
            return this._data[key];
        }else{
            return defaultValue;
        }
    },
});
module.exports = BaseModel;