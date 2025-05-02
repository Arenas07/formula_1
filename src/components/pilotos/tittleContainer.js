import { tokenValidator, tokenValidatorAdmin } from "../../utils/shared/tokenValidator";
import { PilotoService } from "../../services/piloto.service";




export const tittleContainer = (shadowRoot) => {
    const tittleContainer = shadowRoot.querySelector(".tittle-container");

    

    const template = `
        <h1><span class="pilotos-text">PILOTOS</span> <span class="estrellas-text">ESTRELLAS</span></h1>
        <p>Conoce a los mejores pilotos del mundo de la Formula 1</p>
        <div class="admin-actions">
            <button class="btn-crear-piloto-nuevo">Crear Piloto Nuevo</button>
            <button class="btn-crear-piloto-competidor">Crear Piloto Competidor</button>
        </div>
    `;
    tittleContainer.innerHTML = template;

    const btnCrearPilotoNuevo = shadowRoot.querySelector(".btn-crear-piloto-nuevo");
    const btnCrearPilotoCompetidor = shadowRoot.querySelector(".btn-crear-piloto-competidor");
    


    let token = tokenValidator();
    if (token) {
        let isAdmin = tokenValidatorAdmin();
        if (isAdmin) {
            console.log("Es admin");
        } else {
            console.log("No es admin");
            btnCrearPilotoNuevo.style.display = "none";
            btnCrearPilotoCompetidor.style.display = "none";
        }
    }

    btnCrearPilotoNuevo.addEventListener("click", () => {
        window.location.href = "/src/modules/admin/pilotos/crearPilotos.html?isNew=true";
    });

    btnCrearPilotoCompetidor.addEventListener("click", () => {
        window.location.href = "/src/modules/admin/pilotos/crearPilotos.html?isCompetidor=true";
    });

}

