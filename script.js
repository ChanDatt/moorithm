const body = document.querySelector("body"),
    slidebar = document.querySelector(".slidebar"),
    toggle = document.querySelector(".toggle");

toggle.addEventListener("click", () =>{
    slidebar.classList.toggle("close");
});
    
function setupHoverShow(triggerSelector, targetSelector) {
    const trigger = document.querySelector(triggerSelector);
    const target = document.querySelector(targetSelector);

    if (!trigger || !target) {
        console.error("Không tìm thấy trigger hoặc target!", trigger, target);
        return;}

    // Khi hover vào trigger => hiện target
    trigger.addEventListener("mouseenter", () => {
        target.style.display = "flex";  // Sửa fixed -> block
    });

    trigger.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!target.matches(":hover")) {
                target.style.display = 'none';
            }
        }, 100);
    });

    // Khi rời khỏi target => ẩn luôn
    target.addEventListener('mouseleave', () => {
        target.style.display = 'none';
    });
}

// Gọi đúng id
setupHoverShow('#arr', '.home');