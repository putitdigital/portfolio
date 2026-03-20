const AppState = {
    currentLang: 'en',
    currentTheme: 'dark',
    smoothScrollInitialized: false,
    heroImagePinInitialized: false,
    heroImagePinned: false,
    isLoaded: false
};

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadPreferences();
    initLanguage();
    initTheme();
    initScrollEffects();
    initSmoothScroll();
    initBottomNavActiveState();
    initPinnedHeroImage();
    initChatBolt();
    generateParticles();
    updateLanguageUI();
    updateThemeUI();
    AppState.isLoaded = true;
}

function getHeaderOffset() {
    const header = document.querySelector('.main-header');
    return header ? header.offsetHeight : 0;
}
function loadPreferences() {
    const savedLang = localStorage.getItem('portfolio-lang');
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedLang) AppState.currentLang = savedLang;
    if (savedTheme) AppState.currentTheme = savedTheme;
}

function initLanguage() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
    setLanguage(AppState.currentLang);
}

function toggleLanguage() {
    const newLang = AppState.currentLang === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    localStorage.setItem('portfolio-lang', newLang);
}

function setLanguage(lang) {
    AppState.currentLang = lang;
    const html = document.documentElement;
    const body = document.body;
    
    if (lang === 'ar') {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        body.setAttribute('data-lang', 'ar');
        body.setAttribute('data-dir', 'rtl');
    } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        body.setAttribute('data-lang', 'en');
        body.setAttribute('data-dir', 'ltr');
    }
    updateLanguageUI();
}

function updateLanguageUI() {
    const textElements = document.querySelectorAll('[data-text-en], [data-text-ar]');
    textElements.forEach(element => {
        const enText = element.getAttribute('data-text-en');
        const arText = element.getAttribute('data-text-ar');
        if (AppState.currentLang === 'ar' && arText) {
            element.textContent = arText;
        } else if (AppState.currentLang === 'en' && enText) {
            element.textContent = enText;
        }
    });
    
    const placeholderElements = document.querySelectorAll('[data-placeholder-en], [data-placeholder-ar]');
    placeholderElements.forEach(element => {
        const enPlaceholder = element.getAttribute('data-placeholder-en');
        const arPlaceholder = element.getAttribute('data-placeholder-ar');
        if (AppState.currentLang === 'ar' && arPlaceholder) {
            element.setAttribute('placeholder', arPlaceholder);
        } else if (AppState.currentLang === 'en' && enPlaceholder) {
            element.setAttribute('placeholder', enPlaceholder);
        }
    });
    
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const langText = langToggle.querySelector('.lang-text');
        if (langText) {
            langText.textContent = AppState.currentLang === 'en' ? 'AR' : 'EN';
        }
    }
}

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    setTheme(AppState.currentTheme);
}

function toggleTheme() {
    const newTheme = AppState.currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
}

function setTheme(theme) {
    AppState.currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    updateThemeUI();
}

function updateThemeUI() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = AppState.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => observer.observe(element));
    
}

function generateParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    
    const codeSymbols = ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Angular', 'React', 'Node.js', 'Express.js', 'PHP', 'C#', 'Python', 'Java', 'SQL'];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

//--------------animations.js-----------------
function inView(element, callback, options = {}) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry);
                if (options.once !== false) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: options.amount || 0.1,
        rootMargin: options.rootMargin || '0px'
    });
    observer.observe(element);
    return () => observer.unobserve(element);
}

function animateElement(element, props, options = {}) {
    if (typeof anime === 'undefined') return;
    const animeProps = {};
    if (props.opacity) animeProps.opacity = props.opacity;
    if (props.x !== undefined) animeProps.translateX = props.x;
    if (props.y !== undefined) animeProps.translateY = props.y;
    if (props.scale) animeProps.scale = props.scale;
    return anime({
        targets: element,
        ...animeProps,
        duration: (options.duration || 0.8) * 1000,
        delay: (options.delay || 0) * 1000,
        easing: options.easing || 'easeOutExpo'
    });
}

window.addEventListener('load', () => {
    setTimeout(() => {
        initLoaderAnimation();
    }, 100);
});

function initLoaderAnimation() {
    const loader = document.getElementById('loader');
    const loaderPercent = document.getElementById('loaderPercent');
    if (!loader || !loaderPercent) return;
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            setTimeout(() => {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: loader,
                        opacity: [1, 0],
                        duration: 500,
                        easing: 'easeInOutQuad',
                        complete: () => {
                            loader.classList.add('hidden');
                            initPageAnimations();
                        }
                    });
                } else {
                    loader.classList.add('hidden');
                    initPageAnimations();
                }
            }, 300);
        }
        if (loaderPercent) {
            loaderPercent.textContent = Math.floor(progress) + '%';
        }
    }, 100);
}

function initPageAnimations() {
    setTimeout(() => {
        initHeroAnimations();
        initSkillAnimations();
        initTimelineAnimations();
        initProjectAnimations();
        initScrollAnimations();
        initContactAnimations();
        animateStats();
        initParallax();
    }, 300);
}

function initHeroAnimations() {
    if (typeof anime === 'undefined') return;
    
    const heroName = document.getElementById('heroName');
    if (heroName) {
        const nameValue = heroName.querySelector('.name-value');
        if (nameValue) {
            const originalText = nameValue.textContent;
            nameValue.textContent = '';
            anime({
                targets: { value: 0 },
                value: originalText.length,
                duration: 1500,
                delay: 500,
                easing: 'easeInOutQuad',
                update: function(anim) {
                    const length = Math.floor(anim.animatables[0].target.value);
                    nameValue.textContent = originalText.substring(0, length);
                },
                complete: () => {
                    const cursor = document.createElement('span');
                    cursor.className = 'name-cursor';
                    cursor.textContent = '|';
                    cursor.style.animation = 'blink 1s infinite';
                    nameValue.appendChild(cursor);
                    setTimeout(() => cursor.remove(), 2000);
                }
            });
        }
    }
    
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        anime({
            targets: heroTitle,
            opacity: [0, 1],
            translateX: [-30, 0],
            delay: 800,
            duration: 1000,
            easing: 'easeOutExpo'
        });
    }
    
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        anime({
            targets: heroDescription,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: 1200,
            duration: 1000,
            easing: 'easeOutExpo'
        });
    }
    
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    if (heroButtons.length > 0) {
        anime({
            targets: heroButtons,
            opacity: [0, 1],
            scale: [0.8, 1],
            delay: anime.stagger(100, {start: 1500}),
            duration: 800,
            easing: 'easeOutBack'
        });
    }
    
    const socialIcons = document.querySelectorAll('.hero-social .social-icon');
    if (socialIcons.length > 0) {
        anime({
            targets: socialIcons,
            opacity: [0, 1],
            scale: [0, 1],
            rotate: [180, 0],
            delay: anime.stagger(100, {start: 2000}),
            duration: 800,
            easing: 'easeOutBack'
        });
    }
    
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        anime({
            targets: profileImage,
            opacity: [0, 1],
            scale: [0.8, 1],
            rotate: [180, 0],
            delay: 1000,
            duration: 1500,
            easing: 'easeOutElastic(1, .8)'
        });
        
        profileImage.addEventListener('mouseenter', () => {
            anime({
                targets: profileImage,
                scale: [1, 1.1],
                rotate: [0, 5],
                duration: 500,
                easing: 'easeOutElastic(1, .8)'
            });
        });
        
        profileImage.addEventListener('mouseleave', () => {
            anime({
                targets: profileImage,
                scale: [1.1, 1],
                rotate: [5, 0],
                duration: 500,
                easing: 'easeOutElastic(1, .8)'
            });
        });
    }
    
    const badges = document.querySelectorAll('.floating-badge');
    if (badges.length > 0) {
        badges.forEach((badge, index) => {
            anime({
                targets: badge,
                opacity: [0, 1],
                scale: [0, 1],
                delay: 1500 + (index * 200),
                duration: 800,
                easing: 'easeOutBack'
            });
        });
    }
}

function initSkillAnimations() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    
    const skillItems = skillsSection.querySelectorAll('.skill-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItem = entry.target;
                const progressBar = skillItem.querySelector('.skill-progress');
                const percentElement = skillItem.querySelector('.skill-percent');
                const percent = parseInt(skillItem.getAttribute('data-percent') || 0);
                
                if (progressBar && typeof anime !== 'undefined') {
                    anime({
                        targets: progressBar,
                        width: ['0%', percent + '%'],
                        duration: 2000,
                        easing: 'easeOutExpo',
                        delay: 300
                    });
                    
                    anime({
                        targets: { value: 0 },
                        value: percent,
                        duration: 2000,
                        easing: 'easeOutExpo',
                        delay: 300,
                        update: function(anim) {
                            if (percentElement) {
                                percentElement.textContent = Math.floor(anim.animatables[0].target.value) + '%';
                            }
                        }
                    });
                }
                observer.unobserve(skillItem);
            }
        });
    }, { threshold: 0.5 });
    
    skillItems.forEach(item => observer.observe(item));
}

function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        inView(item, () => {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: item,
                    opacity: [0, 1],
                    translateX: [-50, 0],
                    delay: index * 150,
                    duration: 1000,
                    easing: 'easeOutExpo'
                });
            } else {
                animateElement(item, { opacity: [0, 1], x: [-50, 0] }, { duration: 0.8, delay: index * 0.1 });
            }
        }, { amount: 0.3 });
    });
}

function initProjectAnimations() {
    const projectCards = document.querySelectorAll('.clicked-card');
    projectCards.forEach((card, index) => {
        inView(card, () => {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: card,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    scale: [0.9, 1],
                    delay: index * 100,
                    duration: 1000,
                    easing: 'easeOutExpo'
                });
            } else {
                animateElement(card, { opacity: [0, 1], y: [50, 0], scale: [0.9, 1] }, { duration: 0.8, delay: index * 0.1 });
            }
        }, { amount: 0.2 });
        
        card.addEventListener('mouseenter', () => {
            if (typeof anime !== 'undefined') {
                anime({ targets: card, scale: [1, 1.02], duration: 300, easing: 'easeOutQuad' });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (typeof anime !== 'undefined') {
                anime({ targets: card, scale: [1.02, 1], duration: 300, easing: 'easeOutQuad' });
            }
        });
    });
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        inView(section, () => {
            const sectionHeader = section.querySelector('.section-header');
            if (sectionHeader && typeof anime !== 'undefined') {
                anime({
                    targets: sectionHeader,
                    opacity: [0, 1],
                    translateY: [-20, 0],
                    duration: 600,
                    easing: 'easeOutExpo'
                });
            }
        }, { amount: 0.2 });
    });
    
    const cards = document.querySelectorAll('.card, .project-card, .contact-item');
    cards.forEach((card, index) => {
        inView(card, () => {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: card,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    delay: index * 30,
                    duration: 500,
                    easing: 'easeOutExpo'
                });
            } else {
                animateElement(card, { opacity: [0, 1], y: [50, 0] }, { duration: 0.6, delay: index * 0.05 });
            }
        }, { amount: 0.2 });
    });
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count') || 0);
        inView(stat, () => {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: { value: 0 },
                    value: target,
                    duration: 2000,
                    easing: 'easeOutExpo',
                    update: function(anim) {
                        stat.textContent = Math.floor(anim.animatables[0].target.value);
                    }
                });
            }
        }, { amount: 0.5 });
    });
}

function initContactAnimations() {
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (typeof anime !== 'undefined') {
                anime({ targets: item, scale: [1, 1.02], duration: 200, easing: 'easeOutQuad' });
            }
        });
        item.addEventListener('mouseleave', () => {
            if (typeof anime !== 'undefined') {
                anime({ targets: item, scale: [1.02, 1], duration: 200, easing: 'easeOutQuad' });
            }
        });
    });
}

function initParallax() {
    const profileImage = document.getElementById('profileImage');
    if (!profileImage) return;
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.3;
                const maxOffset = 100;
                const offset = Math.min(scrolled * parallaxSpeed, maxOffset);
                
                if (profileImage) {
                    profileImage.style.transform = AppState.heroImagePinned ? 'translateY(0)' : `translateY(${offset}px)`;
                }
                
                const gridBg = document.querySelector('.code-grid-bg');
                if (gridBg) {
                    gridBg.style.transform = `translateY(${scrolled * 0.2}px)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

function initSmoothScroll() {
    if (AppState.smoothScrollInitialized) {
        return;
    }

    const links = document.querySelectorAll('a[href^="#"]');
    AppState.smoothScrollInitialized = true;

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') {
                return;
            }

            const targetSection = document.querySelector(targetId);
            if (!targetSection) {
                return;
            }

            e.preventDefault();
            const targetPosition = targetSection.offsetTop - getHeaderOffset();

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

function initBottomNavActiveState() {
    const navLinks = document.querySelectorAll('.bottom-nav-link');
    if (navLinks.length === 0) {
        return;
    }

    const sections = Array.from(navLinks)
        .map((link) => {
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) {
                return null;
            }

            const section = document.querySelector(targetId);
            if (!section) {
                return null;
            }

            return { link, section };
        })
        .filter(Boolean);

    if (sections.length === 0) {
        return;
    }

    function setActiveLink(activeSectionId) {
        sections.forEach(({ link, section }) => {
            const isActive = section.id === activeSectionId;
            link.classList.toggle('is-active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    function updateActiveLink() {
        const scrollProbe = window.scrollY + (window.innerHeight * 0.35);
        let activeId = sections[0].section.id;

        sections.forEach(({ section }) => {
            if (scrollProbe >= section.offsetTop) {
                activeId = section.id;
            }
        });

        setActiveLink(activeId);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    window.addEventListener('resize', updateActiveLink);
    window.addEventListener('load', updateActiveLink);

    updateActiveLink();
}

function initPinnedHeroImage() {
    if (AppState.heroImagePinInitialized) {
        return;
    }

    const heroImageWrapper = document.querySelector('.hero-image-wrapper');
    const homeSection = document.getElementById('home');
    const aboutSection = document.getElementById('about');
    const skillsSection = document.getElementById('skills');

    if (!heroImageWrapper || !homeSection || !aboutSection || !skillsSection) {
        return;
    }

    AppState.heroImagePinInitialized = true;
    let ticking = false;

    function clearPinnedState() {
        heroImageWrapper.classList.remove('hero-image-pinned');
        heroImageWrapper.style.removeProperty('left');
        heroImageWrapper.style.removeProperty('width');
        heroImageWrapper.style.removeProperty('top');
        AppState.heroImagePinned = false;
    }

    function updatePinnedState() {
        const isDesktop = window.innerWidth > 1024;
        if (!isDesktop) {
            clearPinnedState();
            return;
        }

        const scrollY = window.scrollY || window.pageYOffset;
        const homeTop = homeSection.offsetTop;
        const shouldPin = scrollY >= homeTop;
        if (!shouldPin) {
            clearPinnedState();
            return;
        }

        if (!heroImageWrapper.classList.contains('hero-image-pinned')) {
            const wrapperRect = heroImageWrapper.getBoundingClientRect();
            heroImageWrapper.style.left = `${wrapperRect.left}px`;
            heroImageWrapper.style.width = `${wrapperRect.width + 200}px`;
            heroImageWrapper.classList.add('hero-image-pinned');
        }

        const pinTop = Math.max(64, Math.round(window.innerHeight * 0.12));
        const moveStart = aboutSection.offsetTop;
        const moveDistance = Math.max(0, scrollY - moveStart);
        const moveSpeed = 1;
        const movedTop = pinTop - (moveDistance * moveSpeed);
        const hideBuffer = 200;
        const minTop = -(heroImageWrapper.offsetHeight + hideBuffer);
        const nextTop = Math.max(minTop, movedTop);
        heroImageWrapper.style.top = `${nextTop+150}px`;

        AppState.heroImagePinned = true;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updatePinnedState();
                ticking = false;
            });
            ticking = true;
        }
    });

    window.addEventListener('resize', () => {
        clearPinnedState();
        updatePinnedState();
    });

    updatePinnedState();
}

function initChatBolt() {
    const widget = document.getElementById('chatBoltWidget');
    const toggle = document.getElementById('chatBoltToggle');
    const panel = document.getElementById('chatBoltPanel');
    const closeBtn = document.getElementById('chatBoltClose');
    const form = document.getElementById('chatBoltForm');
    const input = document.getElementById('chatBoltInput');
    const messages = document.getElementById('chatBoltMessages');

    if (!widget || !toggle || !panel || !closeBtn || !form || !input || !messages) {
        return;
    }

    function addMessage(text, type) {
        const bubble = document.createElement('div');
        bubble.className = `chat-msg ${type}`;
        bubble.textContent = text;
        messages.appendChild(bubble);
        messages.scrollTop = messages.scrollHeight;
    }

    function getBotReply(rawText) {
        const text = rawText.toLowerCase();

        if (text.includes('frontend') || text.includes('front-end') || text.includes('front end')) {
            return 'Frontend skills: HTML & CSS, Angular, React.js, JavaScript (ES6+), Responsive Design, Laravel, SCSS, RxJS, Angular Material, Bootstrap, and Google Web Designer.';
        }

        if (text.includes('backend') || text.includes('back-end') || text.includes('back end') || text.includes('server')) {
            return 'Backend skills: Node.js, Express.js, PHP (Laravel), C# & .NET Core, Entity Framework, Sequelize ORM, JWT Authentication, REST APIs.';
        }

        if (text.includes('design') || text.includes('adobe') || text.includes('photoshop') || text.includes('figma')) {
            return 'Design tools: Adobe Photoshop, Illustrator, InDesign, After Effects, Spark AR Studio, Google Web Designer, Figma, and Adobe XD — with scripting automation via Adobe UXP.';
        }

        if (text.includes('skill') || text.includes('tech') || text.includes('stack') || text.includes('language') || text.includes('framework')) {
            return 'Sithembiso\'s stack: Frontend — HTML & CSS, Angular, React.js, JavaScript, Responsive Design. Backend — Node.js, Express.js, PHP, C# & .NET Core, Entity Framework. Databases & Tools — MySQL, SQL, WordPress, Azure Cloud, GitHub. Design — Photoshop, Illustrator, InDesign, After Effects, Figma, Google Web Designer.';
        }

        if (text.includes('education') || text.includes('study') || text.includes('degree') || text.includes('university') || text.includes('qualification') || text.includes('certif')) {
            return 'Education: Tshwane University of Technology — IT (IIS: Robotics, Software Dev, Graphic Design) 2018. Dynamic DNA — Microsoft Technology Associate, Software Dev Fundamentals (C# & .NET Core) 2019. University of the Witwatersrand JCSE — Cloud Computing (Azure) 2020. University of Cape Town — Web Design (HTML, CSS, JS & Hosting) 2020.';
        }

        if (text.includes('experience') || text.includes('work') || text.includes('job') || text.includes('career') || text.includes('tbwa') || text.includes('years')) {
            return 'Experience: Junior to Intermediate Full-Stack Developer @ TBWA\\SA (2021–Present). Intern Full-Stack Developer @ TBWA\\SA (2020). Intern Software Developer @ MACROCOMM (2019) — Entity Framework, Laravel, MySQL. Intern Web Developer @ Softstart Business & Technology Incubator (2018).';
        }

        if (text.includes('project') || text.includes('portfolio') || text.includes('build')) {
            return 'Notable projects: E-Commerce Platform (HTML/CSS/JS + MySQL), ASP.NET E-Commerce Platform (C#), Creative Template Photoshop Plugin (Adobe UXP), and Banner Automation App (Angular 13 + Node.js + MySQL). Check the Projects section for GitHub links.';
        }

        if (text.includes('github') || text.includes('code') || text.includes('repo')) {
            return 'GitHub: github.com/putitdigital — source code for banner automation, e-commerce, and other projects.';
        }

        if (text.includes('contact') || text.includes('email') || text.includes('phone') || text.includes('call') || text.includes('reach') || text.includes('linkedin')) {
            return 'Contact: Email — sithembiso72@gmail.com | Phone — +27 84 538 8953 or +27 67 225 4116 | LinkedIn — linkedin.com/in/sithembiso-sangweni-07b935113 | GitHub — github.com/putitdigital';
        }

        if (text.includes('cv') || text.includes('resume')) {
            return 'Use the Download CV button in the Hero or Contact section to get the latest resume.';
        }

        if (text.includes('location') || text.includes('located') || text.includes('where') || text.includes('city') || text.includes('country') || text.includes('based')) {
            return 'Sithembiso is based in Gauteng, Johannesburg, South Africa.';
        }

        if (text.includes('relocat') || text.includes('move') || text.includes('willing to') || text.includes('remote') || text.includes('abroad') || text.includes('overseas') || text.includes('hybrid')) {
            return 'Yes, Sithembiso is open to relocation and available for remote or hybrid work opportunities.';
        }

        if (text.includes('salary') || text.includes('rate') || text.includes('compensation') || text.includes('pay')) {
            return 'For salary or rate enquiries, please reach out directly at sithembiso72@gmail.com or call +27 84 538 8953.';
        }

        if (text.includes('available') || text.includes('hire') || text.includes('freelance') || text.includes('contract') || text.includes('full time') || text.includes('fulltime')) {
            return 'Sithembiso is open to full-time, contract, and freelance opportunities. Get in touch via email or LinkedIn.';
        }

        if (text.includes('about') || text.includes('who') || text.includes('tell me') || text.includes('yourself') || text.includes('sithembiso')) {
            return 'Sithembiso Sangweni is a Full-Stack Developer & UI/UX Designer based in Johannesburg with 5+ years of experience building web applications, automation workflows, and digital experiences. He specialises in Angular, React, Node.js, and Adobe tooling.';
        }

        if (text.includes('azure') || text.includes('cloud') || text.includes('hosting')) {
            return 'Sithembiso holds an Azure Cloud certification from University of the Witwatersrand JCSE (2020) and has hands-on hosting experience with Azure Cloud.';
        }

        if (text.includes('automat') || text.includes('scripting') || text.includes('uxp') || text.includes('banner') || text.includes('mailer')) {
            return 'Automation is one of Sithembiso\'s specialisms — JavaScript scripting for banner & mailer production, Adobe Photoshop/Illustrator UXP scripting, and a full-stack Banner Automation App (Angular + Node/Express + MySQL).';
        }

        return 'I can answer questions about skills, experience, education, projects, contact details, location, or availability. What would you like to know?';
    }

    function openPanel() {
        widget.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        input.focus();
    }

    function closePanel() {
        widget.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => {
        if (widget.classList.contains('open')) {
            closePanel();
        } else {
            openPanel();
        }
    });

    closeBtn.addEventListener('click', closePanel);

    document.addEventListener('click', (event) => {
        if (!widget.contains(event.target)) {
            closePanel();
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const question = input.value.trim();
        if (!question) {
            return;
        }

        addMessage(question, 'user');
        input.value = '';

        window.setTimeout(() => {
            addMessage(getBotReply(question), 'bot');
        }, 220);
    });

    addMessage('Hi, I am the portfolio assistant. Ask me about skills, experience, projects, or contact details.', 'bot');
}

let currentSlide = 0;
let autoSlide;

const slider = document.querySelector(".ecommerce-card .project-slider");
const slides = document.querySelectorAll(".ecommerce-card .project-slide");
const dots = document.querySelectorAll(".ecommerce-card .dot");

function updateSlider() {
    if (!slider || slides.length === 0 || dots.length === 0) {
        return;
    }

    slider.style.transform = `translateX(-${currentSlide * 100}%)`;

    slides.forEach((slide, index) => {
        slide.classList.toggle("active", index === currentSlide);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide);
    });
}

function nextSlide() {
    if (slides.length === 0) {
        return;
    }

    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    if (slides.length === 0) {
        return;
    }

    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}
function startAutoSlide() {
    if (!slider || slides.length < 2) {
        return;
    }

    autoSlide = setInterval(nextSlide, 4000);
}
function stopAutoSlide() {
    clearInterval(autoSlide);
}

const card = document.querySelector(".ecommerce-card");

if (card) {
    card.addEventListener("mouseenter", stopAutoSlide);
    card.addEventListener("mouseleave", startAutoSlide);
}

updateSlider();
startAutoSlide();

window.Animations = {
    initParallax,
    initSmoothScroll
};
