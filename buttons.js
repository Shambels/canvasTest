function chooseRectangleTool() {
  isCircle = false;
  isFreeDraw = false;
  isRectangle = true;
  update();

  console.log(isRectangle, isCircle, isFreeDraw);
}

function chooseCircleTool() {
  isRectangle = false;
  isFreeDraw = false;
  isCircle = true;
  update();
  console.log(isRectangle, isCircle, isFreeDraw);
}

function chooseFreeDrawTool() {
  isRectangle = false;
  isCircle = false;
  isFreeDraw = true;
  update();
  console.log(isRectangle, isCircle, isFreeDraw);
};

document.getElementById('chooseRectangleBtn').addEventListener('click', chooseRectangleTool);
document.getElementById('chooseCircleBtn').addEventListener('click', chooseCircleTool);
document.getElementById('chooseFreeDrawBtn').addEventListener('click', chooseFreeDrawTool);