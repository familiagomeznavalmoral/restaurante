document.getElementById('reservation-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const nombre = document.getElementById('name').value.trim();
  const telefono = document.getElementById('phone').value.trim();
  const fecha = document.getElementById('date').value;
  const btn = document.getElementById('submit-btn');
  
  // Validación básica
  if (!nombre || !telefono || !fecha) {
    showMessage('Por favor, completa todos los campos.', 'error');
    return;
  }
  
  if (!/^\d{9}$/.test(telefono)) {
    showMessage('El teléfono debe tener 9 dígitos.', 'error');
    return;
  }
  
  const today = new Date().toISOString().split('T')[0];
  if (fecha < today) {
    showMessage('La fecha debe ser hoy o en el futuro.', 'error');
    return;
  }
  
  btn.innerText = "Procesando… ⏳";
  btn.disabled = true;
  btn.setAttribute('aria-busy', 'true');

  setTimeout(() => {
    const mensaje = `Hola, soy ${nombre} y quiero reservar para el ${fecha}. Tel: ${telefono}`;
    const url = `https://wa.me/34123456789?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
    
    showMessage(`¡Hola ${nombre}! Tu solicitud ha sido enviada. Te contactaremos pronto.`, 'success');
    btn.innerText = "Confirmar Reserva";
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
    this.reset();
  }, 1500);
});

function showMessage(text, type) {
  const existing = document.querySelector('.message');
  if (existing) existing.remove();
  
  const message = document.createElement('div');
  message.className = `message ${type}`;
  message.setAttribute('role', 'alert'); // accesibilidad
  message.textContent = text;
  message.style.cssText = `
    position: fixed; top: 20px; right: 20px; padding: 15px 20px; border-radius: 8px; 
    color: white; font-weight: bold; z-index: 1001; animation: slideIn 0.3s ease;
    ${type === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
  `;
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => message.remove(), 300);
  }, 3000);
}

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
`;
document.head.appendChild(style);

document.getElementById("reservation-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const date = document.getElementById("date").value;

  const message = `Hola, soy ${name}. Quiero reservar una mesa para el día ${date}. Mi teléfono es ${phone}`;

  const url = `https://wa.me/34123456789?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
});