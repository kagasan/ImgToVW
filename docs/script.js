var MakeCylinder =function(src, width, height){
	//ここから入力パラメータ
	var form = document.forms.fm;
	var dia = parseFloat(form.dia.value);//LED直径
	var sp = parseFloat(form.sp.value);//1周分割数
	var num = parseFloat(form.num.value);//LED配置数
	var dis = parseFloat(form.dis.value);//LED間隔(LED中心間距離)
	var pad = parseFloat(form.pad.value);//中心と最初のLED間隔(LED中心間距離)
	var rate = parseFloat(form.rate.value);//拡大率
	var off = form.off.checked;//オフLEDの扱い
	dia*=rate;
	dis*=rate;
	pad*=rate;
	//ここまで入力パラメータ
	
	//ここから出力用canvas設定
	var canvas = document.getElementById('outcanvas');
	canvas.width = parseInt(2*(pad+dis*(num-1)+dia/2));
	canvas.height = parseInt(2*(pad+dis*(num-1)+dia/2));
	var ctx = canvas.getContext('2d');
	function GetColor(R,G,B){
		return "rgb("+R+","+G+","+B+")";
	}
	function DrawBox(X1,Y1,X2,Y2,Color,FillFlg){
		if(FillFlg){
			ctx.fillStyle = Color;
			ctx.fillRect(X1,Y1,X2-X1,Y2-Y1);
		}
		else{
			ctx.strokeStyle = Color;
			ctx.strokeRect(X1,Y1,X2-X1,Y2-Y1);
		}
	}
	function DrawLine(X1,Y1,X2,Y2,Color){
		ctx.strokeStyle=Color;
		ctx.beginPath();
		ctx.moveTo(X1, Y1);
		ctx.lineTo(X2, Y2);
		ctx.stroke();
	}
	function DrawCircle(X,Y,R,Color,FillFlag){
		if(FillFlag){
			ctx.fillStyle = Color;
			ctx.beginPath();
			ctx.arc(X, Y, R, 0, Math.PI*2, true);
			ctx.fill();
		}
		else{
			ctx.strokeStyle=Color;
			ctx.beginPath();
			ctx.arc(X, Y, R, 0, Math.PI*2, false);
			ctx.stroke();
		}
	}
	//ここまで出力用canvas設定
	
	//ここから事前計算
	var angle = Math.PI*2/sp;
	var cx = canvas.width / 2;
	var cy = canvas.height / 2;
	//ここまで事前計算
	
	//ここからパラメータ出力
	form.para.value="何を\n";
	form.para.value+="表示したら\n";
	form.para.value+="ええんや？\n";
	//ここまでパラメータ出力
	
	//ここから計算
	DrawBox(0,0,canvas.width,canvas.height,GetColor(0,0,0),1);
	form.ta.value="";
	for(var i=0;i<sp;i++){
		for(var j=0;j<num;j++){
			var rad = pad + j * dis;
			var px = cx + rad * Math.cos(angle*i);
			var py = cy + rad * Math.sin(angle*i);
			var mnx = px - dia/2;
			var mny = py - dia/2;
			var mxx = px + dia/2;
			var mxy = py + dia/2;
			
			var imnx = mnx /canvas.width *width;
			var imny = mny /canvas.height *height;
			var imxx = mxx /canvas.width *width;
			var imxy = mxy /canvas.height *height;
			var sum = 0;
			for(var y = parseInt(imny);y<imxy;y++){
				if(y<0 || y>=height)continue;
				for(var x = parseInt(imnx);x<imxx;x++){
					if(x<0 || x>=width)continue;
					var idx = (x+y*width)*4;
					var gray = (src[idx]+src[idx+1]+src[idx+2])/3;
					if(gray < 128){
						sum++;
					}
				}
			}
			if(sum>((imxx-imnx)*(imxy-imny))/2){
				form.ta.value+="0";
				DrawCircle(px,py,dia/2,GetColor(255,0,0),1);
			}
			else{
				form.ta.value+="0";
				if(off)DrawCircle(px,py,dia/2,GetColor(255,0,0),0);
			}
		}
		form.ta.value+="\n";
	}
	//ここまで計算
}

window.addEventListener("DOMContentLoaded", function(){
	var ofd = document.getElementById("selectfile");
	ofd.addEventListener("change", function(evt) {
		var img = null;
		var canvas = document.createElement("canvas");
		var file = evt.target.files;
		var reader = new FileReader();
		reader.readAsDataURL(file[0]);
		reader.onload = function(){
			img = new Image();
			img.onload = function(){
				var context = canvas.getContext('2d');
				var width = img.width;
				var height = img.height;
				canvas.width = width;
				canvas.height = height;
				context.drawImage(img, 0, 0);
				var srcData = context.getImageData(0, 0, width, height);
				var src = srcData.data;
				MakeCylinder(src, width, height);
				//ImageProcessing(src, width, height);
				context.putImageData(srcData, 0, 0);
				var dataurl = canvas.toDataURL();
				document.getElementById("output").innerHTML = "<img src='" + dataurl + "'>";
			}
			img.src = reader.result;
		}
	}, false);
});

//フォームの内容をダウンロードする
function DL(){
	var form = document.forms.fm;
	var content = form.ta.value;
	var blob = new Blob([ content ], { "type" : "text/plain" });
	if(window.navigator.msSaveBlob){
		window.navigator.msSaveBlob(blob, "test.txt"); 
		//msSaveOrOpenBlobの場合はファイルを保存せずに開ける
		window.navigator.msSaveOrOpenBlob(blob, "test.txt"); 
	}
	else{
		document.getElementById("download").href = window.URL.createObjectURL(blob);
	}
}
