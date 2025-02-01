// Gestionnaire de la navigation et des sections
document.addEventListener('DOMContentLoaded', () => {

    
    // // Variables pour le texte qui s'écrit
    // const typingText = document.querySelector('.typing-text');
    // const text = typingText.textContent;
    // typingText.textContent = '';
    // let charIndex = 0;

    // // Fonction pour écrire le texte lettre par lettre
    // function typeText() {
    //     if (charIndex < text.length) {
    //         typingText.textContent += text[charIndex];
    //         charIndex++;
    //         setTimeout(typeText, 100);
    //     }
    // }

    // // Démarrer l'animation d'écriture
    // typeText();

    // Effet de la souris sur la section 1
    const section1 = document.getElementById('section1');
    section1.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { width, height } = section1.getBoundingClientRect();
        const moveX = (clientX / width - 0.5) * 20;
        const moveY = (clientY / height - 0.5) * 20;
        
        section1.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
    });

    // Gestion de la navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    // Observer les sections pour la navigation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                updateActiveNavItem(sectionId);
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));

    function updateActiveNavItem(sectionId) {
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${sectionId}`) {
                item.classList.add('active');
            }
        });
    }

    // Gestion du changement de langue
    const languageToggle = document.getElementById('languageToggle');
    let currentLang = 'fr';

    languageToggle.addEventListener('click', () => {
        currentLang = currentLang === 'fr' ? 'en' : 'fr';
        languageToggle.textContent = currentLang === 'fr' ? 'EN' : 'FR';
        updateLanguage();
    });

    function updateLanguage() {
        const elements = document.querySelectorAll('[data-fr][data-en]');
        elements.forEach(element => {
            element.textContent = element.getAttribute(`data-${currentLang}`);
        });
    }

    // Animation d'entrée pour les sections
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

});