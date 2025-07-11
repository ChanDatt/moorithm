const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
const slidebar = document.querySelector(".slidebar");
const toggle = document.querySelector(".toggle");
const elementsInput = document.getElementById("elements");
const wrongElements = document.getElementById("wrongElements");
const pseudocode = document.getElementById("pseudocode-box");

let array = [];
let steps = [];
let stepIndex = 0;
let isSorting = false;
let intervalID;

const btn = document.getElementById("btnAutoSorting");
const slider = document.getElementById("stepSlider");
const MAX_VALUE = 30; 
const SCALE = canvas.height / MAX_VALUE - 1;

toggle.addEventListener("click", () => {
  slidebar.classList.toggle("close");
});

elementsInput.addEventListener("click", function() {
  this.classList.add("expanded");
});


// Kiểm tra nhập input hợp lệ
elementsInput.addEventListener("input", function () {
  const inputString = elementsInput.value.trim();
  const values = inputString.split(',').map(v => v.trim());
  const parsed = values.map(Number);

  let hasError = false;
  for (let i = 0; i < parsed.length; i++) {
    if (isNaN(parsed[i])) {
      hasError = true;
      wrongElements.textContent = `"${values[i]}" is not a valid number`;
      break;
    } else if (parsed[i] > MAX_VALUE || parsed[i] < 1) {
      hasError = true;
      wrongElements.textContent = `"${parsed[i]}" must be between 1 and ${MAX_VALUE}`;
      break;
    }
  }

  if (!hasError) {
    wrongElements.textContent = "";
    array = parsed;
  }
});

function generateRandom() {
  const n = parseInt(document.getElementById("numElements").value);

  if (isNaN(n) || n < 5 || n > 30) {
    wrongElements.textContent = "Please enter a number between 5 and 30";
    return;
  }

  const randomArray = Array.from({ length: n }, () => Math.floor(Math.random() * MAX_VALUE) + 1);
  elementsInput.value = randomArray.join(',');
  wrongElements.textContent = "";

  generateData(); 
}


// Vẽ thanh cột
function drawWithLabels(arr, highlight = [], sorted = []) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / arr.length;

  arr.forEach((val, idx) => {
    let color = "#3498db";
    const x = idx * barWidth;
    const y = canvas.height - val * SCALE;
    const height = val * SCALE;

    if (sorted.includes(idx)) {
      const gradient = ctx.createLinearGradient(x, canvas.height, x, y);
      gradient.addColorStop(0, "#cfab27");
      gradient.addColorStop(0.90, "#e74c3c"); 
      color = gradient;
    } else if (highlight.includes(idx)) {
      const gradient = ctx.createLinearGradient(x, canvas.height, x, y);
      gradient.addColorStop(0, "#3498db");
      gradient.addColorStop(0.9, "#e74c3c");  
      color = gradient;
    }

    ctx.fillStyle = color;
    ctx.fillRect(x, y, barWidth - 2, height);

    ctx.fillStyle = "#fff";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(Math.round(val), x + barWidth / 2, y - 6);
    ctx.fillText(idx, x + barWidth / 2, canvas.height - 4);
  });
  elementsInput.classList.remove("expanded");
}

// Animation tạo mảng
function animateCreate(arr) {
  const stepsCount = 30;
  let frame = 0;
  const tempArr = Array(arr.length).fill(0);

  const growInterval = setInterval(() => {
    frame++;
    for (let i = 0; i < arr.length; i++) {
      tempArr[i] = arr[i] * (frame / stepsCount);
    }
    drawWithLabels(tempArr);
    if (frame === stepsCount) {
      clearInterval(growInterval);
      drawWithLabels(arr);
    }
  }, 16);
}

// Hàm chính: Tạo mảng từ input hoặc random
function generateData() {
  const n = parseInt(document.getElementById("numElements").value);
  const input = elementsInput.value.trim();

  if (isNaN(n) || n < 5 || n > 30) {
    wrongElements.textContent = "Please enter a number between 5 and 30";
    return;
  }

  let values;

  if (input.length > 0) {
    values = input.split(',').map(str => Number(str.trim()));
    const valid = values.every(val => !isNaN(val) && val >= 1 && val <= MAX_VALUE);

    if (values.length !== n) {
      wrongElements.textContent = `Please input exactly ${n} elements.`;
      return;
    }

    if (!valid) {
      wrongElements.textContent = "All elements must be integers between 1 and " + MAX_VALUE;
      return;
    }
  } else {
    values = Array.from({ length: n }, () => Math.floor(Math.random() * MAX_VALUE) + 1);
    elementsInput.value = values.join(','); 
  }

  array = values;
  steps = [{ array: array.slice(), comparing: [] }];
  stepIndex = 0;
  elementsInput.classList.remove("expanded");
  animateCreate(array);
  runSort();
}

// Bubble Sort lưu từng bước
function runSort() {
  let arr = array.slice();
  let sorted = [];
  steps = [{ array: arr.slice(), comparing: [], sorted: [] }];

  for (let i = 0; i < arr.length; i++) {
    steps.push({ array: arr.slice(), comparing: [], sorted: sorted.slice(), line: 3});
    for (let j = 0; j < arr.length - i - 1; j++) {
      steps.push({ array: arr.slice(), comparing: [j, j + 1], sorted: sorted.slice(), line: 4 });
      steps.push({ array: arr.slice(), comparing: [j, j + 1], sorted: sorted.slice(), line: 5 });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({ array: arr.slice(), comparing: [j, j + 1], sorted: sorted.slice(), line: 6 });
      }
    }
    sorted.push(arr.length - i - 1);
    steps.push({ array: arr.slice(), comparing: [], sorted: sorted.slice(), line: 4 });
  }

  slider.max = steps.length - 1;
  slider.value = 0;
  drawWithLabels(steps[0].array, steps[0].comparing, steps[0].sorted);
}

// Bước tiếp
function nextStep() {
  if (stepIndex < steps.length - 1) {
    stepIndex++;
    drawWithLabels(steps[stepIndex].array, steps[stepIndex].comparing, steps[stepIndex].sorted);
    slider.value = stepIndex;
    updateSliderProgress(slider)
    highlightLine(steps[stepIndex].line || 0);
  }
}

// Bước trước
function prevStep() {
  if (stepIndex > 0) {
    stepIndex--;
    drawWithLabels(steps[stepIndex].array, steps[stepIndex].comparing, steps[stepIndex].sorted);
    slider.value = stepIndex;
    updateSliderProgress(slider)
    highlightLine(steps[stepIndex].line || 0);
  }
}

// Reset về bước đầu
function resetSteps() {
  stepIndex = 0;
  drawWithLabels(steps[0].array, steps[0].comparing, steps[0].sorted);
  slider.value = 0;
  updateSliderProgress(slider)
  highlightLine(steps[stepIndex].line || 0);
}

// Tự động chạy
function autoSort() {
  if (isSorting) {
    clearInterval(intervalID);
    isSorting = false;
    btn.style.backgroundColor = "";
    btn.textContent = "Auto Sort";
    btn.style.color = "#9ECEDE";
  } else {
    isSorting = true;
    btn.style.backgroundColor = "#5791AB";
    btn.style.color = "#062B43";
    btn.textContent = "Pause";

    intervalID = setInterval(() => {
      if (stepIndex < steps.length - 1) {
        stepIndex++;
        drawWithLabels(steps[stepIndex].array, steps[stepIndex].comparing, steps[stepIndex].sorted);
        slider.value = stepIndex;
        updateSliderProgress(slider)
        highlightLine(steps[stepIndex].line || 0);
      } else {
        clearInterval(intervalID);
        isSorting = false;
        btn.style.backgroundColor = "";
        btn.textContent = "Auto Sort";
        btn.style.color = "#9ECEDE";
      }
    }, 500);
  }
}

function updateSliderProgress(sliderElement){
  const min = sliderElement.min || 0;
  const max = sliderElement.max || 100;
  const value = sliderElement.value;
  const percentage = ((value - min) / (max - min)) * 100;

  sliderElement.style.setProperty('--progress-percent', `${percentage}%`);
}

// Thay đổi slider
function sliderStepChanged(value) {
  stepIndex = parseInt(value);
  drawWithLabels(steps[stepIndex].array, steps[stepIndex].comparing, steps[stepIndex].sorted);
  updateSliderProgress(slider);
  highlightLine(steps[stepIndex].line || 0);
}

document.addEventListener('DOMContentLoaded', () => {
  updateSliderProgress(slider)
})

function highlightLine(lineNum){
  const lines = document.querySelectorAll('#pseudocode span');
  lines.forEach((line, idx) => {
    line.classList.toggle("highlight", idx + 1 === lineNum);
  });
}

// Gọi khi load
generateData();

pseudocode.addEventListener("click", function() {
  this.classList.add("pseudocode_close")
})