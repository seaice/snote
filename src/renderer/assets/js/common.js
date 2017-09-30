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

        Vue.prototype.encrypt_token = function(key, iv, data) {
            var crypto = require('crypto')

            var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            cipher.update(data, 'binary', 'base64');
            return cipher.final('base64');
        }

        Vue.prototype.decrypt_token = function(key, iv, data) {
            var crypto = require('crypto')

            var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            decipher.update(data, 'base64', 'binary');
            return decipher.final('binary');
        }
    }
}
