function addEvent(obj, type, handle) {
    if (obj.addEventListener) { // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        obj.addEventListener(type, handle, false);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + type, handle);
    } else { // 早期浏览器
        obj['on' + type] = handle;
    }
}

function touchM(etype, fn) {
    switch (etype) {
        case "touchstart":
            addEvent(window, touchstart, fn);
            break;
        case "touchmove":
            addEvent(window, touchstart, fn);
            break;
        case "touchend":
            addEvent(window, touchstart, fn);
            break;
        default:
            return;
            break;
    }
}