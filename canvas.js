var canvas = document.querySelector('canvas');
canvas.style.cursor = "crosshair";
var c = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;
var isDrawing = false;
var isRectangle = false;
var isCircle = false;
var isFreeDraw = true;
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
var radius, fixradius;

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
  c.strokeStyle = "rgba(255,255,255,.9)";
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


// Permanent Mouse event Listener (get position / set cursor / ... )
window.addEventListener('mousemove', () => {
  // Get Cursor Current Coords  
  mouse.x = event.x;
  mouse.y = event.y;
  // If there's a RECTANGLE already
  if (x2 && y2 && x0 && y0) {
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
});

if (isRectangle) {
  canvas.addEventListener('mousedown', () => {
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

    canvas.addEventListener('mousemove', function rectangleOnMove() {
      if (mouseDown ===true) {

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
      canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        isMoving = false;
        mouseDown = false;
        canvas.removeEventListener('mousemove', rectangleOnMove);
      })
    }
    });
  });

  // ADD TO LAYER SO CLEARRECT DOESN't ERASE WHOLE CANVAS (EITHER ON ==>MOUSEUP<== OR ON "CONFIRM" BUTTON)

  //************** * CIRCLE  *******************//
} else if (isCircle) {
  canvas.addEventListener('mousedown', () => {
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
      // registercurrent radius
      fixradius = radius
      // Register mouse pos on dragstart 
      mx0 = mouse.x;
      my0 = mouse.y;      
    }
    canvas.addEventListener('mousemove', function circleOnMove() {   
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
        center.x = x0 + (mouse.x-mx0);
        center.y = y0 + (mouse.y-my0);
        // radius = fixradius;
      }
      if (isDrawing || isMoving) {
        // console.warn('center', center);
        // console.log('radius',radius);
        drawCircle();
      }
      canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        isMoving = false;
        mouseDown = false;
        canvas.removeEventListener('mousemove', circleOnMove);
      })
    }
    });
    
  });
} else if (isFreeDraw) {
  canvas.addEventListener('click', () => {
    // Register Cursor Coords
    // Start drawing LineTo(mouse.xy) on mousemove
    // If first Point => BeginPath    
    // If next ~= first,(==last) ==> close path
  })



}