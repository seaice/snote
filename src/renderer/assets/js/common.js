export default {
    install : function (Vue, options) {
        Vue.prototype.isNull = function (data, trim=true){
            if (data == undefined || data == null) {
                return true
            }

            if(trim === true && typeof(data) == 'string') {
                if(data.trim().length == 0) {
                    return true
                }
            }

            return false
        }

        Vue.prototype.filterStr = function (str) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");  
            var specialStr = "";  
            for(var i=0;i<str.length;i++)  
            {  
                 specialStr += str.substr(i, 1).replace(pattern, '');   
            }  
            return specialStr;  
        }  
    }
}
