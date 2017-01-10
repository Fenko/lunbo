
var images = [
	{"i":0,"img":"img/banner_01.jpg"},
	{"i":1,"img":"img/banner_02.jpg"},
	{"i":2,"img":"img/banner_03.jpg"},
	{"i":3,"img":"img/banner_04.jpg"},
	{"i":4,"img":"img/banner_05.jpg"},
];

var slider = {
	LIWIDTH:0, //保存每个LI的宽度
	DISTANCE:0, //保存轮播的总距离
	DURATION:1000, //轮播的总时间
	STEPS:100, //轮播的总步数
	INTERVAL:0, //轮播的时间间隔
	STEP:0, //每步轮播的步长
	TIMER:null, // 当前轮播的序号
	MOVED:0, //保存已经移动的步数
	WAIT:3000, //保存自动轮播之间的时间间隔
	canAuto:true, //保存是否启动自动轮播
	init:function(){
		//计算interval=duration/steps
		this.INTERVAL = this.DURATION/this.STEPS;
		//获得id为slider的元素计算后的width属性，转为浮点数，保存在LIWIDTH属性中
		this.LIWIDTH = parseFloat(getComputedStyle(document.getElementById("slider")).width);
		//console.log(this.LIWIDTH);
		this.updataView();
		//留住this
		var me = this;
		//console.log(this);

//		为id为indexs的元素绑定鼠标进入的事件
		document.getElementById("indexs").addEventListener("mousemove",function(e){
			var target = e.target //获得目标元素
			//如果target是LI, 且target的class不是hover
			if(target.nodeName="LI" && target.className!="hover"){
				clearTimeout(me.TIMER);
				me.updataView();
				me.TIMER=null;
				me.MOVED=0;
				document.getElementById("imgs").style.left="";
				me.move(target.innerHTML-$("#indexs>li.hover").html());
			}
		});
		document.getElementById("slider").addEventListener("mousemove",function(){
			me.canAuto=false;
		});
		document.getElementById("slider").addEventListener("mouseout",function(){
			me.canAuto=true;
		});
		this.autoMove() //启动轮播
	},
	autoMove:function(){
		this.TIMER = setTimeout( //启动一次性定时器
			function(){
				if(this.canAuto){ //如果canAuto是true
					this.move(1); //调用move，移动一次
				}else{
					this.autoMove(); //重新等待
				}
			}.bind(this),this.WAIT
		) ;
	},
	move:function(n){ //启动一个轮播
		this.DISTANCE = n*this.LIWIDTH; //n*LIWIDTH,保存在DISTANCE属性中
		this.STEP = this.DISTANCE / this.STEPS; //DISTANCE / STEPS ,保存在step属性中
		if(n<0){ //如果是右移 删除images结尾的n个元素，拼接到images开头，将结果保存回images
			images=images.splice(images.length+n,-n).concat(images);
			this.updataView();
			document.getElementById("imgs").style.left = n*this.LIWIDTH+"px";
		}
		//启动一次性定时器，设置任务胃moveStep（提前绑定this），间隔为interval，将序列号保存在timer中
		this.TIMER = setTimeout(this.moveStep.bind(this,n),this.INTERVAL);
	},
	moveStep:function(n){
		var left = parseFloat(getComputedStyle(document.getElementById("imgs")).left);
		//console.log(left);
		document.getElementById("imgs").style.left = left -this.STEP+"px";
		this.MOVED++; //moved+1
		//如果moved < steps，就启动一次性定时器
		if(this.MOVED<this.STEPS){
			this.TIMER = setTimeout(
				this.moveStep.bind(this,n),this.INTERVAL);
		}else{
			this.TIMER=null;
			this.MOVED=0;
			if(n>0){ //左移
				images = images.concat(images.splice(0,n));
				this.updataView();
			}
			document.getElementById("imgs").style.left="";
			this.autoMove();//启动自动轮播
		}
	},
	updataView:function(){
		for(var i=0,html1="",html2="";i<images.length;i++){
			html1+='<li><img src="'+images[i].img+'"></li>';
			html2+="<li>"+(i+1)+"</li>";
		}
		document.getElementById("imgs").innerHTML=html1;
		document.getElementById("imgs").style.width = images.length*this.LIWIDTH+"px";
		document.getElementById("indexs").innerHTML=html2;
		$("#indexs>li:nth-child("+(images[0].i+1)+")").addClass("hover");
	}
}
window.addEventListener(
  "load",function(){slider.init();}
);