document.addEventListener('DOMContentLoaded', () => {

    // --------------------- Langue FR / EN
    const languageToggle = document.getElementById('languageToggle');
    const translateContainer = document.querySelector('.translate-container');
    let currentLang = 'fr';
    let isTyping = false;

    function updateLanguage() {
        const elements = translateContainer.querySelectorAll('[data-fr][data-en]');
        elements.forEach(element => {
            if (element.id !== 'typing-text') {
                element.innerHTML = element.dataset[currentLang];
            }
        });
        translateContainer.setAttribute('data-lang', currentLang);
        document.documentElement.setAttribute('lang', currentLang);
    }

    function updateTypingText() {
        const typingText = document.getElementById('typing-text');
        const text = typingText.getAttribute(`data-${currentLang}`);
        typingText.textContent = '';
        let charIndex = 0;
        isTyping = true;
        languageToggle.classList.add('disabled');

        function typeText() {
            if (charIndex < text.length) {
                typingText.textContent += text[charIndex];
                charIndex++;
                setTimeout(typeText, 70);
            } else {
                isTyping = false;
                languageToggle.classList.remove('disabled');
            }
        }
        typeText();
    }

    languageToggle.addEventListener('click', () => {
        if (!isTyping) {
            currentLang = currentLang === 'fr' ? 'en' : 'fr';
            updateLanguage();
            updateTypingText();
            if (typeof updateOrbitCenter === 'function' && typeof orbitIndex !== 'undefined') {
                updateOrbitCenter(orbitIndex);
            }
        }
    });

    updateLanguage();
    updateTypingText();
    // ---------------------


    // --------------------- Navigation : état actif + progression
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const navProgress = document.getElementById('navProgress');
    let lastActiveIndex = -1;

    function updateActiveNavItem(sectionId) {
        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === `#${sectionId}`);
        });
        sections.forEach(section => {
            section.classList.toggle('is-active', section.id === sectionId);
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('href').substring(1);
            document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Détection de la section active basée sur le scroll : fiable quelle que soit
    // la hauteur de chaque section (contrairement à un seuil d'intersection fixe,
    // qui ne se déclenche jamais si une section est bien plus haute que l'écran).
    function getActiveIndex() {
        const reference = window.scrollY + window.innerHeight * 0.3;
        let activeIndex = 0;
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].offsetTop <= reference) {
                activeIndex = i;
            } else {
                break;
            }
        }
        return activeIndex;
    }

    function checkActiveSection() {
        const idx = getActiveIndex();
        if (idx !== lastActiveIndex) {
            lastActiveIndex = idx;
            updateActiveNavItem(sections[idx].id);
        }
    }

    function updateNavProgress() {
        const sectionList = Array.from(sections);
        const reference = window.scrollY + window.innerHeight * 0.3;
        const totalGaps = sectionList.length - 1;
        let progress = 0;

        for (let i = 0; i < totalGaps; i++) {
            const start = sectionList[i].offsetTop;
            const end = sectionList[i + 1].offsetTop;
            if (reference < start) { break; }
            if (reference >= start && reference < end) {
                const frac = (reference - start) / (end - start);
                progress = ((i + frac) / totalGaps) * 100;
                break;
            }
            if (i === totalGaps - 1 && reference >= end) {
                progress = 100;
            }
        }
        navProgress.style.height = `${Math.min(Math.max(progress, 0), 100)}%`;
    }
    window.addEventListener('scroll', () => { updateNavProgress(); checkActiveSection(); }, { passive: true });
    window.addEventListener('resize', () => { updateNavProgress(); checkActiveSection(); });
    updateNavProgress();
    checkActiveSection();
    // ---------------------


    // --------------------- Filtrage des projets (par rôle : designer / développeur)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const roles = (card.getAttribute('data-role') || '').split(' ');
                const match = filterValue === 'all' || roles.includes(filterValue);
                card.classList.toggle('hidden', !match);
            });
        });
    });
    // ---------------------


    // --------------------- Étude de cas projet (modale)
    const FIGMA_PROFILE = 'https://www.figma.com/@jniouenwassim';

    const projectDetails = {
        culturius: {
            image: './assets/images/culturius/Culturius-stage.png',
            title: 'Culturius',
            tech: 'Next.js · Sass',
            live: 'https://culturius.com/fr?country=be',
            caseStudy: 'case-culturius.html',
            desc: {
                fr: "Intégration front-end du site Culturius. Le site était en développement depuis 2 ans, j'ai contribué à mettre la maquette du designer dans le front-end.",
                en: 'Front-end integration of the Culturius website. The site had been in development for 2 years, I contributed to implementing the designer\'s mockup in the front-end.'
            },
            method: [
                { fr: "Intégration front-end en Next.js et Sass, du prototype à la mise en ligne", en: 'Front-end build in Next.js and Sass, from prototype to launch' },
                { fr: "Collaboration avec le designer pour implémenter sa maquette avec fidélité", en: 'Collaboration with the designer to implement the mockup with fidelity' }
            ],
            duration: { fr: 'Stage · 3 mois', en: 'Internship · 3 months' }
        },
        lorenergie: {
            image: './assets/images/lorenergie/lorenergie.png',
            title: 'Lorenergie',
            tech: 'Figma · Design hand-off',
            live: 'https://www.lorenergie.be/',
            caseStudy: 'case-lorenergie.html',
            desc: {
                fr: "Site vieillissant, identité incohérente, expérience peu optimale : refonte complète pensée pour moderniser l'image de l'entreprise et faciliter le travail du développeur.",
                en: 'An aging site with an inconsistent identity and weak UX: a full redesign meant to modernize the brand and make the developer hand-off easy.'
            },
            method: [
                { fr: "Audit du site existant : vieillissant, peu lisible sur mobile, structure compliquant l'intégration", en: 'Audit of the existing site: dated, weak on mobile, a structure that made integration difficult' },
                { fr: "User flows et arborescence repensés pour le secteur de l'énergie", en: 'User flows and sitemap redesigned for the energy sector' },
                { fr: "Maquettes UI cohérentes et tests d'utilisabilité pour optimiser des formulaires complexes", en: 'Consistent UI mockups and usability testing to optimize complex forms' },
                { fr: "Design hand-off soigné, puis intégration par un développeur : le site en ligne correspond à cette refonte", en: 'Careful design hand-off, then built by a developer: the live site reflects this redesign' }
            ],
            duration: { fr: 'Stage · 3 mois', en: 'Internship · 3 months' }
        },
        rebelcompany: {
            image: './assets/images/rebelcompany/rebelCompany.png',
            title: 'RebelCompany',
            tech: 'Figma · Prototypage',
            live: 'https://rebelcompany.be/',
            figmaMobile: 'https://www.figma.com/proto/GDb5noUJIazzpFXl5fwf7l/Rebel-Company--Perso-?page-id=0%3A1&node-id=424-17791&viewport=13897%2C747%2C0.12&t=rbCd3s89z2rGWWfo-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=424%3A17791',
            figmaDesktop: 'https://www.figma.com/proto/GDb5noUJIazzpFXl5fwf7l/Rebel-Company--Perso-?page-id=1%3A3&node-id=403-2045&p=f&viewport=9233%2C1104%2C0.17&t=0dD31avL1FOVZyWV-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=362%3A774',
            caseStudy: 'case-rebelcompany.html',
            desc: {
                fr: "Refonte complète pour moderniser l'image de marque, renforcer la crédibilité et concevoir une expérience mobile-first. Maquette finalisée : le site en ligne ne reflète pas encore ce travail.",
                en: 'A full redesign to modernize the brand, strengthen credibility and design a mobile-first experience. Mockup finalized: the live site does not reflect this work yet.'
            },
            method: [
                { fr: "Refonte de l'identité de marque pour renforcer la crédibilité auprès des prospects", en: "Brand identity redesign to strengthen credibility with prospects" },
                { fr: "Architecture de l'information et wireframes pensés mobile-first", en: 'Information architecture and mobile-first wireframes' },
                { fr: 'Prototypes interactifs haute fidélité (desktop &amp; mobile) sur Figma', en: 'High-fidelity interactive prototypes (desktop &amp; mobile) in Figma' },
                { fr: 'Maquette prête à l\'intégration, actuellement en attente côté développement', en: 'Mockup ready for development, currently pending integration' }
            ],
            duration: { fr: 'Stage · 3 mois', en: 'Internship · 3 months' }
        },
        jouermalin: {
            image: './assets/images/jouermalin(TFE)/jouerMalin.png',
            title: 'Jouer Malin',
            tech: 'HTML · CSS · JavaScript · TypeScript',
            live: 'https://jouermalin.netlify.app/',
            caseStudy: 'case-jouermalin.html',
            desc: {
                fr: "Mon projet de fin de bachelier, mené sur deux ans : une plateforme pédagogique et gamifiée pour aider les parents à mieux comprendre l'univers du jeu vidéo de leurs enfants.",
                en: "My bachelor thesis project, carried out over two years: a gamified, educational platform helping parents better understand their children's video game habits."
            },
            method: [
                { fr: "Recherche utilisateur : interviews avec 4 parents et un expert en sécurité numérique", en: 'User research: interviews with 4 parents and a digital safety expert' },
                { fr: 'Personas, architecture de l\'information, wireframes et itérations de maquettes', en: 'Personas, information architecture, wireframes and mockup iterations' },
                { fr: "Création du logo, de l'identité visuelle et d'un Design System complet", en: 'Logo, visual identity and a full Design System' },
                { fr: 'Prototypage interactif, tests utilisateurs, puis développement du site', en: 'Interactive prototyping, user testing, then site development' }
            ]
        }
    };


    const modal = document.getElementById('projectModal');
    const modalImage = document.getElementById('modalImage');
    const modalImageWrap = document.getElementById('modalImageWrap');
    const modalTitle = document.getElementById('modalTitle');
    const modalTags = document.getElementById('modalTags');
    const modalTech = document.getElementById('modalTech');
    const modalDesc = document.getElementById('modalDesc');
    const modalMethod = document.getElementById('modalMethod');
    const modalActions = document.getElementById('modalActions');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.querySelector('.modal-body');
    let lastFocused = null;

    const roleLabel = { designer: { fr: 'Designer', en: 'Designer' }, developer: { fr: 'Intégration', en: 'Integration' } };

    function updateScrollFade() {
        const el = modalBody;
        const hasMore = el.scrollHeight - el.scrollTop - el.clientHeight > 8;
        modal.classList.toggle('has-more', hasMore);
    }

    function openModal(card) {
        const key = card.getAttribute('data-project');
        const data = projectDetails[key];
        if (!data) return;

        const lang = translateContainer.getAttribute('data-lang') || 'fr';

        if (data.image) {
            modalImage.hidden = false;
            modalImage.src = data.image;
            modalImage.alt = typeof data.title === 'string' ? data.title : data.title[lang];
            modalImageWrap.classList.remove('modal-image-empty');
        } else {
            modalImage.hidden = true;
            modalImage.removeAttribute('src');
            modalImageWrap.classList.add('modal-image-empty');
        }
        modalTitle.textContent = typeof data.title === 'string' ? data.title : data.title[lang];
        modalTech.textContent = data.tech;
        modalDesc.textContent = data.desc[lang];

        const roles = (card.getAttribute('data-role') || '').split(' ');
        modalTags.innerHTML = roles.map(r => `<span class="modal-tag">${roleLabel[r][lang]}</span>`).join('');

        modalMethod.innerHTML = data.method.map(step => `<li>${step[lang]}</li>`).join('');

        let actions = '';
        if (data.live) {
            actions += `<a href="${data.live}" target="_blank" rel="noopener" class="btn btn-ghost">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                <span>${lang === 'fr' ? 'Voir le site' : 'View site'}</span>
            </a>`;
        }
        if (data.caseStudy) {
            actions += `<a href="${data.caseStudy}" class="btn btn-primary">
                <i class="fa-solid fa-book-open"></i>
                <span>${lang === 'fr' ? "En savoir plus" : 'Learn more'}</span>
            </a>`;
        }
        modalActions.innerHTML = actions;

        lastFocused = document.activeElement;
        modal.hidden = false;
        modalBody.scrollTop = 0;
        document.body.style.overflow = 'hidden';
        modalClose.focus();
        requestAnimationFrame(updateScrollFade);
    }

    function closeModal() {
        modal.hidden = true;
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    projectCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(card);
            }
        });
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
    modalBody.addEventListener('scroll', updateScrollFade, { passive: true });
    window.addEventListener('resize', () => { if (!modal.hidden) updateScrollFade(); });
    // ---------------------


    // --------------------- Masquer le rail social juste avant le footer
    const socialRail = document.getElementById('socialRail');
    const siteFooter = document.getElementById('siteFooter');

    if (socialRail && siteFooter) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                socialRail.classList.toggle('is-hidden', entry.isIntersecting);
            });
        }, { threshold: 0, rootMargin: '0px 0px -20px 0px' });
        footerObserver.observe(siteFooter);
    }
    // ---------------------


    // --------------------- Apparition douce au scroll
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
    // ---------------------

        // Observer toutes les sections
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    // ---------------------(FIN)

    // --------------------- Compétences phares (menu circulaire)
    const orbitItems = document.querySelectorAll('.orbit-item');
    const orbitIcon = document.getElementById('orbitIcon');
    const orbitText = document.getElementById('orbitText');
    let orbitIndex = 0;
    let orbitInterval;
    let orbitPriorityTimeout;
    let orbitPriorityActive = false;

    function updateOrbitCenter(index) {
        const item = orbitItems[index];
        if (!item) return;
        const lang = translateContainer.getAttribute('data-lang') || 'fr';
        const iconEl = item.querySelector('i, svg');
        orbitIcon.innerHTML = iconEl ? iconEl.outerHTML : '';
        orbitText.textContent = item.getAttribute(`data-text-${lang}`);
        orbitItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    }

    function startOrbitRotation() {
        orbitInterval = setInterval(() => {
            if (!orbitPriorityActive) {
                orbitIndex = (orbitIndex + 1) % orbitItems.length;
                updateOrbitCenter(orbitIndex);
            }
        }, 3200);
    }

    orbitItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            orbitIndex = index;
            updateOrbitCenter(index);
            orbitPriorityActive = true;
            clearTimeout(orbitPriorityTimeout);
            orbitPriorityTimeout = setTimeout(() => { orbitPriorityActive = false; }, 4000);
        });
    });

    if (orbitItems.length) {
        updateOrbitCenter(orbitIndex);
        startOrbitRotation();
    }
    // ---------------------


    // --------------------- Fond animé : vague de particules
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