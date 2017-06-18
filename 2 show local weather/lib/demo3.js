var btn = document.getElementById("XHC");
var input = document.getElementById("xhc");

var appKey = "c25a25230db8711a20c25adf1f938bdf";
var ip = "";

//查询字符串的名称和值都需要编码
function addURLParam(url,name,value){   
	url += (url.indexOf("?") == -1 ? "?" : "&" );
	url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
	return url;
}


function XHR (url) {
	var xhr = new XMLHttpRequest();
	xhr.onreadyststechange = function () {
		if (xhr.readyState === 4) {
			if ((xhr.state >= 200 && xhr.state < 300) || xhr.state == 304) {
				alert(xhr.responseText);
			} else {
				alert("unsuccessful" + xhr.state);
			}
		}
	};

	xhr.open("get", url, true);
	xhr.send(null);	
}




btn.addEventListener("click" ,function () {
	var URL = "http://apis.juhe.cn/ip/ip2addr";
	URL = addURLParam(URL, "key", appKey);
	URL = addURLParam(URL, "dtype", "json");

	ip = input.value;
	URL = addURLParam(URL, "ip", ip);

	XHR(URL);
},false);