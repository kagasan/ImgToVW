var Img = new Image();
var img = [];
//画像入力
window.onload = function(){
	document.getElementById("selectfile").addEventListener("change", 
		function(evt){
			var file = evt.target.files;
			var reader = new FileReader();
			reader.readAsDataURL(file[0]);
			reader.onload = function(){
				Img.src = reader.result;
				document.getElementById("OutputImage").innerHTML = "<img src='" + Img.src + "'></br>";
			}
		},
	false);
	
};

//サンプル画像作成
function MakeSample(){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	canvas.width = 384;
	canvas.height = 384;
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(0, 0, 400, 400);
	ctx.font = "400px 'メイリオ'";
	ctx.fillStyle = "rgb(255, 0, 0)";
	ctx.fillText(document.forms.fm0.SampleChara.value,0,350);
	Img.src = canvas.toDataURL();
	document.getElementById("OutputImage").innerHTML = "<img src='" + Img.src + "'></br>";
}

//画像縮小
function Small(WLimit=384, HLimit=384){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	var w = Img.width;
	var h = Img.height;
	if(Img.width>WLimit || Img.height>HLimit){
		w = WLimit;
		h = parseInt(Img.height * WLimit / Img.width);
		if(Img.width <= Img.height){
			w = parseInt(Img.width * HLimit / Img.height);
			h = HLimit;
		}
	}
	canvas.width = WLimit;
	canvas.height = HLimit;
	ctx.drawImage(Img, 0, 0, canvas.width, canvas.height);
	Img.src = canvas.toDataURL();
}

//2値データ作成
function MakeBin(){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	canvas.width = Img.width;
	canvas.height = Img.height;
	ctx.drawImage(Img,0,0);
	var Data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = Data.data;
	img=[];
	for(var i=0;i<data.length;i+=4){
		if((data[i]+data[i+1]+data[i+2])/3>128)img.push(1);
		else img.push(0);
	}
}

function Action(){
	Small();
	MakeBin();
	var form1 = document.forms.fm1;
	var P_NUM = parseInt(form1.P_NUM.value);
	var form2 = document.forms.fm2;
	form2.ta.value="";
	
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	canvas.width = 384;
	canvas.height = 384;
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, 400, 400);
	
	for(var i=0; i<P_NUM;i++){
		var st = Math.PI * 2 * i / P_NUM;
		form2.ta.value+="0b";
		for(var j=0;j<12;j++){
			var cnt = 0;
			var sum = 0;
			var en = Math.PI * 2 * (i+1) / P_NUM;
			for(var rad = st; rad < en; rad += 0.01){
				var x = parseInt(Math.cos(rad) * 16 * j + 192);
				var y = parseInt(Math.sin(rad) * 16 * j + 192);
				if(img[y*384+x]==0)sum++;
				cnt++;
			}
			if(sum*2<cnt){
				form2.ta.value+="0";
				continue;
			}
			form2.ta.value+="1";
			for(var rad = st; rad < en; rad += 0.01){
				var x = parseInt(Math.cos(rad) * 16 * j + 192);
				var y = parseInt(Math.sin(rad) * 16 * j + 192);
				ctx.fillStyle = "rgb(255,0,0)";
				ctx.beginPath();
				ctx.arc(x, y, 3, 0, Math.PI*2, true);
				ctx.fill();
			}
		}
		form2.ta.value+=",\n";
	}
	document.getElementById("OutputImage").innerHTML = "<img src='" + canvas.toDataURL() + "'></br>";
}
