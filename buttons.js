function chooseRectangleTool() {
  toolIsCircle = false;
  toolIsFreeDraw = false;
  toolIsRectangle = true;
  update();

  console.log(toolIsRectangle, toolIsCircle, toolIsFreeDraw);
}

function chooseCircleTool() {
  toolIsRectangle = false;
  toolIsFreeDraw = false;
  toolIsCircle = true;
  update();
  console.log(toolIsRectangle, toolIsCircle, toolIsFreeDraw);
}

function chooseFreeDrawTool() {
  toolIsRectangle = false;
  toolIsCircle = false;
  toolIsFreeDraw = true;
  update();
  console.log(toolIsRectangle, toolIsCircle, toolIsFreeDraw);
};

document.getElementById('chooseRectangleBtn').addEventListener('click', chooseRectangleTool);
document.getElementById('chooseCircleBtn').addEventListener('click', chooseCircleTool);
document.getElementById('chooseFreeDrawBtn').addEventListener('click', chooseFreeDrawTool);