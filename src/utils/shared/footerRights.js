
class footer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const linkStyle = document.createElement("link");
        linkStyle.setAttribute("rel", "stylesheet");
        linkStyle.setAttribute("href", "../../../src/design/css/home.css");
        this.shadowRoot.appendChild(linkStyle);

        const linkIcons = document.createElement("link");
        linkIcons.setAttribute("rel", "stylesheet");
        linkIcons.setAttribute("href", "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css");
        this.shadowRoot.appendChild(linkIcons);

        const footerScript = document.createElement("div");

        footerScript.innerHTML = `
        <footer id="footer">
            <div class="footer copyright">
                <div class="footer-logo">
                    <i class='bx bx-copyright'></i>
                    <p class="copyright">Derechos reservados al grupo A1 de Adrian 😉</p>
                </div>
                <p class="copyright">Culpable de dejarnos en equipo</p>
            </div>
            <div class="footer social-media">
                <a href="https://www.instagram.com/f1/"><i class='bx bxl-instagram'></i></a>
                <a href="https://x.com/F1"><i class='bx bxl-twitter'></i></a>
                <a href="https://www.facebook.com/Formula1/"><i class='bx bxl-facebook-square'></i></a>
            </div>
        </footer>
        `;

        this.shadowRoot.appendChild(footerScript);
    }
}

customElements.define("custom-footer", footer);
