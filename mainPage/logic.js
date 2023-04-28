let text = document.getElementById("text");
let leaf = document.getElementById("leaf");
let hill1 = document.getElementById("hill1");
let hill4 = document.getElementById("hill4");
let hill5 = document.getElementById("hill5");

window.addEventListener("scroll", () =>{
    let value = window.scrollY;
    if(value <= 600){
    text.style.marginTop = value * 2.5 + "px";
    leaf.style.top = value * -1.5 + "px";
    leaf.style.left = value * 1.5 + "px";
    hill5.style.left = value * 1.5 + "px";
    hill4.style.left = value * -1.5 + "px";
    hill1.style.top = value * 0.9 + "px";
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) =>{
        console.log(entry)
        if(entry.isIntersecting){
            entry.target.classList.add("showSec")
        }else{
            entry.target.classList.remove("showSec");
        }
    });
});

const hiddenElements = document.querySelectorAll(".hiddenSec");
hiddenElements.forEach((el) => observer.observe(el));