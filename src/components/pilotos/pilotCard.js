export const pilotCard = (shadowRoot) => {
    const pilotoCard = shadowRoot.querySelector("#piloto-card");
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

    // Seleccionamos la tarjeta dentro del Shadow DOM
    const tarjetas = shadowRoot.querySelectorAll(".flip-box");
    for (const tarjeta of tarjetas) {
        tarjeta.addEventListener("click", () => {
            tarjeta.classList.toggle("flip");
        });
    }
}



