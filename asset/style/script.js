const body = document.querySelector("body"),
    slidebar = document.querySelector(".slidebar"),
    toggle = document.querySelector(".toggle");

toggle.addEventListener("click", () =>{
    slidebar.classList.toggle("close");
});
    
function setupHoverShow(triggerSelector, targetSelector, delay = 500) {
    const trigger = document.querySelector(triggerSelector);
    const target = document.querySelector(targetSelector);
    let timeoutId;

    trigger.addEventListener("mouseenter", () => {
        clearTimeout(timeoutId); 
        target.style.display = "flex";
    });

    trigger.addEventListener("mouseleave", () => {
        timeoutId = setTimeout(() => {
            if (!target.matches(":hover") && !trigger.matches(":hover")) {
                target.style.display = "none";
            }
        }, delay);
    });

    target.addEventListener("mouseleave", () => {
        timeoutId = setTimeout(() => {
            if (!target.matches(":hover") && !trigger.matches(":hover")) {
                target.style.display = "none";
            }
        }, delay);
    });

    target.addEventListener("mouseenter", () => {
        clearTimeout(timeoutId);
    });
}


// Gọi đúng id
setupHoverShow('#arr', '#home1');
setupHoverShow('#linkedList', '#home2');
setupHoverShow('#sorting', '#home3');
setupHoverShow('#hashTable', '#home4');
setupHoverShow('#bst', '#home5');

window.onload = function(){
    setTimeout(() =>{
        toggle.click();
    }, 150);
};