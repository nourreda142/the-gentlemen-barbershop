/**
 * THE GENTLEMEN — Main Global UI & Interaction Controller
 */

const GentlemenUI = (() => {
  // Toast notification container setup
  let toastContainer = null;

  function initToastContainer() {
    if (toastContainer) return;
    toastContainer = document.createElement('div');
    toastContainer.className = 'gentlemen-toast-container position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toastContainer);
  }

  function showToast({ title = 'Notice', message = '', type = 'info', duration = 4000 }) {
    initToastContainer();

    const toastEl = document.createElement('div');
    toastEl.className = `gentlemen-toast align-items-center border-0 text-white shadow-lg mb-3 ${type}`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    const icons = {
      success: 'bi-check2-circle text-gold',
      error: 'bi-exclamation-octagon text-danger',
      warning: 'bi-exclamation-triangle text-warning',
      info: 'bi-info-circle text-gold'
    };
    const iconClass = icons[type] || icons.info;

    toastEl.innerHTML = `
      <div class="d-flex p-3 align-items-start">
        <i class="bi ${iconClass} fs-4 me-3 mt-1 flex-shrink-0"></i>
        <div class="flex-grow-1 me-2">
          <div class="fw-bold text-gold small text-uppercase letter-spacing-1 mb-1">${title}</div>
          <div class="small text-light-subtle">${message}</div>
        </div>
        <button type="button" class="btn-close btn-close-white ms-auto p-2" aria-label="Close"></button>
      </div>
      <div class="toast-progress-bar"></div>
    `;

    toastContainer.appendChild(toastEl);

    // Close button
    const closeBtn = toastEl.querySelector('.btn-close');
    const dismiss = () => {
      toastEl.classList.add('hide');
      setTimeout(() => {
        if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
      }, 300);
    };

    closeBtn.addEventListener('click', dismiss);

    // Auto dismiss
    setTimeout(dismiss, duration);
  }

  // Confirmation dialog modal
  function confirmModal({ title = 'Are you sure?', message = '', confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false }) {
    return new Promise((resolve) => {
      let modalOverlay = document.getElementById('gentlemen-confirm-modal');
      if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'gentlemen-confirm-modal';
        modalOverlay.className = 'modal fade';
        modalOverlay.tabIndex = -1;
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(modalOverlay);
      }

      modalOverlay.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content gentlemen-modal-content">
            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title font-playfair fs-4 text-ivory">${title}</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body py-4 text-muted-ivory">
              <p class="mb-0">${message}</p>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-outline-bronze px-4" id="modal-cancel-btn" data-bs-dismiss="modal">${cancelText}</button>
              <button type="button" class="btn ${isDanger ? 'btn-danger' : 'btn-bronze'} px-4" id="modal-confirm-btn">${confirmText}</button>
            </div>
          </div>
        </div>
      `;

      const bsModal = new bootstrap.Modal(modalOverlay);
      bsModal.show();

      const confirmBtn = modalOverlay.querySelector('#modal-confirm-btn');
      const cancelBtn = modalOverlay.querySelector('#modal-cancel-btn');

      const handleConfirm = () => {
        bsModal.hide();
        resolve(true);
      };

      const handleCancel = () => {
        resolve(false);
      };

      confirmBtn.onclick = handleConfirm;
      cancelBtn.onclick = handleCancel;
      modalOverlay.addEventListener('hidden.bs.modal', () => resolve(false), { once: true });
    });
  }

  // Navbar scroll styling
  function initNavbarScroll() {
    const navbar = document.querySelector('.gentlemen-navbar');
    if (!navbar) return;

    const onScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Active navigation link detection
  function highlightActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .gentlemen-nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const targetPage = href.split('?')[0].split('#')[0];

      if (
        (currentPath === '' && (targetPage === 'index.html' || targetPage === './')) ||
        currentPath === targetPage
      ) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Scroll animations with IntersectionObserver
  function initScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const elements = document.querySelectorAll('.reveal-on-scroll');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
  }

  // Dynamic footer year
  function initFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  // Initialize all global components on DOM load
  function init() {
    initNavbarScroll();
    highlightActiveNavLink();
    initScrollAnimations();
    initFooterYear();
  }

  return {
    init,
    showToast,
    confirmModal
  };
})();

// Kick off when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  GentlemenUI.init();
});
