const body = document.querySelector("body"),
    slidebar = document.querySelector(".slidebar"),
    toggle = document.querySelector(".toggle");

const canvas = document.getElementById("arrayCanvas");
const ctx = canvas.getContext("2d");

toggle.addEventListener("click", () =>{
    slidebar.classList.toggle("close");
});

window.onload = function(){
    setTimeout(() =>{
        toggle.click();
    }, 150);
};
let array = [12, 18, 13, 23, 4, 1, 19, 7];


// function drawArray(arr, highlightIndex = -1) {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   const barWidth = 60;
//   const gap = 10;
//   const startX = 20;
//   const barHeight = 80;

//   arr.forEach((val, index) => {
//     const x = startX + index * (barWidth + gap);
//     const y = canvas.height / 2 - barHeight / 2;

//     // Nếu là phần tử đang được highlight
//     if (index === highlightIndex) {
//       ctx.fillStyle = "#e74c3c"; // đỏ
//     } else {
//       ctx.fillStyle = "#3498db"; // xanh
//     }

//     // Vẽ hình chữ nhật (ô)
//     ctx.fillRect(x, y, barWidth, barHeight);

//     // Vẽ giá trị phần tử
//     ctx.fillStyle = "#fff";
//     ctx.font = "16px monospace";
//     ctx.textAlign = "center";
//     ctx.fillText(val, x + barWidth / 2, y + barHeight / 2 + 5);

//     // Vẽ chỉ số (index)
//     ctx.fillStyle = "#000";
//     ctx.font = "14px monospace";
//     ctx.fillText(index, x + barWidth / 2, y + barHeight + 15);
//   });
// }

// Gọi hàm khi load
drawArray(array);
