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
    }
}
