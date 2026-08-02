document.addEventListener('DOMContentLoaded', () => {

    // --------------------- Langue FR / EN
    const languageToggle = document.getElementById('languageToggle');
    const translateContainer = document.querySelector('.translate-container');
    let currentLang = 'fr';

    function updateLanguage() {
        translateContainer.querySelectorAll('[data-fr][data-en]').forEach(el => {
            el.innerHTML = el.dataset[currentLang];
        });
        translateContainer.setAttribute('data-lang', currentLang);
        document.documentElement.setAttribute('lang', currentLang);
        languageToggle.textContent = currentLang === 'fr' ? 'EN' : 'FR';
    }

    languageToggle.addEventListener('click', () => {
        currentLang = currentLang === 'fr' ? 'en' : 'fr';
        updateLanguage();
    });

    updateLanguage();
    // ---------------------


    // --------------------- Apparition douce au scroll
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
    // ---------------------


    // --------------------- Fond animé : vague de particules (identique à la page d'accueil)
    const waveCanvas = document.getElementById('particleWave');
    if (waveCanvas) {
        const ctx = waveCanvas.getContext('2d');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let width, height, dpr;

        function resizeWave() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            waveCanvas.width = width * dpr;
            waveCanvas.height = height * dpr;
            waveCanvas.style.width = `${width}px`;
            waveCanvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resizeWave();
        window.addEventListener('resize', resizeWave);

        const waveLayers = [
            { baseY: 0.24, amp: 30, freq: 0.006, speed: 0.00022, count: 42, color: '139,141,255', r: 1.5, alpha: 0.45 },
            { baseY: 0.52, amp: 46, freq: 0.0045, speed: 0.00016, count: 50, color: '139,141,255', r: 1.2, alpha: 0.28 },
            { baseY: 0.78, amp: 26, freq: 0.007, speed: 0.00028, count: 38, color: '127,184,154', r: 1.3, alpha: 0.24 }
        ];

        function drawWave(t) {
            ctx.clearRect(0, 0, width, height);
            waveLayers.forEach((layer, layerIndex) => {
                const baseY = height * layer.baseY;
                for (let i = 0; i < layer.count; i++) {
                    const x = (i / layer.count) * width;
                    const y = baseY + Math.sin(x * layer.freq + t * layer.speed + layerIndex) * layer.amp;
                    const twinkle = prefersReducedMotion ? 1 : 0.6 + 0.4 * Math.sin(t * 0.0015 + i);
                    ctx.beginPath();
                    ctx.arc(x, y, layer.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${layer.color}, ${layer.alpha * twinkle})`;
                    ctx.fill();
                }
            });
        }

        if (prefersReducedMotion) {
            drawWave(0);
        } else {
            requestAnimationFrame(function animateWave(t) {
                drawWave(t);
                requestAnimationFrame(animateWave);
            });
        }
    }
    // ---------------------
});