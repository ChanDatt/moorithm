const body = document.querySelector("body");
const slidebar = document.querySelector(".slidebar");
const toggle = document.querySelector(".toggle");
const numElements = document.getElementById("numElements")
const elementsInput = document.getElementById("elements");
const svg = document.getElementById('arraySVG');
const wrongText = document.getElementById('wrongElements');
const valueInput = document.getElementById("insertValue");
const indexInput = document.getElementById("insertIndex");


const rectWidth = 60;
const rectHeight = 60;
const gap = 5;
const MAX_VALUE = 98;
let startX = null;
let targetX = null;

const array = [12, 18, 13, 23, 4, 1, 19, 7];


toggle.addEventListener("click", () =>{
    slidebar.classList.toggle("close");
});

elementsInput.addEventListener("click", function(){
    this.classList.add("expanded")
})

addEventListener("click", function(event){
    if(!elementsInput.contains(event.target) && event.target != elementsInput){
        elementsInput.classList.remove("expanded");
    }
    if (!insertValue.contains(event.target) && !insertIndex.contains(event.target)) {
        insertValue.value = "";
        insertIndex.value = "";
    }
})

// window.onload = function(){
//     setTimeout(() =>{
//         toggle.click();
//     }, 150);
// };

function generateRandom() {
  const n = parseInt(document.getElementById("numElements").value);
  const randomArray = Array.from({ length: n }, () => Math.floor(Math.random() * MAX_VALUE) + 1);
  elementsInput.value = randomArray.join(',');
  drawArray(randomArray);
}

numElements.addEventListener("blur", () => {
    let value = parseInt(numElements.value);

    if(isNaN(value) || value < 5){
        numElements.value = 5;
    } else if(value > 20){
        numElements.value = 20;
    }
})

elementsInput.addEventListener("input", () => {
  let value = elementsInput.value;
  let newValue = "";
  let currentNum = "";
  let lastChar = "";
  let parts = [];

  for (let i = 0; i < value.length; i++) {
    const c = value[i];

    if (c >= '0' && c <= '9') {
      currentNum += c;
      const num = Number(currentNum);
      if (num < 99) {
        newValue += c;
        lastChar = c;
      } else {
        break;
      }
    } else if (c === ',') {
      if (currentNum !== "" && lastChar !== ',') {
        newValue += ',';
        parts.push(Number(currentNum));
        currentNum = "";
        lastChar = ',';
      } else {
        break;
      }
    } else {
      break;
    }
  }
  elementsInput.value = newValue;
});

function addElement() {


  const valueStr = valueInput.value.trim();
  const indexStr = indexInput.value.trim();

  wrongText.textContent = "";
  valueInput.style.border = "1px solid #ccc";
  indexInput.style.border = "1px solid #ccc";

  if (valueStr === "" || indexStr === "") {
    wrongText.textContent = "Both value and index are required.";
    if (valueStr === "") valueInput.style.border = "3px solid red";
    if (indexStr === "") indexInput.style.border = "3px solid red";
    return;
  }

  const value = parseInt(valueStr);
  const index = parseInt(indexStr);

  if (isNaN(value) || isNaN(index)) {
    wrongText.textContent = "Both value and index must be valid numbers.";
    valueInput.style.border = "3px solid red";
    indexInput.style.border = "3px solid red";
    return;
  }

  if (value < 0 || value > 99 || index < 0 || index > 20) {
    wrongText.textContent = "Value must be 0–99 and index must be 0-arr length.";
    if (value < 0 || value > 99) valueInput.style.border = "3px solid red";
    if (index < 0 || index > 20) indexInput.style.border = "3px solid red";
    return;
  }

  const arr = getArrayFromInput();

  if (index <= arr.length) {
    animateAddElement(arr, value, index);
  } else {
    wrongText.textContent = `Index (${index}) must be <= array length (${arr.length})`;
    indexInput.style.border = "3px solid red";
  }
}



function getArrayFromInput(){
    const input = document.getElementById("elements").value;
    const parts = input.split(',').map(str=>str.trim());

    const array = parts.filter(str=>str!=="").map(numstr => parseInt(numstr)).filter(num => !isNaN(num) && num >= 0  && num < 99);
    return array;
}

function drawArray(arr) {
    svg.innerHTML = '';

    const totalWidth = arr.length * rectWidth + (arr.length - 1) * gap;
    startX = (svg.clientWidth - totalWidth) / 2;
    arr.forEach((value, index) => {
        const x = startX + index * (rectWidth + gap);
        const y = 20;

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("transform", `translate(${x}, ${y}) scale(0)`);
        
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute('id', `rect-${index}`);
        rect.setAttribute('width', rectWidth);
        rect.setAttribute('height', rectHeight);
        rect.setAttribute('rx', 10); 
        rect.setAttribute('ry', 10);
        rect.setAttribute('stroke', "#5791AB");

        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("id", `text-${index}`);
        text.setAttribute('x', rectWidth / 2);
        text.setAttribute('y', rectHeight / 2 + 5); 
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute("font-size", "18");
        text.textContent = value;


        const indexText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        indexText.setAttribute("x", rectHeight / 2);
        indexText.setAttribute("y", rectHeight + 20);
        indexText.setAttribute("text-anchor", "middle");
        indexText.setAttribute("font-size", "15")
        indexText.textContent = index;
        
        g.appendChild(indexText);
        g.appendChild(rect);
        g.appendChild(text);
        svg.appendChild(g);

        setTimeout(() => animatePopUp(g, x, y), index * 50);
    });
}

function animatePopUp(g, x, y) {
  let scale = 0;
  const step = 0.1;

  function grow() {
    if (scale >= 1) {
      g.setAttribute("transform", `translate(${x}, ${y}) scale(1)`);
      return;
    }

    scale += step;
    const scaleValue = Number(scale.toFixed(2));
    g.setAttribute("transform", `translate(${x}, ${y}) scale(${scaleValue})`);

    requestAnimationFrame(grow);
  }
  grow();
}

function animateAddElement(arr, value, index) {
  svg.innerHTML = '';
  const updatedArray = [...arr];
  if (index > updatedArray.length) {
    animateInvalidInsert(value, index, updatedArray.length);
    return;
  }

  const totalWidth = (updatedArray.length + 1) * rectWidth + updatedArray.length * gap;
  startX = (svg.clientWidth - totalWidth) / 2;
  const y = 20;
  const newY = y + 100;

  const elementGroups = [];
  updatedArray.forEach((val, i) => {
    const x = startX + i * (rectWidth + gap);
    const g = createElementSVG(val, i, x, y);
    svg.appendChild(g);
    elementGroups.push(g);
  });

  const startX0 = startX;
  const newElement = createElementSVG(value, index, startX0, newY, "#918640ff");
  svg.appendChild(newElement);  

  animateMoveRight(newElement, startX0, newY, index, () => {
    for (let i = updatedArray.length - 1; i >= index; i--) {
      const g = elementGroups[i];
      const fromX = startX + i * (rectWidth + gap);
      const toX = startX + (i + 1) * (rectWidth + gap);
      animateShiftRight(g, fromX, y, toX, y, i + 1); 
    }

    const finalX = startX + index * (rectWidth + gap);
    animateSlideUp(newElement, finalX, newY, finalX, y, index);

    updatedArray.splice(index, 0, value);
    elementsInput.value = updatedArray.join(',');
  });

}

function animateSlideUp(g, fromX, fromY, toX, toY, newIndex) {
  let y = fromY;
  const step = 4;

  function slide() {
    if (y <= toY) {
      g.setAttribute("transform", `translate(${toX}, ${toY}) scale(1)`);
      const indexText = Array.from(g.childNodes).find(node => node.tagName === 'text' && node.getAttribute('y') === String(rectHeight + 20));
      if (indexText) {
        indexText.textContent = newIndex;
        resetRectStrokes();
      } else {
        const newIndexText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        newIndexText.setAttribute("x", rectHeight / 2);
        newIndexText.setAttribute("y", rectHeight + 20);
        newIndexText.setAttribute("text-anchor", "middle");
        newIndexText.setAttribute("font-size", "15");
        newIndexText.textContent = newIndex;
        g.appendChild(newIndexText);
      }
      return;
    }

    y -= step;
    g.setAttribute("transform", `translate(${toX}, ${y}) scale(1)`);
    requestAnimationFrame(slide);
  }
  slide();
}

function animateShiftRight(g, fromX, fromY, toX, toY, newIndex) {
  let x = fromX;
  const step = 5;

  function move() {
    if (x >= toX) {
      g.setAttribute("transform", `translate(${toX}, ${toY}) scale(1)`);

      const indexText = Array.from(g.childNodes).find(
        node => node.tagName === 'text' && node.getAttribute('y') === String(rectHeight + 20)
      );
      if (indexText) {
        indexText.textContent = newIndex;
      }
      return;
    }

    x += step;
    g.setAttribute("transform", `translate(${x}, ${toY}) scale(1)`);
    requestAnimationFrame(move);
  }

  requestAnimationFrame(move);
}


function animateInvalidInsert(value, index, length) {
  const x = startX + (Math.min(index, length) * (rectWidth + gap));
  const y = 20 + 100;

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${x}, ${y})`);

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute('width', rectWidth);
  rect.setAttribute('height', rectHeight);
  rect.setAttribute('rx', 10);
  rect.setAttribute('ry', 10);

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute('x', rectWidth / 2);
  text.setAttribute('y', rectHeight / 2 + 5);
  text.setAttribute('text-anchor', 'middle');
  text.textContent = value;

  g.appendChild(rect);
  g.appendChild(text);
  svg.appendChild(g);

  setTimeout(() => {
    svg.removeChild(g);
  }, 1500);
}

function createElementSVG(value, index, x, y, color = "#5791AB") {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${x}, ${y})`);

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute('width', rectWidth);
  rect.setAttribute('height', rectHeight);
  rect.setAttribute('rx', 10);
  rect.setAttribute('ry', 10);
  rect.setAttribute("stroke", color);


  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute('x', rectWidth / 2);
  text.setAttribute('y', rectHeight / 2 + 5);
  text.setAttribute('text-anchor', 'middle');
  text.textContent = value;

  g.appendChild(rect);
  g.appendChild(text);

  const indexText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  indexText.setAttribute("x", rectHeight / 2);
  indexText.setAttribute("y", rectHeight + 20);
  indexText.setAttribute("text-anchor", "middle");
  indexText.textContent = index;
  g.appendChild(indexText);

  return g;
}
function animateMoveRight(g, startX, startY, targetIndex, onFinish) {
  const step = rectWidth + gap;
  let currentIndex = 0;

  function stepRight() {
    if (currentIndex >= targetIndex) {
      onFinish();
      return;
    }

    const toX = startX + (currentIndex + 1) * step;
    let x = startX + currentIndex * step;
    const speed = 4;

    function move() {
      if (x >= toX) {
        g.setAttribute("transform", `translate(${toX}, ${startY})`);
        currentIndex++;
        setTimeout(stepRight, 700);
        return;
      }
      x += speed;
      g.setAttribute("transform", `translate(${x}, ${startY})`);
      requestAnimationFrame(move);
    }

    move();
  }

  stepRight();
}

function resetRectStrokes() {
  const rects = document.querySelectorAll("rect");
  rects.forEach(rect => {
    rect.setAttribute("stroke", "#5791AB");
  });
}


//Update
function updateElement() {
  const valueInput = document.getElementById("insertValue");
  const indexInput = document.getElementById("insertIndex");
  const wrongText = document.getElementById("wrongElements");

  const valueStr = valueInput.value.trim();
  const indexStr = indexInput.value.trim();

  const value = parseInt(valueStr);
  const index = parseInt(indexStr);

  const arr = getArrayFromInput(); 

  if (
    valueStr === "" || indexStr === "" ||
    isNaN(value) || value < 0 || value > 99 ||
    isNaN(index) || index < 0 || index >= arr.length
  ) {
    wrongText.textContent = `Index must be in range [0, ${arr.length - 1}], Value [0, 99]`;
    return;
  }

  wrongText.textContent = "";
  arr[index] = value;

  animateUpdateElement(value, value);
  elementsInput.value = arr.join(',');

}

function animateUpdateElement(index, newValue) {
  const arr = getArrayFromInput();
  if (index < 0 || index >= arr.length) {
    wrongText.textContent = `${index} does not exist in the array`;
    return;
  }

  const delay = 500; // ms
  let current = 0;

  function step() {
    if (current > index) {
      setTimeout(resetRectStrokes, delay);
      return;
    }

    const rect = document.getElementById(`rect-${current}`);
    const text = document.getElementById(`text-${current}`);

    if (!rect || !text) return;

    const prevStroke = rect.getAttribute("stroke") || "black";
    rect.setAttribute("stroke", "orange");

    setTimeout(() => {
      if (current === index) {
        text.textContent = newValue;
        rect.setAttribute("stroke", "#2aae31ff");
      } else {
        rect.setAttribute("stroke", prevStroke);
      }

      current++;
      step(); 
    }, delay);
  }

  step();
}

function deleteElement() {
  const arr = getArrayFromInput();
  const index = parseInt(indexInput.value);
  const y = 20;

  if (index < 0 || index >= arr.length) {
    wrongText.textContent = "Invalid index";
    return;
  }
  wrongText.textContent = "";

  svg.innerHTML = '';

  const totalWidth = arr.length * rectWidth + (arr.length - 1) * gap;
  const startX = (svg.clientWidth - totalWidth) / 2;
  const groups = [];

  arr.forEach((val, i) => {
    const x = startX + i * (rectWidth + gap);
    const g = createElementSVG(val, i, x, y);
    svg.appendChild(g);
    groups.push({ g, x, index: i });
  });

  let current = 0;
  const delay = 500;

  const checkInterval = setInterval(() => {
    groups.forEach((item, i) => {
      const rect = item.g.querySelector('rect');
      rect.setAttribute("stroke", i === current ? "#ffa726" : "#5791AB"); 
    });

    if (current === index) {
      clearInterval(checkInterval);

      const { g } = groups[index];
      let downY = 80;
      let currentY = y;

      function slideDown() {
        if (currentY >= downY) {
          g.remove();

          const shiftDistance = rectWidth + gap;

          for (let i = index + 1; i < groups.length; i++) {
            const item = groups[i];
            const oldX = item.x;
            const newX = oldX - shiftDistance;
            animateShiftLeft(item.g, oldX, y, newX, y, i - 1);
            item.x = newX;
            item.index = i - 1;
          }

          const newArr = arr.slice(0, index).concat(arr.slice(index + 1));
          elementsInput.value = newArr.join(',');

          setTimeout(() => {
            centerElements(groups, index, y, newArr.length);
          }, 500);

          return;
        }
        currentY += 4;
        g.setAttribute("transform", `translate(${groups[index].x}, ${currentY}) scale(1)`);
        requestAnimationFrame(slideDown);
      }
      slideDown();
    }

    current++;
  }, delay);
}

function animateShiftLeft(g, fromX, fromY, toX, toY, newIndex) {
  const duration = 400;
  const startTime = performance.now();

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function move(time) {
    const elapsed = time - startTime;
    let progress = Math.min(elapsed / duration, 1);
    let easedProgress = easeOutQuad(progress);

    let x = fromX + (toX - fromX) * easedProgress;
    g.setAttribute("transform", `translate(${x}, ${toY}) scale(1)`);

    if (progress < 1) {
      requestAnimationFrame(move);
    } else {
      setTimeout(() => {
        const indexText = Array.from(g.childNodes).find(
          node => node.tagName === 'text' && node.getAttribute('y') === String(rectHeight + 20)
        );
        if (indexText) {
          indexText.textContent = newIndex;
        }
      }, newIndex * 200); 
    }
  }

  requestAnimationFrame(move);
}


function centerElements(groups, removedIndex, y, newLength) {
  if (newLength === 0) return; 

  const totalWidth = newLength * rectWidth + (newLength - 1) * gap;
  const startXNew = (svg.clientWidth - totalWidth) / 2;

  let firstElement = groups.find(gp => {
    return gp.g.parentNode === svg;
  });

  if (!firstElement) return;

  const currentX0 = firstElement.x;
  const deltaX = startXNew - currentX0; 

  groups.forEach((item) => {
    if (item.g.parentNode !== svg) return;
    const oldX = item.x;
    const newX = oldX + deltaX;

    animateShiftLeft(item.g, oldX, y, newX, y, item.index);
    item.x = newX; 
  });
}


drawArray(array);

function generateData() {
    const arr = getArrayFromInput();
    drawArray(arr)
}

