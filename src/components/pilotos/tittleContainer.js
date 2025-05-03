import { tokenValidator, tokenValidatorAdmin } from "../../utils/shared/tokenValidator";
import { PilotoService } from "../../services/piloto.service";




export const tittleContainer = (shadowRoot) => {
    const tittleContainer = shadowRoot.querySelector(".tittle-container");

    

    const template = `
        <style>
            .admin-actions {
                display: flex;
                gap: 1.5rem;
                justify-content: center;
                margin: 2rem 0 1rem 0;
            }
            .btn-crear-piloto-nuevo, .btn-crear-piloto-competidor {
                background: #e53935;
                color: #fff;
                border: none;
                border-radius: 10px;
                padding: 1rem 2.2rem;
                font-size: 1.15rem;
                font-weight: 700;
                box-shadow: 0 4px 16px rgba(229,57,53,0.10);
                cursor: pointer;
                transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
                letter-spacing: 1px;
                outline: none;
            }
            .btn-crear-piloto-nuevo:hover, .btn-crear-piloto-competidor:hover {
                background: #c62828;
                transform: translateY(-2px) scale(1.04);
                box-shadow: 0 8px 24px rgba(229,57,53,0.18);
            }
        </style>
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

