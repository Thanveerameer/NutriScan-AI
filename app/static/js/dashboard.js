/*
========================================
 NutriScan AI Premium Dashboard JS
 UI Animations & Interactions
========================================
*/


document.addEventListener("DOMContentLoaded", function(){


    // Card Reveal Animation

    const cards = document.querySelectorAll(".ai-card");


    cards.forEach((card,index)=>{


        card.style.opacity = "0";


        card.style.transform =
        "translateY(40px)";



        setTimeout(()=>{


            card.style.transition =
            "all 0.8s ease";


            card.style.opacity = "1";


            card.style.transform =
            "translateY(0)";



        }, index * 150);



    });






    // Smooth Scroll For Dashboard


    const links =
    document.querySelectorAll("a[href^='#']");



    links.forEach(link=>{


        link.addEventListener("click",function(e){


            const target =
            document.querySelector(
                this.getAttribute("href")
            );



            if(target){


                e.preventDefault();


                target.scrollIntoView({

                    behavior:"smooth"

                });


            }


        });


    });






    // Add Loading Effect Before AI Result Display


    const contentBlocks =
    document.querySelectorAll(".card-content");



    contentBlocks.forEach(block=>{


        if(block.innerText.trim()===""){


            block.innerHTML =
            `
            <div class="text-center">

                <div class="spinner-border text-primary"
                     role="status">

                </div>

                <p class="mt-2">
                    AI analysis loading...
                </p>

            </div>
            `;


        }


    });





});





// Dashboard Welcome Message


window.addEventListener("load",()=>{


    console.log(
        "NutriScan AI Dashboard Loaded Successfully"
    );


});