/* ==========================================
   NutriScan AI
   Premium Upload Page JavaScript

   Module 6 Part 3
========================================== */


document.addEventListener(
"DOMContentLoaded",
function(){



const dropZone = document.getElementById("dropZone");

const fileInput = document.getElementById("report");

const browseBtn = document.getElementById("browseBtn");

const uploadForm = document.getElementById("uploadForm");

const filePreview = document.getElementById("filePreview");

const fileName = document.getElementById("fileName");

const fileSize = document.getElementById("fileSize");

const removeFile = document.getElementById("removeFile");

const analyzeBtn = document.getElementById("analyzeBtn");





let selectedFile = null;






// =====================================
// Browse Button
// =====================================


browseBtn.addEventListener(
"click",
function(e){

e.stopPropagation();

fileInput.click();

});





// Click Drop Zone

dropZone.addEventListener(
"click",
function(){

fileInput.click();

});







// File Selected


fileInput.addEventListener(
"change",
function(){

if(this.files.length > 0){

handleFile(this.files[0]);

}

});









// =====================================
// Drag Events
// =====================================


dropZone.addEventListener(
"dragover",
function(e){

e.preventDefault();

dropZone.classList.add(
"drag-active"
);

});





dropZone.addEventListener(
"dragleave",
function(){

dropZone.classList.remove(
"drag-active"
);

});





dropZone.addEventListener(
"drop",
function(e){

e.preventDefault();


dropZone.classList.remove(
"drag-active"
);



const file = e.dataTransfer.files[0];


if(file){

handleFile(file);

}


});









// =====================================
// File Validation
// =====================================


function handleFile(file){



// PDF Check


if(file.type !== "application/pdf"){


alert(
"Please upload only PDF blood reports."
);


return;

}





// File Size Check
// Maximum 10MB


if(file.size > 10 * 1024 * 1024){


alert(
"File size should be less than 10MB."
);


return;

}





selectedFile = file;



showFile(file);


}









// =====================================
// Show Selected File
// =====================================


function showFile(file){



fileName.textContent =
file.name;



fileSize.textContent =
formatSize(file.size);



filePreview.classList.remove(
"d-none"
);



dropZone.style.display =
"none";



}







// =====================================
// File Size Format
// =====================================


function formatSize(bytes){



if(bytes === 0)

return "0 Bytes";



const sizes = [

"Bytes",
"KB",
"MB",
"GB"

];



const i =
Math.floor(
Math.log(bytes) /
Math.log(1024)
);



return (

Math.round(
bytes /
Math.pow(1024,i)
)

+

" "

+

sizes[i]

);


}









// =====================================
// Remove File
// =====================================


removeFile.addEventListener(
"click",
function(){


selectedFile = null;


fileInput.value = "";


filePreview.classList.add(
"d-none"
);



dropZone.style.display =
"block";



});









// =====================================
// Form Submit Loading
// =====================================


uploadForm.addEventListener(
"submit",
function(){



if(!selectedFile){


alert(
"Please select a PDF report first."
);



event.preventDefault();


return;


}





analyzeBtn.classList.add(
"loading"
);



analyzeBtn.innerHTML = `

<span>

⏳

</span>

Analyzing Report...

`;



});







});