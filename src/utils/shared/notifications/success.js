class SuccessNotification extends HTMLElement {
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
        const message = this.getAttribute('message') || 'Operación exitosa';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    animation: slideIn 0.3s ease-out;
                }

                .success-container {
                    background-color: #e8f5e9;
                    border-left: 4px solid #4caf50;
                    color: #2e7d32;
                    padding: 16px 24px;
                    border-radius: 4px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 300px;
                    max-width: 400px;
                }

                .success-icon {
                    flex-shrink: 0;
                }

                .success-message {
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
            <div class="success-container">
                <svg class="success-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#4caf50"/>
                </svg>
                <p class="success-message">${message}</p>
            </div>
        `;
    }
}

customElements.define('success-notification', SuccessNotification);

export const showSuccess = (message, duration = 3000) => {
    const success = document.createElement('success-notification');
    success.setAttribute('message', message);
    success.setAttribute('duration', duration);
    document.body.appendChild(success);
}; 