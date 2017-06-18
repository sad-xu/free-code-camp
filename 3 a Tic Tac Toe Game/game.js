
var board = document.getElementsByClassName('chessboard')[0];
var startWrapper = document.getElementsByClassName('start-wrapper')[0];
var pauseWrapper = document.getElementsByClassName('pause-wrapper')[0];
var you = "";  //玩家执什么子
var ai = "";   //ai执子
var order = 0; //先手:1  后手:0  默认后手
var Arr = [];


//	开始前,选择执子,先手后手
startWrapper.addEventListener("click", function(event) {
	var target = event.target;
	var round = document.getElementsByName('round')[0];
	var fork = document.getElementsByName('fork')[0];
	var first = document.getElementsByName('first')[0];
	switch (target.name) {
		case "round":
			you = "round";
			ai = "fork";
			round.setAttribute("style", "background:red");
			fork.setAttribute("style", "background:white");
			break;
		case "fork":
			you = "fork";
			ai = "round";
			fork.setAttribute("style", "background:red");
			round.setAttribute("style", "background:white");		
			break;
		case "gamestart":
			if (you === "") {
				alert("请选择“O”或“X”");
			} else {
				startWrapper.classList.add("die");
				gameStart();  // 游戏开始
			}
			break;
		case "first": 
			if (order === 0) {
				order = 1;
				first.value = "you first!";
				first.setAttribute("style", "background:red");
			} else if (order === 1) {
				order = 0;
				first.value = "you first?";
				first.setAttribute("style", "background:white")
			}
			break;
	}
}, false);


//	开始
function Cell(loc, ele, val) {
	this.loc = loc;		//位置[0,0]
	this.ele = ele;		//元素
	this.val = val;		//落子 无 = null fork = 1 round = 0
}

function start() {
	var eleArr = [];
	board.firstElementChild.childNodes.forEach(function(item,index,array) {
		if (item.nodeType === 1) { //去除空白节点
			item.childNodes.forEach(function(ite, ind, arr) {
				if (ite.nodeType === 1) {
					eleArr.push(ite);
				}						
			});
		}	
	});
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			Arr.push(new Cell([i,j], eleArr.shift(), null));
		}
	}
}

board.addEventListener("click", function(event) {
	var target = event.target;
	if (target.nodeName === "TD") {
		if (!/fork|round/g.test(target.getAttribute("class"))) { //未落子
			for (var i = 0; i < Arr.length; i++) {
				if (target == Arr[i].ele) {
					Arr[i].val = (you === "fork") ?  1 : 0;
				}
			}
			target.setAttribute("class", you);
			AI();  //轮到AI
		}
	}
}, false);

function AI() {
	pauseWrapper.setAttribute("style", "display:block");  //遮罩开

	if (order === 0) {
		dropChess(1, 1);
	}

	pauseWrapper.setAttribute("style", "display:none");   //遮罩关
}


function dropChess(i, j) {
	Arr[i * 3 + j].val = (ai === "fork") ?  1 : 0;
	Arr[i * 3 + j].ele.setAttribute("class", ai);
}

//	结束






function gameStart() {
	start();
	AI();
}


