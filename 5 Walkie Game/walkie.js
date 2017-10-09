var canvas = document.getElementById("canvas"),  //图像区
		cxt = canvas.getContext('2d');

var HEIGHT = 500,
		WIDTH = 900;   

canvas.width = WIDTH;
canvas.height = HEIGHT;

// 兼容
var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame 
												|| window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

// 小人
var hero = {
	speed: 200,
	jump: 0, 		 // 起跳初速度
	jumpTime: 0, // 在空中的累计时间
	walk: 0,		 // 走路步数
	x: 0,
	y: 0,
	state: 0,   // 0 站立，1 行走， 2 跳跃
	bitLen: 4		// 像素点宽度
};

var enemy = {  // 字母怪
	bitLen: 10,
	x: WIDTH / 3,
	y: 0
}
enemy.y = HEIGHT / 2 + 6 * hero.bitLen - 5 * enemy.bitLen;

// 图片准备
var heroReady = false,
		heroImage = new Image();

heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = 'hero.jpg';

// 按键处理
var keysDown = {};
window.addEventListener('keydown', function (e) {
	keysDown[e.keyCode] = true;
}, false);

window.addEventListener('keyup', function (e) {
	delete keysDown[e.keyCode];
}, false);


// 开始游戏
var reset = function () {
	hero.x = WIDTH / 2;
	hero.y = HEIGHT / 2;
}

// 数据更新
var update = function (modifier) {
	// up 长按和短按效果
	if (38 in keysDown ) {  
		if (!hero.jump) {
			hero.jump = 90; // 初速度
		} else {
			hero.jump += 5;
		}
	}
	if (hero.jump) {
		hero.state = 2;
		hero.jumpTime += modifier;  // 在空中的时间
		hero.y += - hero.jump * modifier +  10 * hero.jumpTime * hero.jumpTime;

		if ((hero.y >= HEIGHT / 2 - 3 && hero.y <= HEIGHT / 2 + 3)
				|| (hero.x > enemy.x && hero.x+4*hero.bitLen < enemy.x+4*enemy.bitLen 
						&& hero.y+6*hero.bitLen > enemy.y+3)
				|| (hero.x > enemy.x+enemy.bitLen && hero.x+4*hero.bitLen < enemy.x+3*enemy.bitLen
						&& hero.y+6*hero.bitLen > enemy.y+2*enemy.bitLen-2)) {  // 落地
			hero.state = hero.state === 2 ? 0 : hero.state;
			hero.jump = 0;
			hero.jumpTime = 0;
		}	
	}



	if (37 in keysDown) {   // left
		// 碰撞检测 左
		if (!(hero.x >= enemy.x + 4 * enemy.bitLen - 2
				&& hero.x <= enemy.x + 4 * enemy.bitLen + 2
				&& hero.y + 6 * hero.bitLen >= enemy.y)) {
			hero.x -= hero.speed * modifier;
		}
		
		hero.walk++;
		if (hero.walk > 5 && !hero.jump) {
			hero.state = hero.state === 0 ? 1 : 0;
			hero.walk = 0;
		}
	}
	if (39 in keysDown) {		// right
		// 碰撞检测 右
		if (!(hero.x + 4 * hero.bitLen >= enemy.x - 2
				&& hero.x + 4 * hero.bitLen <= enemy.x + 2
				&& hero.y + 6 * hero.bitLen >= enemy.y)) {
			hero.x += hero.speed * modifier;
		}

		hero.walk++;
		if (hero.walk > 5 && !hero.jump) {
			hero.state = hero.state === 0 ? 1 : 0;
			hero.walk = 0;
		}
	}
}


// 渲染
var render = function () {
	cxt.clearRect(0, 0, WIDTH, HEIGHT);   // 清空画布
	cxt.fillStyle = 'rgb(0, 102, 153)';		// 设定填充颜色
	cxt.fillRect(0, 0, WIDTH, HEIGHT);
	cxt.fillStyle = 'black';  

	/*if (heroReady) {
		cxt.drawImage(heroImage, hero.x, hero.y);
	}*/

	drawHero(cxt, hero.x, hero.y, hero.state);
	drawEnemy(cxt, enemy.x, enemy.y);
}

function drawHero (cxt, x, y, state) {
	var bitLen = hero.bitLen;
	bitHero[state].forEach(function (item, index) {
		for (var i = 0; i < item.length; i++) {
			if (item[i]) {
				cxt.fillRect(x + i * bitLen, y + index * bitLen, bitLen, bitLen);
			}
		}
	});
}

function drawEnemy (cxt, x, y) {
	var bitLen = enemy.bitLen;
	bitEnemy[0].forEach(function (item, index) {
		for (var i = 0; i < item.length; i++) {
			if (item[i]) {
				cxt.fillRect(x + i * bitLen, y + index * bitLen, bitLen, bitLen)
			}
		}
	});
}














// 主函数
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	render();
	then = now;

	requestAnimationFrame(main);
}

// start
var then = Date.now();
reset();
main();