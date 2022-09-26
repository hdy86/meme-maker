const drawBtn = document.getElementById("draw-btn");
const fillBtn = document.getElementById("fill-btn");
const eraserBtn = document.getElementById("eraser-btn");
const destroyBtn = document.getElementById("destroy-btn");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const saveBtn = document.getElementById("save-btn");
const color = document.getElementById("color");
const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
);
const fontInput = document.getElementById("font-family");
const sizeInput = document.getElementById("font-size");
const weightInput = document.getElementById("font-weight");
const lineWidthText = document.getElementById("line-width-text");
const lineWidth = document.getElementById("line-width");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 640;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
lineWidthText.innerText = lineWidth.value;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";

let isPainting = false;
let isFilling = false;

// 색상
function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}
function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

// 그리기
function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}
function startPainting() {
  isPainting = true;
}
function cancelPainting() {
  isPainting = false;
  ctx.beginPath();
}
function onLineWidthChange(event) {
  lineWidthText.innerText = event.target.value;
  ctx.lineWidth = event.target.value;
}
function onModeClick(mode) {
  ctx.strokeStyle = color.value;
  isFilling = mode;
}
function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
}
function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

// 텍스트
function onDoubleClick(event) {
  const text = textInput.value;
  const font = fontInput.value;
  const size = sizeInput.value;
  const weight = weightInput.value;
  if (text !== "") {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = `${weight} ${size}px ${font}`;
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
}

// 이미지
function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
}

// 삭제
function onDestroyClick() {
  ctx.save();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.restore();
}

// 저장
function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);
canvas.addEventListener("dblclick", onDoubleClick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

drawBtn.addEventListener("click", () => onModeClick(false));
fillBtn.addEventListener("click", () => onModeClick(true));
eraserBtn.addEventListener("click", onEraserClick);
destroyBtn.addEventListener("click", onDestroyClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
