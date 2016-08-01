//函数节流
function throttleA(method, context) {
    clearTimeout(method.tid);
    method.tid = setTimeout(function() {
        method.call(context);
    }, 500);
}
/*window.onresize = function(){
	throttle(func,window);
}*/
function throttleB(method, delay) {
    var timer = null;
    return function() {
        var context = this,
            args = arguments;
        timer = clearTimeout(function() {
            method.apply(context, args);
        }, delay);
    }
}
//window.onresize = throttle(func,100);
//
//
function throttleC(method, delay, duration) {
    var timer = null,
        begin = new Date();
    return function() {
        var context = this,
            args = arguments,
            current = new Date();
        if (current - begin >= duration) {
            method.apply(context, args);
        } else {
            timer = clearTimeout(function() {
                method.apply(context, args);
            }, delay);
        }
    }
}

//window.onresize = throttle(func,100,200);
