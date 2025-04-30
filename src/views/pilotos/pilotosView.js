const pilotoCard = document.getElementById("piloto-card");
let template = "";

template = `
    <div class="flip-box">
        <div class="flip-box-inner">
            <div class="flip-box-front">
                <img src="img_paris.jpg" alt="Paris" style="width:300px;height:200px">
            </div>
            <div class="flip-box-back">
                <h2>Paris</h2>
                <p>What an amazing city</p>
            </div>
        </div>
    </div>
`;

pilotoCard.innerHTML = template;

// Seleccionamos la tarjeta después de insertarla en el DOM
const tarjeta = document.querySelector(".flip-box");
tarjeta.addEventListener("click", () => {
    tarjeta.classList.toggle("flip");
});
