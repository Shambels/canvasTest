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


window.addEventListener('mousemove', () => {
  mouse.x = event.x;
  mouse.y = event.y;
});

if (isRectangle) {

  canvas.addEventListener('mousedown', () => {
    // Check if mouse is inside Rectangle on click   
    if ((mouse.x > x0) && (mouse.x < x2) && (mouse.y > y0) && (mouse.y < y2)) {
      isInside = true;
      console.log('isInside = ' + isInside);
    } else {
      isInside = false;
      console.log('isInside = ' + isInside);
    }
    if (isInside === false) {
      x0 = event.x;
      y0 = event.y;
      isDrawing = true;
    } else {
      isMoving = true;
      dx0 = x0;
      dy0 = y0;
      mx0 = mouse.x;
      my0 = mouse.y;
    }
    canvas.addEventListener('mousemove', function abc() {
      if (isMoving === false) {
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
      if ( isDrawing || isMoving ) {
        c.strokeStyle = "rgba(255,15,100,.9)";
        c.setLineDash([5, 5]);
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.strokeRect(x0, y0, dx, dy);     
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