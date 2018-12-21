function draw(config) {
  var scene = config.layer.scene;
  var c = scene.context;
  c.strokeStyle = config.color;
  c.setLineDash([5, 5]);
  c.fillStyle = config.color;
  scene.clear();
  drawingSetup(c);
  c.stroke();
  // c.restore();
  viewport.render();
}

function drawHit(config) {
  var hit = config.layer.hit,
    c = hit.context;
  hit.clear();
  drawingSetup(c);
  c.fill();
  c.restore();
}

function drawingSetup(c) {
  c.save();
  c.beginPath();
  if (toolIsRectangle) {
    setupRectangle(c);    
  } else if (toolIsCircle) {
    setupCircle(c);
  } else if (toolIsFreeDraw) {
    setupFreeShape(c);
  }
}
function setupRectangle(c) {
  c.rect(x0, y0, dx, dy);
  // Find and sort corners
  corners = [ca, cb, cc, cd];
  corners.sort(orderCornerPositions);
}
function setupCircle(c) {
  c.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
}
function setupFreeShape(c) {
  for (let i = 1; i < freeDrawPoints.length; i++) {
    c.moveTo(freeDrawPoints[i - 1].x, freeDrawPoints[i - 1].y);
    c.lineTo(freeDrawPoints[i].x, freeDrawPoints[i].y);
  }
  if (shapeClosed) {
    c.moveTo(nextPoint.x, nextPoint.y);
    c.lineTo(freeDrawPoints[0].x, freeDrawPoints[0].y);
  }
  if (!shapeClosed) {
    c.moveTo(nextPoint.x, nextPoint.y);
    c.lineTo(mouse.x, mouse.y);
  }
  c.closePath();
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
// create viewport
var viewport = new Concrete.Viewport({
  width: 800,
  height: 800,
  container: concreteContainer
});

var layers = [];
// create Start Layer
layers[0] = new Concrete.Layer();
viewport.add(layers[0]);


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
var shapeClosed = true;


var circles = [{
  x: 0,
  y: 0,
  hovered: false,
  selected: true,
  layer: layers[0],
  color: 'red',
  key: 0
}]
var boundingRect;
var key;


function handleCursor() {
  boundingRect = concreteContainer.getBoundingClientRect();
  mouse.x = event.clientX - boundingRect.left;
  mouse.y = event.clientY - boundingRect.top;

  key = viewport.getIntersection(mouse.x, mouse.y);

  if (key >= 0) {
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

// function update() {
  concreteContainer.addEventListener('mousemove', () => {
    // Get Cursor Current Coords
    handleCursor();

    //*** RECTANGLES ***
    if (x2 && y2 && x0 && y0) {
      shapeIsRectangle = true;
      getCornerPositions();
    }
    // *** CIRCLES ***
    if (center && radius) {
      shapeIsCircle = true; 
    }
    // NEW SHAPE
    if (mouseDown) {
      //*** RECTANGLES ***
      if (toolIsRectangle) {
        if (isMoving === false) {
          // New Rectangle coords
          x2 = event.x;
          y2 = event.y;
          dx = x2 - x0;
          dy = y2 - y0;
        } else {
          // Moving Rectangle Coords
          mx = dx0 + (mouse.x - mx0);
          my = dy0 + (mouse.y - my0);
          x2 = mx + dx;
          y2 = my + dy;
          x0 = mx;
          y0 = my;
        }
      }
      // *** CIRCLES ***      
      else if (toolIsCircle) {
        if (isMoving === false) {
          // Radius: (dc = X & Y vectors ) 
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
      } 
      if (isDrawing || isMoving) {
        draw(circles[0]);
        drawHit(circles[0]);
      }
    } 
    if (toolIsFreeDraw) {
      if (!shapeClosed) {
        draw(circles[0]);
        drawHit(circles[0]);
      }
    }
  });


  concreteContainer.addEventListener('mouseup', () => {
    if (!toolIsFreeDraw) {
      isDrawing = false;
      isMoving = false;
    }
    mouseDown = false;    
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
  concreteContainer.addEventListener('click', () => {
    // Register Cursor Coords, push in array    
    if (toolIsFreeDraw) {
      if (shapeClosed === true) {
        freeDrawPoints = [];
        shapeClosed = false;
      }
      nextPoint = {
        x: mouse.x,
        y: mouse.y
      }
      if ( freeDrawPoints[1] ) {
        close = Math.sqrt(Math.pow(nextPoint.x - freeDrawPoints[0].x, 2) + Math.pow(nextPoint.y - freeDrawPoints[0].y, 2));
        console.log(close);
        if ( close < 8 ) {      
          lastPoint = freeDrawPoints[0];
          shapeClosed = true;                               
        }
      }
      freeDrawPoints.push(nextPoint);
      if (freeDrawPoints.length < 2 ) {
        var c = circles[0].layer.scene.context;
        console.log(c);       
        c.beginPath();
        c.moveTo(nextPoint.x, nextPoint.y);
        isDrawing = true;
      };
      console.table(freeDrawPoints); 
      // c.closePath();     
    }
  });
// }

// update();