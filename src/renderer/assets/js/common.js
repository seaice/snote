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

        /*
            内容加密
        */
        Vue.prototype.encrypt_note = function(key, iv, data) {
            var crypto = require('crypto')

            var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            cipher.update(data, 'binary', 'base64');
            return cipher.final('base64');
        }

        /*
            内容解密
        */
        Vue.prototype.decrypt_note = function(key, iv, data) {
            var crypto = require('crypto')

            var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            decipher.update(data, 'base64', 'binary');
            return decipher.final('binary');
        }

        /*
            加密uid
        */
        Vue.prototype.encrypt_uid = function(uid) {
            var uuid = 0
            if(uid < 0) {
                return uuid
            }

            uuid = (uid & 0x0000ff00) << 16
            uuid += ((uid & 0xff000000) >> 8) & 0x00ff0000
            uuid += (uid & 0x000000ff) << 8
            uuid += (uid & 0x00ff0000) >> 16
            uuid += uid & 0x7fffffff00000000
            uuid ^= 866491
            return uuid
        }
    }
}
