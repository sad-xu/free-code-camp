
var colorWrapper = document.getElementsByClassName('color-wrapper')[0];
var onOff = document.getElementsByClassName('onoff')[0];		 // 电源开关
var startButton = document.getElementsByClassName('start-button')[0]; // 开始按钮
var count = document.getElementsByClassName('count')[0];  	 // 计数
var wrapper = document.getElementsByClassName('wrapper')[0]; // 遮罩

var color0 = document.getElementsByClassName('color0')[0];
var color1 = document.getElementsByClassName('color1')[0];
var color2 = document.getElementsByClassName('color2')[0];
var color3 = document.getElementsByClassName('color3')[0];

var sound0 = new Audio("https://www.freecodecamp.cn/images/simonSound1.mp3"); //0.418
var sound1 = new Audio("https://www.freecodecamp.cn/images/simonSound2.mp3"); //0.444
var sound2 = new Audio("https://www.freecodecamp.cn/images/simonSound3.mp3"); //0.418
var sound3 = new Audio("https://www.freecodecamp.cn/images/simonSound4.mp3"); //0.522



var simon = {
	status : "off", // 开关
	level  : 0,     // 游戏等级
	player : [],	  // 玩家数组 0 1 2 3
	comArr : []	    // 电脑数组 0 1 2 3
}

function restart() {
	simon.level = 0;
	simon.player = [];
	simon.comArr = [];
}

function start() {
	//if (simon.status === "on" && simon.level === 0) {
		count.innerHTML = simon.level;
		addComArr();
		sing();
	//}
}

function addComArr() {
	simon.comArr.push(Math.floor(Math.random() * 4));  // 0 1 2 3
}

function sing() {
	simon.comArr.forEach(function(item, index, array) {
		switch (item) {
			case 0:
				whichSing(color0, sound0);
				break;
			case 1:
				whichSing(color1, sound1);
				break;
			case 2:
				whichSing(color2, sound2);
				break;
			case 3:
				whichSing(color3, sound3);
				break;
		}
	});
}

function whichSing(color, sound) {
	setTimeout(function() {
		color.classList.add("fade");
		sound.play();		
	}, 100);
	setTimeout(function() {
		color.classList.remove("fade");
	},400);
}

function checkInput(a) {
	simon.player.push(a);
	var length = simon.player.length;
	if (a !== simon.comArr[length - 1]) {
		console.log("wrong");  // 出现错误
		
	}
	if (length === simon.comArr.length) {
		// 完全匹配


	}


}

// 点击事件

onOff.parentNode.addEventListener("click", function(event) {  //总开关
	if (simon.status === "off") {
		count.innerHTML = "--";
		count.setAttribute("style", "color:#e03838");
		onOff.setAttribute("style", "left:50%;background-color:green");
		wrapper.setAttribute("style", "display:none");
		startButton.setAttribute("style", "background-color:red");
		restart();
		simon.status = "on";
	} else {
		count.setAttribute("style", "color:#453a3a");
		onOff.setAttribute("style", "left:0;background-color:red");
		wrapper.setAttribute("style", "display:block");
		startButton.setAttribute("style", "background-color:grey");
		simon.status = "off";
	}
}, false);

startButton.addEventListener("click", function(event) {
	if (simon.status === "on" && simon.level === 0) {
		start();
	}
	
	
},false);

colorWrapper.addEventListener("mousedown", function(event) {
	var target = event.target;
	switch (target.classList[0]) {
		case "color0" :
			checkInput(0);
			sound0.play();		
			break;
		case "color1" :
			checkInput(1);
			sound1.play();
			break;
		case "color2" :
			checkInput(2);
			sound2.play();
			break;
		case "color3" :
			checkInput(3);
			sound3.play();
			break;		
	}
}, false);

