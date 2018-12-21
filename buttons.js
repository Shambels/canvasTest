function chooseRectangleTool() {
  toolIsCircle = false;
  toolIsFreeDraw = false;
  toolIsRectangle = true;
  update();
}

function chooseCircleTool() {
  toolIsRectangle = false;
  toolIsFreeDraw = false;
  toolIsCircle = true;
  update();
}

function chooseFreeDrawTool() {
  toolIsRectangle = false;
  toolIsCircle = false;
  toolIsFreeDraw = true;
  update();  
};

function addLayer() {
  layers.forEach(layer => {
    layer.selected = false;
  });
  let i = layers.length;
  layers[i] = new Concrete.Layer;
  viewport.add(layers[i]);
  layers[i].selected = true;
  console.table(layers);
}

function deleteSelectedLayers() {
  layers.forEach(layer => {
    if (layer.selected === true) {
      layers.splice(layers.indexOf(layer), 1);
      layer.destroy();
    }
  });  
  console.table(layers);
}

document.getElementById('chooseRectangleBtn').addEventListener('click', chooseRectangleTool);
document.getElementById('chooseCircleBtn').addEventListener('click', chooseCircleTool);
document.getElementById('chooseFreeDrawBtn').addEventListener('click', chooseFreeDrawTool);
document.getElementById('addLayer').addEventListener('click', addLayer);
document.getElementById('deleteSelectedLayers').addEventListener('click', deleteSelectedLayers);