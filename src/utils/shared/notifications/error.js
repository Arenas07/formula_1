class ErrorNotification extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['message', 'duration'];
    }

    connectedCallback() {
        this.render();
        this.startTimer();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    startTimer() {
        const duration = parseInt(this.getAttribute('duration')) || 3000;
        setTimeout(() => {
            this.remove();
        }, duration);
    }

    render() {
        const message = this.getAttribute('message') || 'Ha ocurrido un error';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    animation: slideIn 0.3s ease-out;
                }

                .error-container {
                    background-color: #ffebee;
                    border-left: 4px solid #f44336;
                    color: #c62828;
                    padding: 16px 24px;
                    border-radius: 4px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 300px;
                    max-width: 400px;
                }

                .error-icon {
                    flex-shrink: 0;
                }

                .error-message {
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.4;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }

                .removing {
                    animation: slideOut 0.3s ease-in forwards;
                }
            </style>
            <div class="error-container">
                <svg class="error-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#f44336"/>
                </svg>
                <p class="error-message">${message}</p>
            </div>
        `;
    }
}

customElements.define('error-notification', ErrorNotification);

export const showError = (message, duration = 3000) => {
    const error = document.createElement('error-notification');
    error.setAttribute('message', message);
    error.setAttribute('duration', duration);
    document.body.appendChild(error);
}; 