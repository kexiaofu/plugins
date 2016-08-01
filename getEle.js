var allEle = [];
Document.prototype.ele = function(param) {
    if (param.indexOf("#") == 0) return this.getElementById(param.substring(1, param.length));
    if (param.indexOf(".") == 0) {
        if (this.getElementsByClassName) return this.getElementsByClassName(param.substring(1, param.length));
        else {
            var className = param.substring(1, param.length);
            if (allEle.length === 0) {
                allEle = this.getElementsByTagName('*');
            }
            var len = allEle.length;
            for (var i = 0, j = 0; i < len; i++) {
                if (allEle[i].class == className) temp[j++] = allEle[i];
            }
            return temp;
        }
    }
    return this.getElementsByTagName(param);
}