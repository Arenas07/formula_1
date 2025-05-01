export const tittleContainer = (shadowRoot) => {
    const tittleContainer = shadowRoot.querySelector(".tittle-container");
    const template = `
        <h1><span class="pilotos-text">PILOTOS</span> <span class="estrellas-text">ESTRELLAS</span></h1>
        <p>Conoce a los mejores pilotos del mundo de la Formula 1</p>
    `;
    tittleContainer.innerHTML = template;
}
