
var map = new BMap.Map("container");  // 初始化实例
map.setMapStyle({style:'hardedge'});  // 地图风格
map.enableScrollWheelZoom(true);      // 滚轮缩放
map.setMinZoom(17); // 最小缩放级别
map.centerAndZoom(new BMap.Point(116.404, 39.915 ), 18);   // 初始位置

// 覆盖物类
function Covers (url) {
	this.url = url;
	this.mk = null;
	this.point = null;
	this.isInit = false;  // 是否已初始化
}
Covers.prototype = {
	init : function (w, h) {
		var myIcon = new BMap.Icon(this.url, new BMap.Size(w,h), {
			imageOffset: new BMap.Size(0,0)
		});  // 图标实例
		myIcon.setImageSize(new BMap.Size(w,h)); 
		this.mk = new BMap.Marker(this.point, {icon:myIcon});   // 覆盖物实例
		this.isInit = true;
	}
};
var pkq = new Covers('map/pkq.gif'),   // 皮卡丘
		me = new Covers('map/Mario.png');     // 小智

// 缩放事件
map.addEventListener('zoomend', function() {
	var zoom = map.getZoom();
	console.log(zoom);
});


// 添加定位控件
var geolocationControl = new BMap.GeolocationControl({
	locationIcon: (function() {
		var _myHead = new BMap.Icon('map/1.jpg', new BMap.Size(16,16));
		_myHead.setImageSize(new BMap.Size(16,16));
		return _myHead;
	})()		
});

geolocationControl.addEventListener('locationSuccess', function(e) {
	console.log('locationSuccess,');
	if (!pkq.isInit) {
		pkq.point = new BMap.Point(e.point.lng + 0.00005, e.point.lat + 0.00005);
		pkq.init(66,52);
		map.addOverlay(pkq.mk);  // 添加覆盖物
	}
	if (!me.isInit) {
		me.point = e.point;
		me.init(20,20);
		map.addOverlay(me.mk);
	}
	me.point = e.point;   // 更新位置信息
	
	map.panTo(e.point);  // 更改地图中点
	map.setZoom(18);     // 放大级别
});
geolocationControl.addEventListener('locationError', function(e) {
	alert('定位失败：' + e.StatusCode);
});

map.addControl(geolocationControl); 
geolocationControl.location();    // 定位


// 每隔一段时间定位一次，判断位置
function loop() {  
	geolocationControl.location();

	if (isCatched(pkq, me)) {
		alert('get it!')
	} else {
		setTimeout(loop, 10000);
	}
}

function isCatched(a, b) {
	var lng = a.point.lng - b.point.lng,
			lat = a.point.lat - b.point.lat;
	var x = Math.sqrt(lng * lng + lat * lat).toFixed(4);
	console.log(x);
	if (x <= 0.0001) {
		return true;
	}
	return false;
}

