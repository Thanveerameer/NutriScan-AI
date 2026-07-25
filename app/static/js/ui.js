// =====================================
// NutriScan AI Global UI Controller
// =====================================


document.addEventListener(
"DOMContentLoaded",
()=>{


const elements =
document.querySelectorAll(
".fade-in,.slide-up"
);



elements.forEach(
(el,index)=>{


el.style.animationDelay =
`${index*0.1}s`;



});



});