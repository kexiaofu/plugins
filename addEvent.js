function addEvent(obj, type, handle) {
    if (obj.addEventListener) { // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        obj.addEventListener(type, handle, false);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + type, handle);
    } else { // 早期浏览器
        obj['on' + type] = handle;
    }
}
//使用catch可以避免浏览器报错，但是catch较慢