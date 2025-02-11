// Gestionnaire de la navigation et des sections
document.addEventListener('DOMContentLoaded', () => {

    // --------------------- Gestion du changement de langue
            const languageToggle = document.getElementById('languageToggle');
            let currentLang = 'fr';
            let isTyping = false; // Drapeau pour vérifier si l'animation est en cours car sinon ça bug et les textes s'empilent
            const translateContainer = document.querySelector('.translate-container');

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
                        element.innerHTML = element.dataset[currentLang];
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
                languageToggle.classList.add('disabled'); // Désactiver le bouton le temps que l'animation du texte soit fini pour éviter les bugs de compilation de texte

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
    // ---------------------


    // --------------------- Effet (parallax)de la souris sur la section 1
        const sectionHome = document.getElementById('sectionHome');
        sectionHome.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { width, height } = sectionHome.getBoundingClientRect();
            const moveX = (clientX / width - 0.5) * 5; /* Fonctionnel, mais ne marche pas car l'image est trop petite en largeur */
            const moveY = (clientY / height - 0.5) * 5;
            
            sectionHome.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
        });
    // ---------------------

        
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
    // ---------------------


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
    // ---------------------
    

});