let BaseModel = cc.Class({
    name: 'BaseModel',
    ctor () {
        this._cmd = '';
        this._data = '';
        this._name = 'base_model'; // name 应该是这个消息结构的唯一标识
        this._action = '';
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
    parse(response){
        if(response.result) {
            this._data   = response.result;
            this._cmd    = response.cmd;
            this._action = this._data.action;
        } else {
            this._data = response;
        }
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