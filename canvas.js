var canvas = document.querySelector('canvas');
canvas.style.cursor = "crosshair";
var c = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 900;
var isDrawing = false;
var toolIsRectangle, toolIsCircle, toolIsFreeDraw = true;
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

function drawCircle() {
  // Set Line Style
  c.strokeStyle = "rgba(255,255,255,1)";
  c.setLineDash([5, 5]);
  // Clear Canvas
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.beginPath();
  c.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  c.stroke();
}

function drawRectangle() {
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

function drawFreeShape() {
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

function update() {
  // Permanent Mouse event Listener (get position / set cursor / ... )
  canvas.addEventListener('mousemove', () => {
    // Get Cursor Current Coords  
    mouse.x = event.x;
    mouse.y = event.y;
    // If there's a RECTANGLE already
    if (x2 && y2 && x0 && y0) {
      shapeIsRectangle = true;
      // Find 4 corners coord (ca = origin / cd = end)
      getCornerPositions();
      // Check if cursor is inside RECTANGLE
      if (c.isPointInPath(mouse.x, mouse.y)) {
        isInside = true;
        if (!isDrawing && !isMoving) {
          canvas.style.cursor = "grab"
        }
      } else {
        isInside = false;
        canvas.style.cursor = "crosshair";
      }
    }
    // if there is a CIRCLE already 
    if (center && radius) {
      shapeIsCircle = true;
      if (c.isPointInPath(mouse.x, mouse.y)) {
        isInside = true;
        if (!isDrawing && !isMoving) {
          canvas.style.cursor = "grab";
        }
      } else {
        isInside = false;
        canvas.style.cursor = "crosshair";
      }
    }
    // if there's a FREE SHAPE already
    if (shapeClosed === true) {
      shapeIsFreeDraw = true;
      drawFreeShape();
      if (c.isPointInPath(mouse.x, mouse.y)) {
        isInside = true;
        console.log('ok');
        // if (!isDrawing && !isMoving) {
        canvas.style.cursor = "grab"
        // }
      } else {
        console.log('pasok');
        isInside = false;
        canvas.style.cursor = "crosshair";
      }
    }

    if (toolIsRectangle) {
      if (mouseDown === true) {
        if (isMoving === false) {
          // Define New Rectangle dimensions from origin to Cursor.
          x2 = event.x;
          y2 = event.y;
          dx = x2 - x0;
          dy = y2 - y0;
        } else {
          mx = dx0 + (mouse.x - mx0);
          my = dy0 + (mouse.y - my0);
          x2 = mx + dx;
          y2 = my + dy;
          x0 = mx;
          y0 = my;
        }
        if (isDrawing || isMoving) {
          drawRectangle();
        }
      }
    } else if (toolIsCircle) {
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
          drawCircle();
        }
      }

    } else if (toolIsFreeDraw) {
      if (!shapeClosed) {
        drawFreeShape();
      }
    }
  });

  canvas.addEventListener('mouseup', () => {
    if (!toolIsFreeDraw) {
      isDrawing = false;
      isMoving = false;
      console.log('up');
    }
    mouseDown = false;
    // canvas.removeEventListener('mousemove', rectangleOnMove);
  });

  canvas.addEventListener('mousedown', () => {
    mouseDown = true;
    if (toolIsRectangle) {
      if (isInside === false) {
        // set Origin on Cursor location
        x0 = event.x;
        y0 = event.y;
        isDrawing = true;
      } else {
        // set Origin/ Dimensions as previous Shape's. 
        canvas.style.cursor = "all-scroll";
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
        canvas.style.cursor = "all-scroll";
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

  canvas.addEventListener('click', function addAnchors() {
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

        if ( close < 8 ) {      

          lastPoint = freeDrawPoints[0];
          shapeClosed = true;   
          // drawFreeShape();                    

        }
      }
      freeDrawPoints.push(nextPoint);
      if (freeDrawPoints.length < 2 ) {        
        c.beginPath();
        c.moveTo(nextPoint.x, nextPoint.y);
        isDrawing = true;
      };
      console.table(freeDrawPoints); 
      // c.closePath();     
    }
  });
}


update();

