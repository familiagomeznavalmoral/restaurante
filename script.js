// 1. Inicializar animaciones de scroll (AOS)
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 1000,
        once: true
    });
}

// Función auxiliar para detectar modo oscuro
const isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// 2. Manejo del Formulario de Reserva
document.getElementById('reservation-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Captura de datos
    const nombre = document.getElementById('name').value.trim();
    const telefono = document.getElementById('phone').value.trim();
    const fecha = document.getElementById('date').value;
    const btn = document.getElementById('submit-btn');
    
    // --- VALIDACIONES ---
    
    // Campos vacíos
    if (!nombre || !telefono || !fecha) {
        showMessage('Por favor, completa todos los campos.', 'error');
        return;
    }
    
    // Formato de teléfono (9 dígitos exactos)
    if (!/^\d{9}$/.test(telefono)) {
        showMessage('El teléfono debe tener 9 dígitos.', 'error');
        return;
    }
    
    // --- CORRECCIÓN DE FECHA ---
    // .split('T') asegura que comparamos solo "AAAA-MM-DD"
    const today = new Date().toISOString().split('T');
    if (fecha < today) {
        showMessage('La fecha debe ser hoy o en el futuro.', 'error');
        return;
    }
    
    // --- PROCESAMIENTO ---
    
    // Feedback visual en el botón
    btn.innerText = "Procesando… ⏳";
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');

    setTimeout(() => {
        // Construcción del mensaje para WhatsApp
        const mensaje = `Hola, soy ${nombre}. Quiero reservar una mesa para el día ${fecha}. Mi teléfono es ${telefono}`;
        const url = `https://wa.me/34123456789?text=${encodeURIComponent(mensaje)}`;
        
        // Abrir WhatsApp en pestaña nueva
        window.open(url, "_blank");
        
        // Mostrar mensaje de éxito
        showMessage(`¡Gracias ${nombre}! Tu solicitud ha sido enviada.`, 'success');
        
        // Resetear formulario y botón
        btn.innerText = "Confirmar Reserva";
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        document.getElementById('reservation-form').reset();
    }, 1200);
});

// 3. Sistema de Notificaciones Visuales (Toast)
function showMessage(text, type) {
    const existing = document.querySelector('.message');
    if (existing) existing.remove();
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.setAttribute('role', 'alert');
    message.textContent = text;
    
    // Colores inteligentes según modo claro/oscuro
    const colorExito = isDarkMode() ? '#1e7e34' : '#28a745';
    const colorError = isDarkMode() ? '#bd2130' : '#dc3545';
    
    // Estilos dinámicos
    message.style.cssText = `
        position: fixed; 
        top: 20px; 
        right: 20px; 
        padding: 15px 25px; 
        border-radius: 12px; 
        color: white; 
        font-weight: bold; 
        z-index: 9999; 
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        font-family: 'Montserrat', sans-serif;
        background: ${type === 'success' ? colorExito : colorError};
        transition: transform 0.3s ease, opacity 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    // Tiempo de vida del mensaje
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translateX(20px)';
        setTimeout(() => message.remove(), 300);
    }, 3500);
}

// 4. Inyección de animaciones CSS necesarias (con ID para evitar duplicados)
if (!document.getElementById('msg-animations')) {
    const styleAnim = document.createElement('style');
    styleAnim.id = 'msg-animations';
    styleAnim.textContent = `
        @keyframes slideIn { 
            from { transform: translateX(100%); opacity: 0; } 
            to { transform: translateX(0); opacity: 1; } 
        }
        .message { animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    `;
    document.head.appendChild(styleAnim);
}
const themeBtn = document.getElementById('theme-toggle');
const body = document.body;

themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Cambiar el icono según el modo
    if (body.classList.contains('dark-mode')) {
        themeBtn.innerText = "☀️"; // Sol para volver al modo claro
    } else {
        themeBtn.innerText = "🌙"; // Luna para volver al oscuro
    }
    
    // Opcional: Guardar la preferencia del usuario
    const mode = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', mode);
});

// Al cargar la página, comprobar si ya lo había activado antes
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeBtn.innerText = "☀️";
}