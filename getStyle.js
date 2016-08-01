function getStyle(obj,prop){
	if(window.getComputedStyle){
		prop = prop.replace(/[A-Z]/g,'-$1');
		prop = prop.toLowerCase();
		return window.getComputedStyle(obj,null).getPropertyValue(prop);
	}else if(obj.currentStyle){
		return obj.currentStyle(prop);
	}
	return null;
}