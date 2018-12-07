var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;
var isDrawing = false;
var isRectangle = true;
var isCircle = false;
var isFreeDraw = false;
var isInside = false;
var isMoving = false;
var Rectangle;
var Circle;
var mouse = {
  x: undefined,
  y: undefined
}
var x0, y0;
var x2, y2;
var dx, dy;
var mx, my;
var rect;
var ca= {
  x: undefined,
  y: undefined
}
var cb= {
  x: undefined,
  y: undefined
}
var cc= {
  x: undefined,
  y: undefined
}
var cd= {
  x: undefined,
  y: undefined
}

var corners = [ca,cb,cc,cd];

function orderPositions (a,b) {
  return a.x - b.x || a.y - b.y
} 

window.addEventListener('mousemove', () => {
  mouse.x = event.x;
  mouse.y = event.y;
  // If there's a RECTANGLE already
  if (x2 && y2 && x0 && y0) {
    // find 4 corners coord (ca = origin => cd = end)
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

    // Check if cursor is inside RECTANGLE
    if (c.isPointInPath(mouse.x, mouse.y)) {
      isInside = true;
      if (!isDrawing && !isMoving){
        canvas.style.cursor = "grab"
      }
    } else {
      isInside = false;
      canvas.style.cursor = "crosshair";
    }
    function uselessIsInsideCheck() {
      // // Check Rectangle orientation
      // // CASE 1
      // if (x2>x0 && y2>y0){
      //   // Check if mouse is inside Rectangle on click   
      //   if ((mouse.x > x0) && (mouse.x < x2) && (mouse.y > y0) && (mouse.y < y2)) {
      //     isInside = true;
      //     console.log('isInside = ' + isInside);
      //   } else {
      //     isInside = false;
      //     console.log('isInside = ' + isInside);
      //   }
      // }
      // // CASE 2 
      // if (x2>x0 && y2<y0){      
      //   if ((mouse.x > x0) && (mouse.x < x2) && (mouse.y < y0) && (mouse.y > y2)) {
      //     isInside = true;
      //     console.log('isInside = ' + isInside);
      //   } else {
      //     isInside = false;
      //     console.log('isInside = ' + isInside);
      //   }
      // }
      // // CASE 3
      // if (x2<x0 && y2<y0){      
      //   if ((mouse.x < x0) && (mouse.x > x2) && (mouse.y < y0) && (mouse.y > y2)) {
      //     isInside = true;
      //     console.log('isInside = ' + isInside);
      //   } else {
      //     isInside = false;
      //     console.log('isInside = ' + isInside);
      //   }
      // }
      // // CASE 4
      // if (x2<x0 && y2>y0){       
      //   if ((mouse.x < x0) && (mouse.x > x2) && (mouse.y > y0) && (mouse.y < y2)) {
      //     isInside = true;
      //     console.log('isInside = ' + isInside);
      //   } else {
      //     isInside = false;
      //     console.log('isInside = ' + isInside);
      //   }
      // }
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
    canvas.addEventListener('mousemove', function abc() {
      if (isMoving === false) {
        // Define New Rectangle dimensions from origin to Cursor.
        x2 = event.x;
        y2 = event.y;
        dx = x2 - x0;
        dy = y2 - y0;
      } else {
        // 
        mx = dx0 + (mouse.x - mx0);
        my = dy0 + (mouse.y - my0);
        x2 = mx + dx;
        y2 = my + dy;
        x0 = mx;
        y0 = my;
      }
      if (isDrawing || isMoving) {
        c.strokeStyle = "rgba(255,255,255,.9)";
        c.setLineDash([5, 15]);
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.beginPath();
        rect = c.rect(x0, y0, dx, dy);
        strokerect = c.strokeRect(x0,y0,dx,dy);
        corners = [ca,cb,cc,cd];
        corners.sort(orderPositions);
        console.table(corners);        
        // c.stroke();
      }
      canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        isMoving = false;
        canvas.removeEventListener('mousemove', abc);
      })
    });
  });















} else if (isCircle) {

}