/* ========================================
   CONFIGURACIÓN DEL EVENTO
   ======================================== */

// Ceremonia civil: 12 de diciembre de 2026, 16:00 en El Salvador (UTC-6).
const WEDDING_DATE = new Date('2026-12-12T16:00:00-06:00').getTime();

document.body.classList.add('invitation-closed');

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
    const portada = document.getElementById('portada');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (portada.classList.contains('opening')) return;
    portada.classList.add('opening');
    this.disabled = true;

    window.setTimeout(() => {
        portada.classList.add('is-dismissed');
        document.body.classList.remove('invitation-closed');
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, reduceMotion ? 0 : 2100);
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
    const carousel = document.getElementById('carousel');
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
        carousel.classList.toggle('portrait', currentIndex > 0);
        const image = slides[currentIndex].querySelector('img');
        carousel.style.setProperty('--slide-ratio', `${image.getAttribute('width')} / ${image.getAttribute('height')}`);
        
        // Mover el track
        const movePercentage = currentIndex * -100;
        track.style.transform = `translateX(${movePercentage}%)`;
        
        // Actualizar indicadores
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentIndex);
            indicator.setAttribute('aria-pressed', String(i === currentIndex));
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
    const mensajeTextarea = document.getElementById('mensaje');
    const charCount = document.getElementById('charCount');
    const statusMessage = document.getElementById('statusMessage');
    const asistenciaInput = document.getElementById('asistencia');
    const responseFrame = document.getElementById('rsvpResponseFrame');
    const buttons = Array.from(form.querySelectorAll('.btn-rsvp'));
    let waitingForResponse = false;
    let responseTimer;
    
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
    
    // El formulario se envía a Google en un iframe oculto, sin salir de la landing.
    form.addEventListener('submit', function(e) {
        const nombre = nombreInput.value.trim();
        if (nombre.length < 3) {
            e.preventDefault();
            mostrarMensaje('Por favor ingresa tu nombre completo.', 'error');
            nombreInput.focus();
            return;
        }
        if (waitingForResponse) {
            e.preventDefault();
            return;
        }

        nombreInput.value = nombre;
        asistenciaInput.value = e.submitter?.dataset.asistencia || 'Asistiré';
        waitingForResponse = true;
        buttons.forEach(button => { button.disabled = true; });
        mostrarMensaje('Enviando tu respuesta...', 'pending');

        responseTimer = window.setTimeout(() => {
            if (!waitingForResponse) return;
            waitingForResponse = false;
            buttons.forEach(button => { button.disabled = false; });
            mostrarMensaje('No pudimos comprobar el envío. Consulta con los novios antes de intentarlo otra vez.', 'error');
        }, 20000);
    });

    responseFrame.addEventListener('load', function() {
        if (!waitingForResponse) return;
        waitingForResponse = false;
        window.clearTimeout(responseTimer);
        buttons.forEach(button => { button.disabled = false; });
        form.reset();
        charCount.textContent = '0';
        mostrarMensaje('Gracias. Tu respuesta fue enviada.', 'success');
    });
    
    // Función para mostrar mensajes de estado
    function mostrarMensaje(texto, tipo) {
        statusMessage.textContent = texto;
        statusMessage.className = `status-message ${tipo}`;
        statusMessage.style.display = 'block';
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
console.log('📅 Fecha del evento:', new Date(WEDDING_DATE).toLocaleString('es-SV', { timeZone: 'America/El_Salvador' }));
