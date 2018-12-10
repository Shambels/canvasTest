    
    //  Distance Corner - Cursor
    dca = Math.sqrt( (mouse.x-ca.x)*(mouse.x-ca.x) + (mouse.y-ca.y)*(mouse.y-ca.y) );
    dcb = Math.sqrt( (mouse.x-cb.x)*(mouse.x-cb.x) + (mouse.y-cb.y)*(mouse.y-cb.y) );
    dcc = Math.sqrt( (mouse.x-cc.x)*(mouse.x-cc.x) + (mouse.y-cc.y)*(mouse.y-cc.y) );
    dcd = Math.sqrt( (mouse.x-cd.x)*(mouse.x-cd.x) + (mouse.y-cd.y)*(mouse.y-cd.y) );    
    if ( dca < 13 || dcd < 13 ) {
      canvas.style.cursor = "nwse-resize"
    } else if ( dcb < 13 || dcc < 13 ) {      
      canvas.style.cursor = "nesw-resize"
    } else {
      canvas.style.cursor = "default"
    }




    // Check if is inside
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


function drawfree() {


     if (isFreeDraw) {
      // Array[] of all coords
      // Register Cursor Coords(on click)+push()
      // 
      // Start drawing LineTo(mouse.xy) on mousemove
      // If first Point => BeginPath    
      // If next ~= first,(==last) ==> close path
    canvas.addEventListener('click', () => {
      // Register Cursor Coords, push in array
      nextPoint = {
        x: mouse.x,
        y: mouse.y
      }
      freeDrawPoints.push(nextPoint);
      // If its the first point
      if (freeDrawPoints.indexOf(nextPoint) === 0 ){      
        c.beginPath();  
        c.moveTo(nextPoint.x,nextPoint.y);    
        isDrawing = true;
      };
      // if its the last point, close path & isDrawing=false
  
      // console.table(freeDrawPoints);
  
  
  
    })
    canvas.addEventListener('mousemove', () => {
      if (isDrawing === true) {
        // drawFreeShape();
         // Set Line Style
        c.strokeStyle = "rgba(255,255,255,1)";
        c.setLineDash([5, 5]);
        c.lineTo(mouse.x,mouse.y);
        c.stroke();
        
      }
    })
  }
}