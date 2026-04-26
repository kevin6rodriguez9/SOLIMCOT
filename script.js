/* ============================================================
   SOLIMCOT – JavaScript principal
   Archivo: main.js
============================================================ */

// ─── NAVBAR: efecto al hacer scroll ──────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── HAMBURGER / DRAWER (menú móvil) ─────────────────────────
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');

hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    drawer.classList.toggle('open', isOpen);
});

/** Cierra el menú móvil */
function closeDrawer() {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
}

// Cierra el drawer al hacer clic fuera de la navbar
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) closeDrawer();
});

// ─── FECHA MÍNIMA EN EL SELECTOR (mañana) ────────────────────
const dateInput = document.getElementById('fecha');
const today = new Date();
today.setDate(today.getDate() + 1); // mínimo: mañana
dateInput.min = today.toISOString().split('T')[0];

// ─── FORMULARIO DE AGENDAMIENTO ──────────────────────────────
const form = document.getElementById('scheduleForm');
const formSuccess = document.getElementById('formSuccess');

/**
 * Muestra un mensaje de error en un campo del formulario
 * @param {string} id  - ID del campo
 * @param {string} msg - Mensaje de error
 */
function showError(id, msg) {
    const field = document.getElementById(id);
    const err = document.getElementById('err-' + id);
    field.classList.add('error');
    if (err) err.textContent = msg;
}

/**
 * Limpia el error de un campo del formulario
 * @param {string} id - ID del campo
 */
function clearError(id) {
    const field = document.getElementById(id);
    const err = document.getElementById('err-' + id);
    field.classList.remove('error');
    if (err) err.textContent = '';
}

// Validación en vivo: limpia errores al escribir
['nombre', 'telefono', 'fecha', 'direccion', 'tipo'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => clearError(id));
    document.getElementById(id).addEventListener('change', () => clearError(id));
});

// Envío del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Leer valores
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const fecha = document.getElementById('fecha').value;
    const direccion = document.getElementById('direccion').value.trim();
    const tipo = document.getElementById('tipo').value;

    // Limpiar errores previos
    ['nombre', 'telefono', 'fecha', 'direccion', 'tipo'].forEach(clearError);

    // Validaciones
    if (!nombre || nombre.length < 3) {
        showError('nombre', 'Por favor ingresa tu nombre completo.');
        valid = false;
    }

    const telRegex = /^[+]?[\d\s\-()]{7,15}$/;
    if (!telefono || !telRegex.test(telefono)) {
        showError('telefono', 'Ingresa un número de teléfono válido.');
        valid = false;
    }

    if (!fecha) {
        showError('fecha', 'Selecciona una fecha disponible.');
        valid = false;
    }

    if (!direccion || direccion.length < 5) {
        showError('direccion', 'Ingresa la dirección del trabajo.');
        valid = false;
    }

    if (!tipo) {
        showError('tipo', 'Selecciona el tipo de trabajo.');
        valid = false;
    }

    if (!valid) return;

    // Simular envío: mostrar spinner en el botón
    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2.5"
         stroke-linecap="round" stroke-linejoin="round"
         style="animation:spin .8s linear infinite">
      <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
    </svg>
    Enviando…
  `;

    // Después de 1.6 s mostrar mensaje de éxito
    setTimeout(() => {
        form.style.display = 'none';
        formSuccess.style.display = 'flex';
    }, 1600);
});

/**
 * Resetea el formulario y vuelve al estado inicial
 */
function resetForm() {
    form.reset();
    form.style.display = 'block';
    formSuccess.style.display = 'none';

    const btn = form.querySelector('.form-submit');
    btn.disabled = false;
    btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2.2"
         stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
    Enviar solicitud
  `;
}

// ─── SCROLL REVEAL ────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // solo una vez
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ─── LINK ACTIVO EN NAVBAR según sección visible ─────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 100) {
            current = sec.id;
        }
    });

    navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + current
            ? 'var(--white)'
            : '';
    });
});