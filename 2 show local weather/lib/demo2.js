$(function(){

var mip="";
var url="http://v.juhe.cn/weather/ip";
var flag=1;

//检查格式
function iszz(ip){  
	var zz= /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/ ;
	return zz.test(ip);
}

//查询字符串的名称和值都需要编码
function addURLParam(url,name,value){   
	url+=(url.indexOf("?") == -1 ? "?" : "&" );
	url+=encodeURIComponent(name)+"="+encodeURIComponent(value);
	return url;
}

//URL整合
function seturl(u){
	u=addURLParam(u,"dtype","json");
	u=addURLParam(u,"key","68c9a559a78f64df029bc435ecc6ab95");
	u=addURLParam(u,"ip",mip);
	return u;
}


//回调函数
function back(data){  
	if (data.result==null) {
		return;
	}
	var sk=data.result.sk;
	var temp=sk.temp; //温度
	var wid=sk.wind_strength; //风力
	var humidity=sk.humidity; //湿度
	var time=sk.time;

	var td=data.result.today;
	var city=td.city;
	var weatherid=td.weather_id.fa;//天气标识

	$("#city").text(city);
	$("#temp").text(temp+"℃");
	$("#wid").text(wid);
	$("#hum").text(humidity);

	time=time.slice(0,time.indexOf(":"));
	var dn="";
	if (time>6&&time<20) {
		dn="d";
	}else
		dn="n";

	wsrc="weather_icon/"+dn+weatherid+".gif";
	$("#weather img").attr("src",wsrc);	
}




$("#ID").focus(function(){
	if($(this).val()==this.defaultValue){
		$(this).val("");
	}
}).blur(function(){
	if ($(this).val()=="") {
		$(this).val(this.defaultValue);
	}
})

$("#re").click(function(){ //提交
	mip=$("#ID").val();
	if (iszz(mip)==false){
		alert("可能一.IP格式不对，示例：58.215.185.154；可能二.检测错误，请联系我");
		return false;
	}

	murl=seturl(url);
	$.get(murl,back,'jsonp');

	setTimeout(function(){
		if ($("#temp").text()=="") {
			$("#warn").text("抱歉，暂时没有此IP下的天气数据，换个试试？")
	}},1000)
	
})









})