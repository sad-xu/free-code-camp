$(function(){

var mip="";
//var mip=returnCitySN["cip"];   //本机IP
//"http://v.juhe.cn/weather/ip/?ip=58.215.185.154&dtype=json&key=68c9a559a78f64df029bc435ecc6ab95 ";
//var cip="58.215.185.154";  //测试IP

//查询字符串的名称和值都需要编码
function addURLParam(url,name,value){   
	url+=(url.indexOf("?") == -1 ? "?" : "&" );
	url+=encodeURIComponent(name)+"="+encodeURIComponent(value);
	return url;
}



var url="http://v.juhe.cn/weather/ip";
//URL整合
function seturl(u){
	u=addURLParam(u,"dtype","json");
	u=addURLParam(u,"key","68c9a559a78f64df029bc435ecc6ab95");
	u=addURLParam(u,"ip",mip);
	return u;
}


/*失败 原因未知
function back(data){
	var ntemp=data.result.sk.temp;
	$("#box").html(ntemp+"摄氏度");
}

url=addURLParam(url,"callback","back");

var jsonp=document.createElement("script"); 
jsonp.type="text/javascript";
jsonp.src=url;

//jsonp=jsonp.replace(/<\/?.+?>/g,"");
//jsonp=jsonp.replace(/ /g,"");
//jsonp=JSON.stringify(jsonp);

$("body").append(jsonp)
*/


//可行
function back(data){  //回调函数
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
	$("#box ul li img").attr("src",wsrc);	
}

$("#re").click(function(){
	$.get(url,back,'jsonp');
})//.click()

/*
if ($("#temp").text()=="") {  //没有当前IP天气信息，更换测试IP
	setTimeout(function(){
		$("#ID").text(cip);
		$("#ID").prev().text("测试IP：");
		$.get(testurl,back,'jsonp');
	},1000)
}*/


})