/* ============================================
   PORTFOLIO INTERACTIONS
   ============================================ */

(function() {
  'use strict';

  const html = document.documentElement;
  const body = document.body;

  // ============================================
  // THEME TOGGLE
  // ============================================
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // ============================================
  // LANGUAGE TOGGLE
  // ============================================
  const langToggle = document.getElementById('langToggle');
  const langCurrent = langToggle.querySelector('.lang-current');
  const savedLang = localStorage.getItem('lang') || 'en';

  function applyLang(lang) {
    const isAr = lang === 'ar';
    html.setAttribute('lang', lang);
    html.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    langCurrent.textContent = isAr ? 'عر' : 'EN';
    
    document.querySelectorAll('[data-en], [data-ar]').forEach(el => {
      const text = el.getAttribute(isAr ? 'data-ar' : 'data-en');
      if (text) {
        // Preserve child elements like icons and status dots
        const hasNestedHTML = el.children.length > 0 && !el.querySelector('svg, .status-dot, .cursor-blink');
        if (!hasNestedHTML) {
          // Walk through text nodes only if there are no nested elements
          if (el.children.length === 0) {
            el.textContent = text;
          } else {
            // Find the text node that needs updating, leave children alone
            for (let node of el.childNodes) {
              if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                node.textContent = text;
                break;
              }
            }
            // If no text node found, set text after the last child
            const hasTextNode = Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
            if (!hasTextNode) {
              el.appendChild(document.createTextNode(text));
            }
          }
        } else {
          el.textContent = text;
        }
      }
    });
  }

  applyLang(savedLang);

  langToggle.addEventListener('click', () => {
    const current = html.getAttribute('lang') || 'en';
    const next = current === 'en' ? 'ar' : 'en';
    localStorage.setItem('lang', next);
    applyLang(next);
  });

  // ============================================
  // MOBILE MENU
  // ============================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  // ============================================
  // SCROLL REVEAL
  // ============================================
  const revealElements = document.querySelectorAll(
    '.section, .skill-card, .stat-block, .cert, .project, .contact-link'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 50);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => observer.observe(el));

  // ============================================
  // NAV SCROLL EFFECT
  // ============================================
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scroll = window.pageYOffset;
    if (scroll > 50) {
      nav.style.borderBottomColor = 'var(--border-strong)';
    } else {
      nav.style.borderBottomColor = '';
    }
    lastScroll = scroll;
  }, { passive: true });

  // ============================================
  // TERMINAL TYPING EFFECT
  // ============================================
  const typedText = document.querySelector('.typed-text');
  if (typedText) {
    const commands = {
      en: ['whoami', 'cat profile.md', 'ls projects/', './intro.sh'],
      ar: ['من_أنا', 'عرض الملف', 'المشاريع', 'مقدمة']
    };
    
    let cmdIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseAt = 0;

    function type() {
      const lang = html.getAttribute('lang') || 'en';
      const list = commands[lang];
      const current = list[cmdIndex];

      if (pauseAt > 0) {
        pauseAt--;
        setTimeout(type, 60);
        return;
      }

      if (!isDeleting) {
        typedText.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          pauseAt = 30;
        }
      } else {
        typedText.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          cmdIndex = (cmdIndex + 1) % list.length;
          pauseAt = 5;
        }
      }
      setTimeout(type, isDeleting ? 50 : 100);
    }

    setTimeout(type, 2000);
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHORS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // ACTIVE NAV LINK ON SCROLL
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.pageYOffset >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--text)';
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // ============================================
  // CONSOLE EASTER EGG
  // ============================================
  const styles = [
    'color: #00e5a0',
    'font-family: monospace',
    'font-size: 14px',
    'font-weight: 600',
    'padding: 4px'
  ].join(';');

  console.log('%c[ nawaf.baryan ]', styles);
  console.log('%cIf you\'re reading this, you might be a fellow security person.\nNice to meet you. Reach out: nfbaryan@gmail.com', 'color: #8b9bb0; font-family: monospace');

})();
