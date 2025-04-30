const loadingText = document.querySelector(".loading-text");
const progress = document.querySelector(".progress");
const loaderContainer = document.querySelector(".loader-container");

let dots = "", progressWidth = 0;

const textInterval = setInterval(() => {
    loadingText.textContent = "Cargando" + 
    (dots = dots.length < 3 ? dots + "." : "");
}, 500);

const progressInterval = setInterval(() => {
    progress.style.width = (progressWidth += 2) + "%";

    if (progressWidth >= 100) {
        clearInterval(textInterval);
        clearInterval(progressInterval);
        
        loadingText.textContent = "Carga completa";
        loaderContainer.style.transition = "opacity 0.5s ease";
        loaderContainer.style.opacity = "0";
        setTimeout(() => {
            loaderContainer.style.display = "none";

            window.location.href = "./src/modules/loginView.html";
        }, 500); 
    }
}, 50);
