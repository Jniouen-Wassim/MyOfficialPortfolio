// Gestionnaire de la navigation et des sections
document.addEventListener('DOMContentLoaded', () => {

    // --------------------- Gestion du changement de langue
        const languageToggle = document.getElementById('languageToggle');
        let currentLang = 'fr';
        let isTyping = false; // Drapeau pour vérifier si l'animation est en cours car sinon ça bug et les textes s'empilent
        const translateContainer = document.querySelector('.translate-container'); // Conteneur pour les textes traduisibles

        languageToggle.addEventListener('click', () => {
            if (!isTyping) {
                currentLang = currentLang === 'fr' ? 'en' : 'fr';
                languageToggle.textContent = currentLang === 'fr' ? 'EN' : 'FR';
                updateLanguage();
                updateTypingText();
            }
        });

        function updateLanguage() {
            const elements = translateContainer.querySelectorAll('[data-fr][data-en]');
            elements.forEach(element => {
                if (element.id !== 'typing-text') { // Ne pas mettre à jour le titre ici
                    element.innerHTML = element.dataset[currentLang]; //On ne met pas textContent mais innerHtml pour détecter les balises dans data-fr et data-en
                }
            });
        }

        // Fonction pour mettre à jour le texte à écrire
        function updateTypingText() {
            const typingText = document.querySelector('.h1-title');
            const text = typingText.getAttribute(`data-${currentLang}`);
            typingText.textContent = '';
            let charIndex = 0;
            isTyping = true; // Définir le drapeau sur true
            languageToggle.classList.add('disabled'); // Désactiver le btn le temps que l'animation du texte soit fini pour éviter les bugs de compilation de texte

            // Fonction pour écrire le texte lettre par lettre
            function typeText() {
                if (charIndex < text.length) {
                    typingText.textContent += text[charIndex];
                    charIndex++;
                    setTimeout(typeText, 100);
                } else {
                    isTyping = false; // Réinitialiser le drapeau
                    languageToggle.classList.remove('disabled'); // Réactiver le bouton
                }
            }

            // Démarrer l'animation d'écriture
            typeText();
        }

        // Initialiser la langue et le texte au chargement de la page
        updateLanguage();
        updateTypingText();
    // ---------------------(FIN)


    // --------------------- Effet (parallax) de la souris sur la section 1
        const sectionHome = document.getElementById('sectionHome');
        sectionHome.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { width, height } = sectionHome.getBoundingClientRect();
            const moveX = (clientX / width - 0.5) * 5; /* Fonctionnel, mais ne marche pas car l'image est trop petite en largeur */
            const moveY = (clientY / height - 0.5) * 5;
            
            sectionHome.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
        });
    // ---------------------(FIN)


    // --------------------- Gestion de la navigation
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.section');

        // Fonction pour mettre à jour l'élément de navigation actif
        function updateActiveNavItem(sectionId) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }

        // Écouteurs d'événements pour la navigation manuelle
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                const sectionId = this.getAttribute('href').substring(1);
                
                // Faire défiler jusqu'à la section
                const targetSection = document.getElementById(sectionId);
                targetSection.scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Observer les sections pour la navigation automatique (scroll)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                    const sectionId = entry.target.id;
                    updateActiveNavItem(sectionId);
                }
            });
        }, {
            threshold: [0.3] // Déclencher quand 30% de la section est visible
        });

        sections.forEach(section => observer.observe(section));
    // ---------------------(FIN)

    
    // --------------------- Animation + menu circulaire de compétences
        const menuItems = document.querySelectorAll('.menu-item');
        const centerText = document.querySelector('.center-text');
        const centerContent = document.querySelector('.center-content');
        let currentIndex = 0;
        let rotationInterval;
        let priorityTimeout;
        let isPriorityActive = false;

        // Positionner les éléments du menu en cercle
        function positionMenuItems() {
            const container = document.querySelector('.menu-container');
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            const radius = Math.min(containerWidth, containerHeight) * 0.4;
            
            menuItems.forEach((item, index) => {
                const angle = (index * 72 - 90) * (Math.PI / 180); // 72° = 360° / 5 items
                const x = radius * Math.cos(angle) + containerWidth / 2;
                const y = radius * Math.sin(angle) + containerHeight / 2;
                
                item.style.left = `${x}px`;
                item.style.top = `${y}px`;
            });
        }

        // Mettre à jour le contenu central
        function updateCenterContent(index) {
            const item = menuItems[index];
            centerText.textContent = item.getAttribute('data-text');
            
            // Mettre à jour l'icône
            const iconClass = item.getAttribute('data-icon');
            centerContent.innerHTML = `<i class="center-icon fa-solid ${iconClass}"></i>`;
            
            // Mettre à jour la classe active
            menuItems.forEach(item => item.classList.remove('active'));
            menuItems[index].classList.add('active');

            // Animation de la forme
            const blob = document.querySelector('.blob');
            blob.style.animation = 'none';
            blob.offsetHeight; // Force reflow
            blob.style.animation = null;
        }

        // Rotation automatique
        function startRotation() {
            rotationInterval = setInterval(() => {
                if (!isPriorityActive) {
                    currentIndex = (currentIndex + 1) % menuItems.length;
                    updateCenterContent(currentIndex);
                }
            }, 4000);
        }

        // Gérer les clics sur les éléments du menu
        menuItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                updateCenterContent(index);
                
                // Activer la priorité
                isPriorityActive = true;
                
                // Nettoyer les timeouts existants
                if (priorityTimeout) {
                    clearTimeout(priorityTimeout);
                }
                
                // Définir un nouveau timeout
                priorityTimeout = setTimeout(() => {
                    isPriorityActive = false;
                }, 2000);
            });
        });

        // Initialisation
        positionMenuItems();
        updateCenterContent(currentIndex);
        startRotation();

        // Gérer le redimensionnement
        window.addEventListener('resize', positionMenuItems);
    // ---------------------(FIN)


    // --------------------- Animation d'entrée pour les sections (AOS)
        // const animateSection = (entries, observer) => {
        //     entries.forEach(entry => {
        //         if (entry.isIntersecting) {
        //             entry.target.style.opacity = '1';
        //             entry.target.style.transform = 'translateY(0)';
        //         }
        //     });
        // };

        // const sectionObserver = new IntersectionObserver(animateSection, {
        //     threshold: 0.1
        // });

        // sections.forEach(section => {
        //     section.style.opacity = '0';
        //     section.style.transform = 'translateY(50px)';
        //     section.style.transition = 'all 0.5s ease-out';
        //     sectionObserver.observe(section);
        // });
    // ---------------------(FIN)
});