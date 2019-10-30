var width = window.innerWidth;
var height = window.innerHeight - 25;

// first we need Konva core things: stage and layer
var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height
});

var layer = new Konva.Layer();
stage.add(layer);

// then we are going to draw into special canvas element
var canvas = document.createElement('canvas');
canvas.width = stage.width();
canvas.height = stage.height();

// created canvas we can add to layer as "Konva.Image" element
var image = new Konva.Image({
  image: canvas,
  x: 0,
  y: 0
});
layer.add(image);
stage.draw();

// Good. Now we need to get access to context element
var context = canvas.getContext('2d');
context.strokeStyle = '#df4b26';
context.lineJoin = 'round';
context.lineWidth = 5;

var isPaint = false;
var lastPointerPosition;
var mode = 'brush';
var originX = 0;
var originY = 0;
var endX;
var endY;
var radius;
var centralPoint;
var endPosition;
var circle;

// now we need to bind some events
// we need to start drawing on mousedown
// and stop drawing on mouseup
image.on('mousedown touchstart', function() {
  isPaint = true;
  lastPointerPosition = stage.getPointerPosition();
  centralPoint = stage.getPointerPosition();
  originX = centralPoint.x;
  originY = centralPoint.Y;
});

// will it be better to listen move/end events on the window?

stage.on('mouseup touchend', function() {

  isPaint = false;
  endPosition = stage.getPointerPosition();
  endX = endPosition.x;
  endY = endPosition.Y;
  var circle = new Konva.Circle({
    radius:5,
    fill:'#141414'
  })
});

// and core function - drawing
stage.on('mousemove touchmove', function() {
  if (!isPaint) {
    return;
  }
  if (mode === 'circle'){
      var radiusX,radiusY;
      radiusX = Math.abs(endX-originX);
      radiusY = Math.abs(endY-OriginY);
      radius = Math.sqrt(radiusX*radiusX + radiusY*radiusY);
      circle.absolutePosition({
        x:originX,
        y:originY
      });
      layer.batchDraw();



  }
  if (mode === 'brush') {
    context.globalCompositeOperation = 'source-over';
  }
  if (mode === 'eraser') {
    context.globalCompositeOperation = 'destination-out';
  }
  // context.beginPath();

  // var localPos = {
  //   x: lastPointerPosition.x - image.x(),
  //   y: lastPointerPosition.y - image.y()
  // };
  // context.moveTo(localPos.x, localPos.y);
  // var pos = stage.getPointerPosition();
  // localPos = {
  //   x: pos.x - image.x(),
  //   y: pos.y - image.y()
  // };
  // context.lineTo(localPos.x, localPos.y);
  // context.closePath();
  // context.stroke();

  // lastPointerPosition = pos;
  // layer.batchDraw();
});

var select = document.getElementById('tool');
select.addEventListener('change', function() {
  mode = select.value;
});