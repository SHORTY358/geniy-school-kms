const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 12);
}, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const priceTabs = document.querySelectorAll('[data-price-tab]');
const pricePanels = document.querySelectorAll('[data-price-panel]');

priceTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.priceTab;
    priceTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    pricePanels.forEach((panel) => {
      const active = panel.dataset.pricePanel === target;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  });
});

document.querySelectorAll('.faq-item > button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item').forEach((faq) => {
      faq.classList.remove('is-open');
      faq.querySelector('button').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

const modal = document.querySelector('#picker-modal');
const modalSteps = modal?.querySelectorAll('.modal-step');
const modalProgress = document.querySelector('#modal-progress-bar');
const answers = { class: '', goal: '' };
let lastFocused = null;

function showModalStep(step) {
  modalSteps?.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.step === String(step)));
  if (modalProgress) modalProgress.style.width = `${step * 33.333}%`;
}

function openModal(program = '') {
  lastFocused = document.activeElement;
  if (program) answers.class = program;
  modal?.classList.add('is-open');
  modal?.setAttribute('aria-hidden', 'false');
  body.classList.add('is-locked');
  showModalStep(program ? 2 : 1);
  window.setTimeout(() => modal?.querySelector('.modal-close')?.focus(), 50);
}

function closeModal() {
  modal?.classList.remove('is-open');
  modal?.setAttribute('aria-hidden', 'true');
  body.classList.remove('is-locked');
  showModalStep(1);
  lastFocused?.focus?.();
}

document.querySelectorAll('.js-open-picker').forEach((button) => {
  button.addEventListener('click', () => openModal(button.dataset.program || ''));
});

modal?.querySelectorAll('[data-close-modal]').forEach((element) => element.addEventListener('click', closeModal));

modal?.querySelectorAll('[data-answer]').forEach((button) => {
  button.addEventListener('click', () => {
    answers[button.dataset.answer] = button.dataset.value;
    showModalStep(button.dataset.answer === 'class' ? 2 : 3);
  });
});

document.querySelectorAll('.js-send-request').forEach((button) => {
  button.addEventListener('click', () => {
    const text = `Здравствуйте! Хочу подобрать занятие в центре «Гений». Ученик: ${answers.class || 'нужна консультация'}. Цель: ${answers.goal || 'помощь по школьной программе'}.`;
    window.open(`https://wa.me/${button.dataset.phone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    closeModal();
  });
});

const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox?.querySelector('img');

document.querySelectorAll('[data-image]').forEach((button) => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.image;
    lightboxImage.alt = button.querySelector('img')?.alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    body.classList.add('is-locked');
    lightbox.querySelector('.lightbox-close')?.focus();
  });
});

function closeLightbox() {
  lightbox?.classList.remove('is-open');
  lightbox?.setAttribute('aria-hidden', 'true');
  body.classList.remove('is-locked');
}

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox || event.target.closest('.lightbox-close')) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (lightbox?.classList.contains('is-open')) closeLightbox();
  if (modal?.classList.contains('is-open')) closeModal();
});

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 })
  : null;

document.querySelectorAll('.reveal').forEach((element) => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add('is-visible');
});

document.querySelector('#current-year').textContent = new Date().getFullYear();
