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
        }
    });

    updateLanguage();
    updateTypingText();
    // ---------------------


    // --------------------- Navigation : état actif + progression
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const navProgress = document.getElementById('navProgress');

    function updateActiveNavItem(sectionId) {
        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === `#${sectionId}`);
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('href').substring(1);
            document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
        });
    });

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                updateActiveNavItem(entry.target.id);
            }
        });
    }, { threshold: [0.3] });

    sections.forEach(section => navObserver.observe(section));

    function updateNavProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        navProgress.style.height = `${Math.min(progress, 100)}%`;
    }
    window.addEventListener('scroll', updateNavProgress, { passive: true });
    updateNavProgress();
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
            image: './assets/images/Culturius-stage.png',
            title: 'Culturius',
            tech: 'Next.js · Sass · Figma',
            live: 'https://culturius.com/fr?country=be',
            figma: FIGMA_PROFILE,
            desc: {
                fr: "Site web pour la startup Culturius, dédié à la découverte d'événements locaux.",
                en: 'Website for startup Culturius, built to help people discover local events.'
            },
            method: [
                { fr: "Cadrage des besoins et de l'architecture de l'information", en: 'Scoping requirements and information architecture' },
                { fr: 'Wireframes et maquettes UI sur Figma (desktop &amp; mobile)', en: 'Wireframes and UI mockups in Figma (desktop &amp; mobile)' },
                { fr: 'Intégration front-end en Next.js et Sass, du prototype à la mise en ligne', en: 'Front-end build in Next.js and Sass, from prototype to launch' }
            ]
        },
        lorenergie: {
            image: './assets/images/Culturius-stage.png',
            title: 'Lorenergie',
            tech: 'WordPress · PHP · Figma',
            live: '',
            figma: FIGMA_PROFILE,
            desc: {
                fr: 'Refonte du site de Lorenergie, entreprise spécialisée en solutions énergétiques durables.',
                en: "Redesign of Lorenergie's website, a company specialized in sustainable energy solutions."
            },
            method: [
                { fr: "User flows et arborescence pensés pour le secteur de l'énergie", en: 'User flows and sitemap designed for the energy sector' },
                { fr: "Maquettes UI et tests d'utilisabilité pour optimiser des formulaires complexes", en: 'UI mockups and usability testing to optimize complex forms' },
                { fr: "Design hand-off puis intégration WordPress avec l'équipe front-end", en: 'Design hand-off, then WordPress integration with the front-end team' }
            ]
        },
        rebelcompany: {
            image: './assets/images/Culturius-stage.png',
            title: 'RebelCompany',
            tech: 'Figma · HTML · CSS',
            live: '',
            figma: FIGMA_PROFILE,
            desc: {
                fr: "Refonte d'identité visuelle et de site sur-mesure pour une agence de communication digitale.",
                en: 'Visual identity and bespoke website redesign for a digital communication agency.'
            },
            method: [
                { fr: "Refonte de l'identité visuelle du client", en: "Redesign of the client's visual identity" },
                { fr: "Architecture de l'information et wireframes", en: 'Information architecture and wireframes' },
                { fr: 'Prototypes interactifs haute fidélité (desktop &amp; mobile) — intégration technique en attente', en: 'High-fidelity interactive prototypes (desktop &amp; mobile) — technical integration pending' }
            ]
        },
        cookup: {
            image: './assets/images/cookup.png',
            title: "Cook'up",
            tech: 'WordPress · PHP · Figma',
            live: 'https://cookup.emu.isfsc.be/',
            figma: FIGMA_PROFILE,
            desc: {
                fr: 'Plateforme de création et de publication de recettes de cuisine pour jeunes adultes.',
                en: 'Platform for creating and publishing recipes for young adults.'
            },
            method: [
                { fr: 'Maquettage UI sur Figma pour une plateforme de recettes', en: 'UI mockups in Figma for a recipe platform' },
                { fr: 'Développement du thème WordPress en PHP', en: 'WordPress theme development in PHP' },
                { fr: 'Publication et tests auprès de jeunes adultes', en: 'Launch and testing with young adult users' }
            ]
        },
        pizzaclick: {
            image: './assets/images/projet_pizza.png',
            title: 'PizzaClick',
            tech: 'React',
            live: 'https://jniouen-wassim.github.io/React-PizzaClick/',
            figma: '',
            desc: {
                fr: "Jeu inspiré de 'Cookie Clicker' : accumuler le plus de clics possible.",
                en: "A fun game inspired by 'Cookie Clicker' — rack up as many clicks as possible."
            },
            method: [
                { fr: 'Structuration du jeu en composants React', en: 'Structured the game into React components' },
                { fr: "Gestion d'état pour le compteur de clics et les upgrades", en: 'State management for the click counter and upgrades' },
                { fr: 'Déploiement sur GitHub Pages', en: 'Deployed on GitHub Pages' }
            ]
        },
        restaurant: {
            image: './assets/images/projet_restaurant.png',
            title: { fr: 'Restaurant fictif', en: 'Fictional restaurant' },
            tech: 'JavaScript · PHP',
            live: 'https://jeanfabry.github.io/Showcase-website-fictional-restaurant/',
            figma: '',
            desc: {
                fr: 'Site vitrine imaginé pour un restaurant gastronomique fictif.',
                en: 'Showcase website designed for a fictional fine-dining restaurant.'
            },
            method: [
                { fr: "Intégration HTML/CSS d'une maquette de restaurant gastronomique", en: 'HTML/CSS build of a fine-dining restaurant mockup' },
                { fr: 'Interactions en JavaScript et traitement de formulaire en PHP', en: 'JavaScript interactions and PHP form handling' },
                { fr: 'Site statique déployé en démonstration', en: 'Static site deployed as a demo' }
            ]
        },
        meninight: {
            image: './assets/images/projet_menInNight.png',
            title: 'Men In Night',
            tech: 'Next.js · Sass · Figma',
            live: 'https://men-in-night.vercel.app/',
            figma: FIGMA_PROFILE,
            desc: {
                fr: 'Carte de visite fictive pour un service de livraison de nourriture à domicile.',
                en: 'Fictional business card for a home food-delivery service.'
            },
            method: [
                { fr: "Conception d'une identité de marque fictive", en: 'Designed a fictional brand identity' },
                { fr: "Maquettage Figma d'une carte de visite digitale", en: 'Figma mockup of a digital business card' },
                { fr: 'Intégration en Next.js et Sass, déploiement sur Vercel', en: 'Built in Next.js and Sass, deployed on Vercel' }
            ]
        }
    };

    const modal = document.getElementById('projectModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalTags = document.getElementById('modalTags');
    const modalTech = document.getElementById('modalTech');
    const modalDesc = document.getElementById('modalDesc');
    const modalMethod = document.getElementById('modalMethod');
    const modalActions = document.getElementById('modalActions');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.querySelector('.modal-body');
    let lastFocused = null;

    const roleLabel = { designer: { fr: 'Designer', en: 'Designer' }, developer: { fr: 'Développeur', en: 'Developer' } };

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

        modalImage.src = data.image;
        modalImage.alt = typeof data.title === 'string' ? data.title : data.title[lang];
        modalTitle.textContent = typeof data.title === 'string' ? data.title : data.title[lang];
        modalTech.textContent = data.tech;
        modalDesc.textContent = data.desc[lang];

        const roles = (card.getAttribute('data-role') || '').split(' ');
        modalTags.innerHTML = roles.map(r => `<span class="modal-tag">${roleLabel[r][lang]}</span>`).join('');

        modalMethod.innerHTML = data.method.map(step => `<li>${step[lang]}</li>`).join('');

        let actions = '';
        if (data.live) {
            actions += `<a href="${data.live}" target="_blank" rel="noopener" class="btn btn-primary">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                <span>${lang === 'fr' ? 'Voir le site' : 'View site'}</span>
            </a>`;
        }
        if (data.figma) {
            actions += `<a href="${data.figma}" target="_blank" rel="noopener" class="btn btn-ghost">
                <i class="fa-brands fa-figma"></i>
                <span>${lang === 'fr' ? 'Voir sur Figma' : 'View on Figma'}</span>
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
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
    // ---------------------
});