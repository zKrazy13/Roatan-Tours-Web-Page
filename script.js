document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Año en el footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header con fondo al hacer scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Menú móvil ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Medidor de profundidad (elemento de firma) ---------- */
  const depthFill = document.getElementById('depthFill');
  const depthMarker = document.getElementById('depthMarker');
  const depthLabel = document.getElementById('depthLabel');
  const MAX_DEPTH_M = 30; // profundidad "máxima" simbólica, como un dive computer

  const updateDepthGauge = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    const meters = Math.round(progress * MAX_DEPTH_M);

    depthFill.style.height = `${progress * 100}%`;
    depthMarker.style.top = `${progress * 100}%`;
    depthLabel.textContent = `${meters}m`;
  };
  updateDepthGauge();
  window.addEventListener('scroll', updateDepthGauge, { passive: true });
  window.addEventListener('resize', updateDepthGauge);

  /* ---------- Animación de aparición al hacer scroll ---------- */
  const animatedItems = document.querySelectorAll('.tour-card, .reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    animatedItems.forEach(item => observer.observe(item));
  } else {
    animatedItems.forEach(item => item.classList.add('is-visible'));
  }

  /* ---------- Filtro del catálogo de tours ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const tourCards = document.querySelectorAll('.tour-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;

      tourCards.forEach(card => {
        const matches = filter === 'todos' || card.dataset.category === filter;
        card.hidden = !matches;
        if (matches) card.classList.add('is-visible');
      });
    });
  });

  /* ---------- Lightbox de la galería ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxMedia = document.getElementById('lightboxMedia');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery__item').forEach(item => {
    item.addEventListener('click', () => {
      const caption = item.dataset.caption || '';
      const photo = item.querySelector('.gallery__photo');
      const photoLoaded = photo && photo.style.display !== 'none' && photo.complete && photo.naturalWidth > 0;

      lightboxMedia.innerHTML = '';
      if (photoLoaded) {
        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.alt;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = 'inherit';
        lightboxMedia.style.background = 'none';
        lightboxMedia.appendChild(img);
      } else {
        const tint = getComputedStyle(item).getPropertyValue('--tint');
        const tint2 = getComputedStyle(item).getPropertyValue('--tint2');
        lightboxMedia.style.background = `linear-gradient(135deg, ${tint}, ${tint2})`;
        lightboxMedia.textContent = 'Foto de ejemplo';
      }

      lightboxCaption.textContent = caption;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });

  /* ---------- Validación del formulario de contacto ---------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  const showError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`err-${fieldId}`);
    field.closest('.field').classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name) { showError('name', 'Escribe tu nombre.'); valid = false; }
    else showError('name', '');

    if (!email) { showError('email', 'Escribe tu correo.'); valid = false; }
    else if (!isValidEmail(email)) { showError('email', 'Ese correo no parece válido.'); valid = false; }
    else showError('email', '');

    if (!message) { showError('message', 'Cuéntanos brevemente qué necesitas.'); valid = false; }
    else showError('message', '');

    if (!valid) {
      successMsg.hidden = true;
      return;
    }

    // Aquí normalmente se enviaría el formulario a un backend o servicio de correo.
    successMsg.hidden = false;
    form.reset();
  });

});
