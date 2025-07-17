const body = document.querySelector("body");
const slidebar = document.querySelector(".slidebar");
const toggle = document.querySelector(".toggle");
const numElements = document.getElementById("numElements")
const elementsInput = document.getElementById("elements");
const svg = document.getElementById('arraySVG');


const rectWidth = 60;
const rectHeight = 60;
const gap = 5;
const MAX_VALUE = 98

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


function getArrayFromInput(){
    const input = document.getElementById("elements").value;
    const parts = input.split(',').map(str=>str.trim());

    const array = parts.filter(str=>str!=="").map(numstr => parseInt(numstr)).filter(num => !isNaN(num) && num >= 0  && num < 99);
    return array;
}



function drawArray(arr) {
    svg.innerHTML = ''; 

    const totalWidth = arr.length * rectWidth + (arr.length - 1) * gap;
    const startX = (svg.clientWidth - totalWidth) / 2;

    arr.forEach((value, index) => {
        const x = startX + index * (rectWidth + gap);
        const y = 20;
        
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', rectWidth);
        rect.setAttribute('height', rectHeight);
        rect.setAttribute('rx', 10); 
        rect.setAttribute('ry', 10);
        rect.classList.add('array-rect');
        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute('x', x + rectWidth / 2);
        text.setAttribute('y', y + rectHeight / 2 + 5); 
        text.setAttribute('text-anchor', 'middle');
        text.textContent = value;
        
        svg.appendChild(rect);
        svg.appendChild(text);
    });
}

drawArray(array);

function generateData() {
    const arr = getArrayFromInput();
    drawArray(arr);
}