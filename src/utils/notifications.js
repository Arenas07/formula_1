// Función para mostrar notificaciones
export function showNotification(message, type = 'info') {
    // Crear el contenedor de notificaciones si no existe
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    // Crear la notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class='bx ${getIcon(type)}'></i>
            <p>${message}</p>
        </div>
        <button class="close-btn"><i class='bx bx-x'></i></button>
    `;

    // Agregar estilos
    const style = document.createElement('style');
    style.textContent = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .notification {
            min-width: 300px;
            padding: 15px;
            border-radius: 8px;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            animation: slideIn 0.3s ease-out;
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .notification i {
            font-size: 1.5rem;
        }

        .notification p {
            margin: 0;
            font-size: 0.9rem;
        }

        .notification.success {
            border-left: 4px solid #10b981;
        }

        .notification.success i {
            color: #10b981;
        }

        .notification.error {
            border-left: 4px solid #ef4444;
        }

        .notification.error i {
            color: #ef4444;
        }

        .notification.info {
            border-left: 4px solid #3b82f6;
        }

        .notification.info i {
            color: #3b82f6;
        }

        .notification.warning {
            border-left: 4px solid #f59e0b;
        }

        .notification.warning i {
            color: #f59e0b;
        }

        .close-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;
            color: #6b7280;
            transition: color 0.2s;
        }

        .close-btn:hover {
            color: #1f2937;
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
    `;
    document.head.appendChild(style);

    // Agregar la notificación al contenedor
    notificationContainer.appendChild(notification);

    // Agregar evento para cerrar la notificación
    const closeBtn = notification.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Función para obtener el ícono según el tipo de notificación
function getIcon(type) {
    switch (type) {
        case 'success':
            return 'bx-check-circle';
        case 'error':
            return 'bx-error-circle';
        case 'warning':
            return 'bx-error';
        default:
            return 'bx-info-circle';
    }
} 