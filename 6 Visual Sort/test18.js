var line = [],
		text = document.getElementById("text"),
		put = document.getElementById("put"),
		canvas = document.getElementById("canvas"),  //图像区
		context = canvas.getContext('2d');

var HEIGHT = 500,
		WIDTH = 900,
		MAX = 350;


	canvas.width = WIDTH;
	canvas.height = HEIGHT;



//事件代理：添加点击事件
put.addEventListener("click",function (event){
	switch (event.target.id){
		case "left-in":
		line.unshift(text.value);
		show(context, line);
		break;

		case "right-in":
		line.push(text.value);
		show(context, line);
		break;

		case "left-out":
		line.shift(text.value);
		show(context, line);
		break;

		case "right-out":
		line.pop(text.value);
		show(context, line);
		break;

		case "random":
		roll(MAX);
		show(context, line);
		break;

		case "sort":
		// mysort(line);
		insertionSort(line);
	}
});


// 画画
function show(cxt, data, i, sign){	// 画布，数据，指示条位置，是否显示指示条
	var len = data.length,
			preLen = 10,																							// 每个的宽度
			space = Math.round((WIDTH - len * preLen) / (len + 1));		// 间距

	cxt.clearRect(0, 0, WIDTH, HEIGHT);   // 清空画布
	cxt.fillStyle = 'rgb(0, 102, 153)';		// 设定填充颜色

	data.forEach(function (item, index, arr) {
		cxt.fillRect(space + index * (preLen + space), HEIGHT - item, preLen, item);
	});

	if (sign) {  // 指示条
		cxt.fillStyle = 'red';
		cxt.fillRect(space + i * (preLen + space), HEIGHT - data[i], preLen, data[i]);
	}
}


//随机生成50组数据
function roll(max){
	line = [];
	for (var i = 0; i < 50; i++) {
		line[i]=Math.floor(Math.random()*max+1);
	}
}

//排序
function mysort(data){    // 冒泡
	var len = data.length;
	var i = 0, j = 1, k;
	setTimeout(function () {
		if (i < len - 1) {
			if (j == len - 1 - i) {
				i++;
				j = 0;
			}
			if (data[j] > data[j+1]) {
				k = data[j];
				data[j] = data[j+1];
				data[j+1] = k;	
			}
			j++;
			show(context, line);
			setTimeout(arguments.callee,50);
		}
		else{
			alert("排序完成");
		}
	},50);
}

function insertionSort (data) {  // 插入
	var key, i, time = 0;
	for (var j = 1; j < data.length; j++) {

		key = data[j];
		i = j -1;

		while (i >= 0 && data[i] > key) {
			data[i + 1] = data[i];
			time = delay(data, time, i + 1, true);  // data变化时就要重新渲染一次	
			i--;
		}
		data[i + 1] = key;
		time = delay(data, time, i + 1, false);
	}
}

function delay(data, t, i, sign) {  // 数据，时间，指示条位置，是否显示
	var d = [];
	data.forEach(function(item, index, arr) {
		d[index] = item;
	});
	t++;
	setTimeout(function() {	
		show(context, d, i, sign);
	}, 200 * t);
	return t;
}

