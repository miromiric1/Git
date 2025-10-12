document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.remove('preload');

  const toggle = document.getElementById('theme-toggle');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const closeBtn = lightbox ? lightbox.querySelector('.close') : null;
  let lastFocused = null;

  // === THEME TOGGLE ===
  if (toggle) {
    const updateAria = () => {
      toggle.setAttribute('aria-pressed', document.documentElement.classList.contains('dark'));
    };

    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      document.documentElement.classList.toggle('light', !isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateAria();
    });

    updateAria();
  }

  // === LIGHTBOX ===
  if (lightbox && lightboxImg && closeBtn) {
    document.querySelectorAll('.grid-item.slika').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const img = item.querySelector('img');
        if (!img) return;

        lastFocused = document.activeElement;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Preview';
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lightbox.focus();
      });
    });

    const closeLightbox = () => {
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImg.src = '';
        if (lastFocused) lastFocused.focus();
      }, 200);
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false')
        closeLightbox();
    });
  }
}, { once: true });
