var width = window.innerWidth;
var height = window.innerHeight - 25;


//hide drop down list by defualt
var type_list = document.getElementById('type');
var controler = document.getElementById('controler');
var number = document.getElementById('number');
controler.style.visibility = 'hidden';

// first we need Konva core things: stage and layer
var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height
});

var layer = new Konva.Layer();
var temp_layer = new Konva.Layer();
var back_layer = new Konva.Layer();
var other_layer = new Konva.Layer();
var pois_layer = new Konva.Layer();
stage.add(back_layer);
stage.add(pois_layer);
stage.add(other_layer);
stage.add(layer);
stage.add(temp_layer);
var symbol_radius;
// then we are going to draw into special canvas element
var canvas = document.createElement('canvas');
canvas.width = stage.width();
canvas.height = stage.height();

var isPaint = false;
var isDrawing = true;
var lastPointerPosition;
var mode = 'circle';
var originX = 0;
var originY = 0;
var endX;
var endY;
var centralPoint;
var endPosition;
var circle;
var referenceline;
var id = 0;
var a = 0;


//preset layer 1
//group of points
var group1 = new Konva.Group();

var pois = new Array();
pois[0] = {x: 290, y:100};
pois[1] = {x: 472, y:318};
pois[2] = {x: 680, y:289};


for (var i = 0; i<3;i++){
  var c = new Konva.Circle({
    x:pois[i].x,
    y:pois[i].y,
    radius:15,
    fill:"#c4c4c4",
    draggable:false,
    name: 'POI'+i,
  });
  group1.add(c);
}

pois_layer.add(group1);
pois_layer.draw();


//hotel points
var hotelgroup = new Konva.Group();


var hotel = new Array();
hotel[0] = {x: 250, y:80};
hotel[1] = {x: 266, y:170};
hotel[2] = {x: 309, y:289};
hotel[3] = {x: 331, y:198};
hotel[4] = {x: 408, y:289};
hotel[5] = {x: 501, y:311};
hotel[6] = {x: 446, y:180};
hotel[7] = {x: 534, y:311};
hotel[8] = {x: 577, y:305};
hotel[9] = {x: 664, y:209};
for (var i = 0; i<10;i++){
  var c = new Konva.Circle({
    x:hotel[i].x,
    y:hotel[i].y,
    radius:8,
    fill:"#ffce6e",
    draggable:false,
    name: 'hotel'+i,
  });
  hotelgroup.add(c);
}

other_layer.add(hotelgroup);
other_layer.draw();

//layer rectangle
var layer_bg = new Konva.Rect({
  x:0,
  y:0,
  width:200,
  height:1500,
  fill:'#f1f1f1'
});
var text_layertitle = new Konva.Text({
  x: 40,
  y:30,
  text:'Layers',
  fontSize: 20,
  fontFamily:'Helvetica',
  fill:'black'
});
other_layer.add(layer_bg);
other_layer.add(text_layertitle);
other_layer.draw();


var layer1 = new Konva.Rect({
  name:'layer1',
  x: 0,
  y:60,
  width: 200,
  height: 30,
  fill: 'white',
  stroke: '#bfbfbf',
  strokeWidth: 1,
});

var text_layer1 = new Konva.Text({
  x: 40,
  y:70,
  text:'train stops',
  fontSize: 14,
  fontFamily:'Helvetica',
  fill:'black'
});

var layer2 = new Konva.Rect({
  name:'layer2',
  x: 0,
  y:89,
  width: 200,
  height: 30,
  fill: 'white',
  stroke: '#bfbfbf',
  strokeWidth: 1,
});
var text_layer2 = new Konva.Text({
  x: 60,
  y:99,
  text:'hotel',
  fontSize: 14,
  fontFamily:'Helvetica',
  fill:'black'
});
other_layer.add(layer2);
other_layer.add(layer1);
other_layer.add(text_layer2);
other_layer.add(text_layer1)
other_layer.draw();

pois_layer.add(layer1);
//pois_layer.add(text_layer1);
pois_layer.draw();

//drag and drop event
var previousShape;
stage.on('dragstart', function (e){
  console.log("start dargging");
  // symbol_radius = e.target.radius();
  e.target.moveTo(temp_layer);
});

stage.on('dragmove', function(evt) {
  var pos = stage.getPointerPosition();
  var shape = pois_layer.getIntersection(pos);
  if (previousShape && shape) {
    if (previousShape !== shape) {
      // leave from old targer
      previousShape.fire(
        'dragleave',
        {
          type: 'dragleave',
          target: previousShape,
          evt: evt.evt
        },
        true
      );

      // enter new targer
      shape.fire(
        'dragenter',
        {
          type: 'dragenter',
          target: shape,
          evt: evt.evt
        },
        true
      );
      previousShape = shape;
    } else {
      previousShape.fire(
        'dragover',
        {
          type: 'dragover',
          target: previousShape,
          evt: evt.evt
        },
        true
      );
    }
  } else if (!previousShape && shape) {
    previousShape = shape;
    shape.fire(
      'dragenter',
      {
        type: 'dragenter',
        target: shape,
        evt: evt.evt
      },
      true
    );
  } else if (previousShape && !shape) {
    previousShape.fire(
      'dragleave',
      {
        type: 'dragleave',
        target: previousShape,
        evt: evt.evt
      },
      true
    );
    console.log('no shape')
    previousShape = undefined;
  }
});
stage.on('dragend', function(e) {
  var pos = stage.getPointerPosition();
  var shape = layer.getIntersection(pos);
  if (shape) {
    previousShape.fire(
      'drop',
      {
        type: 'drop',
        target: previousShape,
        evt: e.evt
      },
      true
    );
  }
  previousShape = undefined;
  e.target.moveTo(layer);
  layer.draw();
  temp_layer.draw();
});

stage.on('dragenter', function(e) {
  e.target.fill('green');
  var target_type = e.target.name();
  console.log(target_type);
  if (target_type === 'layer1'){
    var group2 = new Konva.Group();
    for (var i = 0; i<3;i++){
      var c = new Konva.Circle({
        x:pois[i].x,
        y:pois[i].y,
        radius: symbol_radius,
        fill: 'pink',
        stroke: "black",
        strokeWidth: 1,
      });
      group2.add(c);
      back_layer.add(group2);
    }
  }
  else {
    var pos = e.target.absolutePosition();
    var region = new Konva.Circle({
      x: pos.x,
      y: pos.y,
      radius: symbol_radius,
      fill: 'pink',
      stroke: "black",
      strokeWidth: 1,
    });
    back_layer.add(region);
  }
  back_layer.draw();
  pois_layer.draw();
  layer.draw();
  console.log('dragenter');
});

stage.on('dragleave', function(e) {
  var target_type = e.target.name();
  if (target_type === 'layer1'){
    e.target.fill('white');
  }
  else{
    e.target.fill('#c4c4c4');
  }
  console.log('dragleave ' + e.target.name());
pois_layer.draw();
  back_layer.clear();
  back_layer.draw();
});

stage.on('dragover', function(e) {
  console.log('dragover ' + e.target.name());
  layer.draw();
});

stage.on('drop', function(e) {
  var target_type = e.target.name();
  if (target_type === 'layer1'){
    e.target.fill('white');
  }
  else{
    e.target.fill('#c4c4c4');
  }
  console.log('drop ' + e.target.name());
  pois_layer.draw();
});


stage.on('click', function (event) {

  //destroy all transformers when clicking empty space
  if (event.target === stage) {
   stage.destroyControlers();
    return;
  }

  // do nothing when cilcking other elements
  // if(event.target != circle){
  //   console.log('not a circle');
  //   return;
  // }


  //remove old transformers
  stage.find('Transformer').destroy();
  stage.find('Line').destroy();
  stage.find('Text').destroy();
  console.log('distroy transformer');

  //create new transformer
  if (event.target.name() === 'circle'){
    var tr2 = new Konva.Transformer({
      keepRatio: true,
      enabledAnchors: ['top-right']
    });
    console.log(tr2);
    layer.add(tr2);
  
    tr2.attachTo(event.target);
    console.log(tr2);
    console.log('event target' + event.target);
  
    layer.draw();
  }


  //draw reference line
  var x0 = event.target.x();
  var y0 = event.target.y();
  var r = event.target.radius();
  var x1 = x0 + r;
  symbol_radius = r;

  var line = new Konva.Line({
    points: [x0, y0, x1, y0],
    stroke: 'black',
    strokeWidth: 2
  });
  layer.add(line);

  //update line location&length
  line.update = function(){
    var x0 = event.target.x();
    var y0 = event.target.y();
    var r = event.target.radius();
    var x1 = x0 + r;

    var new_points = [x0,y0,x1,y0]
    line.points = new_points;
    layer.draw();

  };




  //add text
  var type = event.target.getMeasurement();

  // get radius
  var value = event.target.radius();
  if (type === 'min') {
    value = Math.round(value / 8);
  }
  else if (type === 'm') {
    value = Math.round(value * 10);
  }
  var v = value.toString();
  var textInfo = v + ' ' + type;

  var text = new Konva.Text({
    x: x0,
    y: y0,
    text: textInfo,
    fontSize: 15,
    fontFamily: 'Calibri',
    fill: 'green'
  });
  layer.add(text);
  layer.draw();

  //update text
  text.update = function(){
    var value = event.target.radius();
  if (type === 'min') {
    value = Math.round(value / 8);
  }
  else if (type === 'm') {
    value = Math.round(value * 10);
  }
  var v = value.toString();
  var textInfo_new = v + ' ' + type;
  text.text = textInfo_new;
  layer.draw();
  }


  //show tool boxes
  controler.style.visibility = 'visible';

  //setup default value of tool box
  type_list.value = "time";
  number.value = v;

  type_list.addEventListener('change', function () {
    var selected_type = type_list.value;

    if (selected_type === "time") {
      console.log("time");
    }
    else if (selected_type === "distance") {
      console.log("distance");
    }
  });
  number.addEventListener('change', function () {
    var r = number.value;
    var t = type_list.value;
    event.target.setSize(r, t);
    line.update();
    text.update();
    console.log("change value" + event.target.radius());
    layer.draw();
  })

})
// we need to start drawing on mousedown
// and stop drawing on mouseup
stage.on('mousedown touchstart', function () {
  var isCircle = false;
  if (isDrawing === true) {
    isPaint = true;
    centralPoint = stage.getPointerPosition();
    originX = centralPoint.x;
    originY = centralPoint.y;
    circle = new Konva.Circle({
      x: originX,
      y: originY,
      radius: 5,
      fill: 'pink',
      stroke: "black",
      strokeWidth: 1,
      draggable: true,
      name: "circle",
    });
    console.log(circle.name());
    isCircle = true;
    circle.type = "min";


    // add function to circle

    //return measurement type
    circle.getMeasurement = function () {
      return this.type;
    }

    circle.setSize = function (r, t) {
      if (t === "time") {
        var r_new = r * 8;
        this.radius(r_new);
        //this.r(r*8);
        console.log('set time to be ' + circle.radius() + ' ' + r_new);
      }
      if (t === "distance") {
        this.radius(r / 10);
        //this.r(r/10)
        console.log(this.radius());
      }

    }

  }

  circle.on('mousedown', function (evt) {

    isDrawing = false;
    symbol_radius = this.radius();
    console.log(this.radius());
    // var x2;
    // x2 = originX + radius;
    // console.log("mousedown");
  });

});

// will it be better to listen move/end events on the window?

stage.on('mouseup touchend', function () {

  isPaint = false;
});

// and core function - drawing
stage.on('mousemove touchmove', function () {
  if (!isPaint) {
    return;
  }

  //draw circle
  if (mode === 'circle' && !circle.isDragging()) {
    isDrawing = false;
    endPosition = stage.getPointerPosition();
    endX = endPosition.x;
    endY = endPosition.y;
    var radiusX, radiusY;
    var scale, originR;
    radiusX = Math.abs(endX - originX);
    radiusY = Math.abs(endY - originY);
    var radius = Math.sqrt(radiusX * radiusX + radiusY * radiusY);

    circle.radius(radius);


    //circle events



    circle.on('mouseenter', function () {
      isDrawing = false;
      // referenceline.show();
    });


    circle.on('mouseleave', function () {
      isDrawing = true;
      //referenceline.hide();
    });
    circle
    layer.add(circle);
    layer.draw();
  }
});

stage.destroyControlers = function(){
  console.log('empty hit');
  stage.find('Transformer').destroy();
  stage.find('Line').destroy();
  stage.find('Text').destroy();
  controler.style.visibility = 'hidden';
  layer.draw();
};

var select = document.getElementById('tool');
select.addEventListener('change', function () {
  mode = select.value;
});
