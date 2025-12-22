/* ========================================
   CONFIGURACIÓN DE GOOGLE FORMS
   ======================================== */

// IMPORTANTE: Reemplaza estos valores con los entry IDs de tu Google Form
const GOOGLE_FORM_CONFIG = {
    formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfMllgSc8a7HAuQswDuG6PE8frEF1p8rwUL8gJlGQblYJpXhA/formResponse',
    fields: {
        nombre: 'entry.477189467',      // Reemplazar con tu entry ID
        mensaje: 'entry.1108535015',     // Reemplazar con tu entry ID
        asistencia: 'entry.1179020857'   // Reemplazar con tu entry ID
    }
};

/* ========================================
   CONFIGURACIÓN DEL EVENTO
   ======================================== */

// Fecha del evento: 20 de Diciembre de 2026 a las 18:00
const WEDDING_DATE = new Date('2026-01-24T18:00:00').getTime();

/* ========================================
   MÚSICA DE FONDO
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    const musicBtn = document.getElementById('musicBtn');
    const musicIcon = document.getElementById('musicIcon');
    const musicText = document.getElementById('musicText');
    const audio = document.getElementById('backgroundMusic');
    const verInvitacionBtn = document.getElementById('verInvitacion');
    
    let isPlaying = false;
    
    // Configurar volumen inicial (30%)
    audio.volume = 0.3;
    
    // Función para reproducir música
    function playMusic() {
        audio.play().then(() => {
            isPlaying = true;
            musicBtn.classList.add('playing');
            musicText.textContent = 'Pausar';
        }).catch(err => {
            console.log('No se pudo reproducir automáticamente:', err);
        });
    }
    
    // Función para pausar música
    function pauseMusic() {
        audio.pause();
        isPlaying = false;
        musicBtn.classList.remove('playing');
        musicText.textContent = 'Música';
    }
    
    // Toggle música al hacer clic en el botón
    musicBtn.addEventListener('click', function() {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });
    
    // Intentar reproducir música cuando se hace clic en "Ver invitación"
    verInvitacionBtn.addEventListener('click', function() {
        if (!isPlaying) {
            playMusic();
        }
    });
});

/* ========================================
   BOTÓN "VER INVITACIÓN"
   ======================================== */

document.getElementById('verInvitacion').addEventListener('click', function() {
    // Hacer scroll suave a la sección hero
    document.getElementById('hero').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
});

/* ========================================
   CUENTA REGRESIVA
   ======================================== */

function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE - now;
    
    // Si ya pasó la fecha
    if (distance < 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        return;
    }
    
    // Calcular días, horas, minutos y segundos
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Actualizar el DOM
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

// Actualizar cada segundo
setInterval(updateCountdown, 1000);
updateCountdown(); // Llamar inmediatamente al cargar

/* ========================================
   CARRUSEL DE GALERÍA
   ======================================== */

(function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const indicators = Array.from(document.querySelectorAll('.indicator'));
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Función para mover a un slide específico
    function moveToSlide(index) {
        // Asegurar que el índice esté en rango
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        
        currentIndex = index;
        
        // Mover el track
        const movePercentage = currentIndex * -100;
        track.style.transform = `translateX(${movePercentage}%)`;
        
        // Actualizar indicadores
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Botón anterior
    prevBtn.addEventListener('click', () => {
        moveToSlide(currentIndex - 1);
    });
    
    // Botón siguiente
    nextBtn.addEventListener('click', () => {
        moveToSlide(currentIndex + 1);
    });
    
    // Click en indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            moveToSlide(index);
        });
    });
    
    // Touch events para swipe en móvil
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - siguiente
                moveToSlide(currentIndex + 1);
            } else {
                // Swipe right - anterior
                moveToSlide(currentIndex - 1);
            }
        }
    }
    
    // Auto-play opcional (comentado por defecto)
    // setInterval(() => {
    //     const nextIndex = currentIndex + 1 >= totalSlides ? 0 : currentIndex + 1;
    //     moveToSlide(nextIndex);
    // }, 5000);
})();

/* ========================================
   FORMULARIO RSVP
   ======================================== */

(function() {
    const form = document.getElementById('rsvpForm');
    const nombreInput = document.getElementById('nombre');
    const invitadosSelect = document.getElementById('invitados');
    const mensajeTextarea = document.getElementById('mensaje');
    const charCount = document.getElementById('charCount');
    const statusMessage = document.getElementById('statusMessage');
    const noAsistirBtn = document.getElementById('noAsistir');
    
    // Contador de caracteres
    mensajeTextarea.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;
        
        if (length >= 500) {
            charCount.style.color = '#d32f2f';
        } else {
            charCount.style.color = 'var(--text-light)';
        }
    });
    
    // Enviar formulario - "Asistiré"
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        enviarRSVP('si');
    });
    
    // Botón "No podré asistir"
    noAsistirBtn.addEventListener('click', function() {
        if (!nombreInput.value.trim()) {
            mostrarMensaje('Por favor ingresa tu nombre', 'error');
            nombreInput.focus();
            return;
        }
        
        enviarRSVP('no');
    });
    
    // Función para enviar datos a Google Forms
    function enviarRSVP(asistencia) {
        const nombre = nombreInput.value.trim();
        const mensaje = mensajeTextarea.value.trim();

        // Validaciones
        if (!nombre || nombre.length < 3) {
            mostrarMensaje('Por favor ingresa tu nombre completo.', 'error');
            nombreInput.focus();
            return;
        }

        // FormData con entry IDs
        const formData = new FormData();
        formData.append(GOOGLE_FORM_CONFIG.fields.nombre, nombre);
        formData.append(GOOGLE_FORM_CONFIG.fields.mensaje, mensaje);
        formData.append(
            GOOGLE_FORM_CONFIG.fields.asistencia,
            asistencia === 'si' ? 'Asistiré' : 'No podré asistir'
        );

        // UI: deshabilitar botones mientras envía
        const buttons = form.querySelectorAll('button');
        buttons.forEach(btn => (btn.disabled = true));
        mostrarMensaje('Enviando tu confirmación...', 'success'); // mensaje temporal (estilo success)

        fetch(GOOGLE_FORM_CONFIG.formUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
            .then(() => {
            const msg =
                asistencia === 'si'
                ? `Gracias ${nombre}. Tu asistencia ha sido confirmada. ¡Nos vemos el gran día!`
                : `Gracias ${nombre} por informarnos. Agradecemos que nos lo hagas saber.`;

            mostrarMensaje(msg, 'success');

            form.reset();
            charCount.textContent = '0';

            // Si tienes pendingMessage y quieres ocultarlo:
            const pending = document.getElementById('pendingMessage');
            if (pending) pending.style.display = 'none';
            })
            .catch(() => {
            mostrarMensaje(
                'No pudimos enviar tu confirmación. Por favor intenta nuevamente.',
                'error'
            );
            })
            .finally(() => {
            buttons.forEach(btn => (btn.disabled = false));
            });
    }
    
    // Función para mostrar mensajes de estado
    function mostrarMensaje(texto, tipo) {
        statusMessage.textContent = texto;
        statusMessage.className = `status-message ${tipo}`;
        statusMessage.style.display = 'block';
        
        // Auto-ocultar después de 5 segundos si es error
        if (tipo === 'error') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
    }
})();

/* ========================================
   ANIMACIONES AL HACER SCROLL
   ======================================== */

(function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos que queremos animar
    const elementsToAnimate = document.querySelectorAll('.detalle-card, .countdown-item, .fecha-box');
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
})();

/* ========================================
   SMOOTH SCROLL PARA NAVEGACIÓN
   ======================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Ignorar el ancla vacío "#"
        if (href === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('✨ Invitación de boda cargada exitosamente');
console.log('📅 Fecha del evento:', new Date(WEDDING_DATE).toLocaleString('es-ES'));           