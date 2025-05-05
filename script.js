// Preloader Gizleme
const preloader = document.getElementById('preloader');
if (preloader) {
    window.addEventListener('load', () => {
        setTimeout(() => { // Hafif gecikme ile daha pürüzsüz görünüm
            preloader.classList.add('hidden');
        }, 300);
    });
}

// Tema Yönetimi
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const currentTheme = localStorage.getItem('theme');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// İkonları güncelleme fonksiyonu
const updateThemeIcon = (isDarkMode) => {
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (isDarkMode) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
};

// Tema uygulama fonksiyonu
const applyTheme = (theme) => {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
    } else {
        body.classList.remove('dark-mode');
        updateThemeIcon(false);
    }
};

// Başlangıç temasını ayarla
if (currentTheme) {
    applyTheme(currentTheme);
} else if (prefersDarkScheme.matches) {
    applyTheme('dark');
} else {
    applyTheme('light'); // Varsayılan açık tema
}

// Tema değiştirme butonu olayı
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        let theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme === 'dark');
    });
}

// OS tema değişikliğini dinle
prefersDarkScheme.addEventListener('change', (e) => {
    // Sadece localStorage'da kayıtlı tema yoksa OS değişikliğini uygula
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

// Özel İmleç Yönetimi
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

         cursorOutline.animate([
            { left: `${posX}px`, top: `${posY}px` }
        ], {
            duration: 500,
            fill: 'forwards'
        });
    });

    const interactiveElements = document.querySelectorAll(
        'a, button, .project-card, .testimonial-card, .theme-toggle-button, input[type="text"], input[type="email"], textarea'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseout', () => {
            body.classList.remove('cursor-hover');
        });
    });
}

// DOMContentLoaded içinde çalışacak kodlar
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('#header nav ul');
    const navLinks = document.querySelectorAll('#header nav ul li a');
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('main section[id]');
    const animatedSections = sections;

    // Hamburger menü açma/kapama
    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Mobil menüde linke tıklayınca menüyü kapat
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navUl.classList.contains('active')) {
                navUl.classList.remove('active');
                 const icon = menuToggle.querySelector('i');
                 icon.classList.remove('fa-times');
                 icon.classList.add('fa-bars');
            }
        });
    });

    // Sayfa kaydırıldığında header'a class ekleme/kaldırma
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll();

     // Aktif bölümü navigasyonda vurgulama
     const navObserverOptions = {
        root: null,
        rootMargin: '-40% 0px -60% 0px',
        threshold: 0
    };

    const navObserverCallback = (entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`#header nav ul li a[href="#${id}"]`);

            if (entry.isIntersecting && navLink) {
                document.querySelectorAll('#header nav ul li a.active').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    };

    const navObserver = new IntersectionObserver(navObserverCallback, navObserverOptions);
    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Scroll ile bölümleri görünür yapma (Element Bazlı)
    const animatedElements = document.querySelectorAll('[data-scroll-delay]'); // Attribute'a sahip tüm elementleri seç

    const elementObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Görünürlüğün %10'u girince tetikle
        threshold: 0.1 // %10 görünür olunca
    };

    const elementObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.scrollDelay || 0; // data-scroll-delay değerini al (varsayılan 0)
                
                element.style.transitionDelay = `${delay}ms`; // Gecikmeyi uygula
                element.classList.add('visible'); // Görünür yap
                
                observer.unobserve(element); // Bir kere animasyon çalışınca gözlemlemeyi bırak
            }
        });
    };

    const elementObserver = new IntersectionObserver(elementObserverCallback, elementObserverOptions);

    animatedElements.forEach(el => {
        elementObserver.observe(el);
    });

    // Yetenek Çubukları Animasyonu
    const skillsContainer = document.querySelector('.skills-container');
    if (skillsContainer) {
        const skillsObserverOptions = {
            root: null,
            rootMargin: '0px 0px -25% 0px',
            threshold: 0
        };

        const skillsObserverCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        };

        const skillsObserver = new IntersectionObserver(skillsObserverCallback, skillsObserverOptions);
        skillsObserver.observe(skillsContainer);
    }

}); 