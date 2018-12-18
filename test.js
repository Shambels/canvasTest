function drawCircle(config) {
  var scene = config.layer.scene;
  var c = scene.context;
  // Set Line Style
  c.strokeStyle = config.color;
  // c.setLineDash([5, 5]);
  c.fillStyle = config.color;
  // Clear Canvas
  scene.clear();
  c.save();
  c.beginPath();
  c.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
  // c.fill();
  c.stroke();
  c.restore();
  // c.closePath();
  viewport.render();
}

function drawHitCircle(config) {
  var hit = config.layer.hit,
      context = hit.context;
  hit.clear();
  context.save();
  context.beginPath();
  context.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = hit.getColorFromIndex(config.key);
  context.fill();
  context.restore();
}

function drawRectangle(config) {
  var scene = config.layer.scene,
c = scene.context;
  // Style
  c.strokeStyle = "rgba(255,255,255,1)";
  c.setLineDash([5, 5]);
  // Clear Canvas
  c.clearRect(0, 0, canvas.width, canvas.height);
  // Start Drawing
  c.beginPath();
  c.rect(x0, y0, dx, dy);
  strokerect = c.strokeRect(x0, y0, dx, dy);
  // Find and sort corners
  corners = [ca, cb, cc, cd];
  corners.sort(orderCornerPositions);
}

function drawFreeShape(config) {
  var scene = config.layer.scene,
c = scene.context;
  c.strokeStyle = "rgba(255,255,255,1)";
  c.setLineDash([5, 5]);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.beginPath();

  for (let i = 1; i < freeDrawPoints.length; i++) {
    c.moveTo(freeDrawPoints[i - 1].x, freeDrawPoints[i - 1].y);
    c.lineTo(freeDrawPoints[i].x, freeDrawPoints[i].y);
  }

  if (shapeClosed) {   
    c.moveTo(nextPoint.x, nextPoint.y);
    c.lineTo(freeDrawPoints[0].x,freeDrawPoints[0].y);
  }  

    if (!shapeClosed) {
      c.moveTo(nextPoint.x, nextPoint.y);
      c.lineTo(mouse.x, mouse.y);
    }
      // }
      c.closePath();  
  c.stroke();

}

function getCornerPositions() {
  ca = {
    x: x0,
    y: y0
  }
  cb = {
    x: x2,
    y: y0
  }
  cc = {
    x: x0,
    y: y2
  }
  cd = {
    x: x2,
    y: y2
  }
}

function orderCornerPositions(a, b) {
  return a.x - b.x || a.y - b.y
}


var concreteContainer = document.getElementById('concreteContainer');
console.log(concreteContainer);

// create viewport
var viewport = new Concrete.Viewport({
  width: 800,
  height: 800,
  container: concreteContainer
});

// create layers
var layer1 = new Concrete.Layer();
// var layer2 = new Concrete.Layer();
// var layer3 = new Concrete.Layer();

// add layers
viewport.add(layer1);



concreteContainer.style.cursor = "crosshair";

var isDrawing = false;
var toolIsRectangle;
var toolIsCircle = true;
var toolIsFreeDraw;
var isInside = false;
var isMoving = false;
var Circle;
var mouseDown = false;
var mouse = {
  x: undefined,
  y: undefined
}
var x0, y0;
var x2, y2;
var dx, dy;
var mx, my;
// Rectangle
var Rectangle;
// Corners
var ca = {
  x: undefined,
  y: undefined
}
var cb = {
  x: undefined,
  y: undefined
}
var cc = {
  x: undefined,
  y: undefined
}
var cd = {
  x: undefined,
  y: undefined
}
var corners = [ca, cb, cc, cd];
// Circle
var center = {
  x: undefined,
  y: undefined
}
var dc = {
  x: undefined,
  y: undefined
}
var radius;
// FreeDraw
var freeDrawPoints = []
var nextPoint = {
  x: undefined,
  y: undefined
}
var lastPoint;
var close;
var shapeClosed = false;


var circles = [
  {
    x: 0,
    y: 0,
    hovered: false,
    selected: true,
    layer: layer1,
    color: 'red',
    key: 0
  }
]
var boundingRect;
var key;

function update() {


 // Permanent Mouse event Listener (get position / set cursor / ... )
 concreteContainer.addEventListener('mousemove', () => {
  // Get Cursor Current Coords  
  boundingRect = concreteContainer.getBoundingClientRect();  
 
  mouse.x = event.clientX - boundingRect.left;
  mouse.y = event.clientY - boundingRect.top;
  key = viewport.getIntersection(mouse.x, mouse.y);

  // IF THERE ALREADY IS A CIRCLE
  if (center && radius) {
    shapeIsCircle = true;    
    // if (layer1.scene.context.isPointInPath(mouse.x , mouse.y)) {
      if(key>=0) {
      isInside = true;
      if (!isDrawing && !isMoving) {
        concreteContainer.style.cursor = "grab";
      }
    } else {
      isInside = false;
      if (!isMoving) {
      concreteContainer.style.cursor = "crosshair";
      }
    }    
  }

  if (toolIsCircle) {
    if (mouseDown === true) {
      if (isMoving === false) {
        // Radius: (dc = X & Y components ) 
        dc.x = (event.x - x0) / 2;
        dc.y = (event.y - y0) / 2;
        radius = Math.sqrt(Math.pow(dc.x, 2) + Math.pow(dc.y, 2));
        // Center: X and Y Coords      
        center.x = x0 + dc.x;
        center.y = y0 + dc.y;
      } else {
        center.x = x0 + (mouse.x - mx0);
        center.y = y0 + (mouse.y - my0);
      }
      if (isDrawing || isMoving) {        
        drawCircle(circles[0]);
        drawHitCircle(circles[0]);
      }
    }
  }
});


concreteContainer.addEventListener('mouseup', () => {
  if (!toolIsFreeDraw) {
    isDrawing = false;
    isMoving = false;
    console.log('up');
  }
  mouseDown = false;
  // canvas.removeEventListener('mousemove', rectangleOnMove);
});

concreteContainer.addEventListener('mousedown', () => {
  mouseDown = true;
  if (toolIsRectangle) {
    if (isInside === false) {
      // set Origin on Cursor location
      x0 = event.x;
      y0 = event.y;
      isDrawing = true;
    } else {
      // set Origin/ Dimensions as previous Shape's. 
      concreteContainer.style.cursor = "all-scroll";
      isMoving = true;
      dx0 = x0;
      dy0 = y0;
      mx0 = mouse.x;
      my0 = mouse.y;
    }
  } else if (toolIsCircle) {
    mouseDown = true;
    if (isInside === false) {
      // Register where circle starts
      x0 = mouse.x;
      y0 = mouse.y;
      isDrawing = true;
    } else {
      concreteContainer.style.cursor = "all-scroll";
      isMoving = true;
      // Register current Center (x0,y0);
      x0 = center.x;
      y0 = center.y;
      // Register mouse pos on dragstart 
      mx0 = mouse.x;
      my0 = mouse.y;
    }
  }
});
}

update();