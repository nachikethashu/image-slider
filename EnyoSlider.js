enyo.kind({
	name: "Enyo.Slider",
	kind: "enyo.Control",
	//classes: "enyo-center",
	published: {
		srcimg: undefined,
		rows: undefined,
		columns: undefined,
		animeSpeed: undefined,
		randomize: false,
	},

	create: function(){
		this.inherited(arguments);
		this.bufferImage = new Image();
		this.bufferImage.onload = enyo.bind(this, "imageLoaded");
		this.bufferImage.onerror = enyo.bind(this, "imageError");
		this.srcChanged();
		this.rowsChanged();
		this.columnsChanged();
		this.randomizeChanged();

	},
	rendered: function(){
		this.inherited(arguments);
	},

	events:{
		onAnimeEnd: "",
	},

	srcChanged: function(){
		this.bufferImage.src = this.srcimg;
	},
	rowsChanged: function(){
		//console.log(this.rows);
	},
	columnsChanged: function(){
		//console.log(this.columns);
	},

	randomizeChanged: function(){
		// console.log('randomizehanged: '+ this.randomize);
	},

	imageLoaded: function(){
		//console.log('imageLoaded '+ this.bufferImage.src);
		this.originalWidth = this.bufferImage.width;
		this.originalHeight = this.bufferImage.height;

		var p = this.createComponent({
		        name: "slider",
		        style: "position: relative; top: 50%; left:50%; margin: "+ (-this.originalHeight/2) + "px 0 0 "+ (-this.originalWidth/2) +"px; width: "+
		        this.originalWidth +"px ; height: "+ this.originalHeight +"px; border: 1px solid green;/*background:url('images/slider3.jpg') 100% 100%;*/"
		});

		p.render();
			var j =0,
				k= 0;
		for( var i=0; i<(this.rows*this.columns); i++ ){
			k++;
			if((i)%this.columns == 0){
				j++;
				k =0;
			}

			this.$.slider.createComponent({
		        name: "subdiv"+ i,
		        style: "position: relative;width: "+ (100/this.columns)+"%; height:"+(100/this.rows)+"%; background:url("+this.srcimg+") "+
		         (-this.originalWidth/this.columns)*k + "px "+ ((j-1)*(-this.originalHeight/this.rows)) + "px " +"; float:left"
			});

		}
		this.render();
	},

	imageError: function(){
		console.log('imageError ');
	},

	animateImage: function(){
		var m =0;
		this.timer = window.setInterval(enyo.bind(this, function(){

			if(this.randomize == false){
				var temp = eval("this.$.slider.$.subdiv" + m++);
				temp.addClass( "animated bounceOut" );
			}
			else{
				for (var i = 0, ar = []; i < this.rows*this.columns; i++) {
				  ar[i] = i;
				}

				// randomize the array
				ar.sort(function () {
				    return Math.random() - 0.5;
				});
				var temp = eval("this.$.slider.$.subdiv" + ar.pop());
				//var temp = eval("this.$.slider.$.subdiv" + m++);
				m++;
				temp.addClass( "animated bounceOut" );


			}
			if(m == this.rows*this.columns){
				this.doAnimeEnd();
				clearInterval(this.timer);
				for( var z=0; z<(this.rows*this.columns); z++ ){
					var temp = eval("this.$.slider.$.subdiv" + z);
					temp.removeClass( "animated bounceOut" );
/*					this.timer2 = window.setTimeout(enyo.bind(this, function(){								// !!!!!! Check these !!!!!!
						for( var z=0; z<(this.rows*this.columns); z++ ){
							var temp = eval("this.$.slider.$.subdiv" + z);
							temp.removeClass( "animated bounceOut" );
						}
					}), 500);*/
				}
			}

		}), (this.animeSpeed/(this.rows*this.columns)));

	},
});

enyo.kind({
	name: "SliderSample",
	kind: "enyo.Panels",
	//arrangerKind: "CollapsingArranger",
	//wrap: true,
	 fit:true, realtimeFit: true,
	 count: 0,
	// animate: false,
	components:[
		//{kind: "enyo.Button"},
		//{content:0, style:"background:red;"},
		{name:"sampleImageView1", kind: "Enyo.Slider", srcimg: "images/slider1.jpg", rows:1, columns:18, animeSpeed:2000, ontap: "MyAnimate1", randomize: false},
		{name:"sampleImageView2", kind: "Enyo.Slider", srcimg: "images/slider2.jpg", rows:4, columns:8, animeSpeed:2000, ontap: "MyAnimate1"},
		//{content:0, style:"background:red;"},
		{name:"sampleImageView3", kind: "Enyo.Slider", srcimg: "images/slider3.jpg", rows:4, columns:8, animeSpeed:2000, ontap: "MyAnimate2", randomize: true},
		{name:"sampleImageView4", kind: "Enyo.Slider", srcimg: "images/slider4.jpg", rows:4, columns:8, animeSpeed:2000, ontap: "MyAnimate2"},
		//{name:"sampleImageView5", kind: "Enyo.Slider", srcimg: "images/fightclubpicture.jpg", rows:4, columns:8, animeSpeed:2000, },
		{name:"sampleImageView6", kind: "Enyo.Slider", srcimg: "images/rang.jpg", rows:4, columns:8, animeSpeed:2000, },
		//http://wowslider.com/jquery-slider-mellow-blast-demo.html
	],

	MyAnimate1: function(){
		this.$.sampleImageView1.animateImage();
	},
	MyAnimate2: function(){
		this.$.sampleImageView2.animateImage();
	},
	handlers:{
		onAnimeEnd: "goNext",
	},
	goNext: function(){
		this.count++;
		if(this.count == 5){
			this.count =0;
			this.setIndexDirect(0);
			this.getActive().animateImage();
			return;
		}
		this.next();
		var act = this.getActive();
		act.animateImage();
	}


});