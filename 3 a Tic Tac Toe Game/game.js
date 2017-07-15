
var board = document.getElementsByClassName('chessboard')[0];
var startWrapper = document.getElementsByClassName('start-wrapper')[0];
var pauseWrapper = document.getElementsByClassName('pause-wrapper')[0];
var end = document.getElementsByClassName('end')[0];
var restart = document.getElementsByName('restart')[0];

var you = "";  // 玩家执子    O 0   x 1
var ai = "";   // ai执子
var order = 0; // ai先手:0  后手:1  默认先手
var Arr = [];
var step = 0; // 步数
var winArr = [   // 获胜可能
							[[0, 0], [0, 1], [0, 2]],
							[[1, 0], [1, 1], [1, 2]],
							[[2, 0], [2, 1], [2, 2]],
							[[0, 0], [1, 0], [2, 0]],
							[[0, 1], [1, 1], [2, 1]],
							[[0, 2], [1, 2], [2, 2]],
							[[0, 0], [1, 1], [2, 2]],
							[[0, 2], [1, 1], [2, 0]]
						];
// 开始前,选择执子,先手后手
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

function gameStart() {
	start();
	AI();
}

// 开始
function Cell(loc, ele, val) {
	this.loc = loc;		// 位置[0,0]
	this.ele = ele;		// 元素
	this.val = val;		// 落子 null fork  round 
}

function start() {    // 初始化Arr[]
	var eleArr = [];
	board.firstElementChild.childNodes.forEach(function(item,index,array) {
		if (item.nodeType === 1) { // 去除空白节点
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

function dropChess(i, j) {   // 落子
	pauseWrapper.setAttribute("style", "display:block");  // 遮罩开
	setTimeout(function() {
		Arr[i * 3 + j].val = ai;
		Arr[i * 3 + j].ele.setAttribute("class", ai);	
		step++;
		console.log(step)
		pauseWrapper.setAttribute("style", "display:none");   // 遮罩关

		win = winner("ai");  
	  if (win === 3) {
			gameOver("You loss");   
			return;
		} else if (win === 9) {
			gameOver("平局");        // 最后一子是ai下的
			return;
		}			
	}, 1000);
}

function AI() {		// AI
	// 第一步
	if (order !== -1) {  
		if (order === 0) { // 先手 下中间
			dropChess(1, 1);
			order = -1;
		} else if (order === 1 && step === 1) { //后手
			if (!Arr[4].val) { // 优先下中间
				dropChess(1, 1);
			} else {		// 其次下角位
				dropChess((Math.random() > 0.5) ? 2 : 0, (Math.random() > 0.5) ? 2 : 0);
			}
			order = -1;
		}
		return;
	}

	var win = winner("you");
	if (win === 9) {
		gameOver("平局");      // 最后一子是玩家下的
		return;
	}

	// 攻守
	var yous = scan()[0];
	var ais = scan()[1];
	if (attDef(ais).length > 0) {			// 攻
		var target = attDef(ais);
		dropChess(target[0][0], target[0][1]);
	} else if (attDef(yous).length > 0) { 		// 守
		var target = attDef(yous);
		dropChess(target[0][0], target[0][1]);
	} else {		// 垃圾时间
		var empty = [];
		Arr.forEach(function(item) {
			if (!item.val) {
				empty.push(item);
			}
		});
		if (empty.length) {
			var a = Math.floor(Math.random() * empty.length);
			dropChess(empty[a].loc[0], empty[a].loc[1]); 
		}
	}
}

function attDef(arr) {  	// 攻或守
	var flag = 0;
	var target = [];
	winArr.forEach(function(item) {
		flag = 0;
		item.forEach(function(ite) {
			arr.forEach(function(ite2) {
				if (ite2.loc.toString() === ite.toString()) {
					flag++;
				}
			});					
			if (flag === 2) {
				for (var i = 0; i < item.length; i++) {
					if (!Arr[item[i][0] * 3 + item[i][1]].val) {
						target.push(item[i]);
					}
				}
			}
		});	
	});
	return target;
}

function whoWin(who, arr){
	var flag = 0;
	winArr.forEach(function(item) {
		flag = 0;
		item.forEach(function(ite) {
			arr.forEach(function(ite2) {	
				if (ite2.loc.toString() === ite.toString()) {
					flag++;
				}
			});		 					
			if (flag === 3) {
				if (who === "ai") {
					gameOver("You loss!");
				} else {
					gameOver("You win!");
				}	
				return flag;
			}
		});	
	});	
	return 0;
}

function scan(){  // 扫描棋盘
	var yous = [], ais = [];
	Arr.forEach(function(item, index, array) {
		if (item.val == you) {
			yous.push(item);
		} else if (item.val == ai) {
			ais.push(item);
		}	
	});
	return [yous, ais];
}

function winner(who) {
	// 检测胜负
	var yous = scan()[0];
	var ais = scan()[1];
	var a =  (who === "ai") ? ais : yous;
	if(whoWin(who, a) > 0) {
		return 3;
	} else if (yous.length + ais.length === 9) {
		return 9;
	}
}


board.addEventListener("click", function(event) {
	var target = event.target;
	if (target.nodeName === "TD") {
		if (!/fork|round/g.test(target.getAttribute("class"))) {  // 未落子
			for (var i = 0; i < Arr.length; i++) {
				if (target == Arr[i].ele) {
					Arr[i].val = you;
				}
			}
			target.setAttribute("class", you);
			step++;
			console.log(step);

			var win = winner("you");
			console.log('WIN = ' + win)
			if (win === 2) {
				gameOver("you win 1");      // 最后一子是玩家下的
				return;
			}	else {
				AI();  // 轮到AI
			}	

			
		}
	}
}, false);



// 结束
function gameOver(str) {
	end.firstChild.innerHTML = str;
	end.setAttribute("style", "display:block")	
	pauseWrapper.setAttribute("style", "display:flex");  // 遮罩开
}

function clear() {
	var round = document.getElementsByName('round')[0];
	var fork = document.getElementsByName('fork')[0];
	var first = document.getElementsByName('first')[0];	
	fork.setAttribute("style", "background:white");
	round.setAttribute("style", "background:white");
	first.setAttribute("style", "background:white");
	step = 0;
	order = 0;
	you = "";
	ai = "";
	Arr.forEach(function(item) {
		item.val = null;
		item.ele.setAttribute("class", "");
	});
	Arr = [];
}

restart.addEventListener("click", function(event) {
	startWrapper.classList.remove("die");
	clear();
	end.setAttribute("style", "display:none");
	pauseWrapper.setAttribute("style", "display:none");   // 遮罩关
}, false);



