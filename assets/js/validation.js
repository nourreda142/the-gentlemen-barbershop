/**
 * THE GENTLEMEN — Validation & Form Sanitization Utilities
 */

const GENTLEMEN_VALIDATION = (() => {
  // Regex patterns
  const PATTERNS = {
    name: /^[\p{L}\s'\-]{2,50}$/u,
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
    phone: /^(\+?[0-9\s\-().]{8,20})$/
  };

  function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function validateName(name) {
    const trimmed = (name || '').trim();
    if (!trimmed) {
      return { isValid: false, message: 'Please enter your full name.' };
    }
    if (trimmed.length < 2) {
      return { isValid: false, message: 'Name must be at least 2 characters long.' };
    }
    if (trimmed.length > 50) {
      return { isValid: false, message: 'Name must not exceed 50 characters.' };
    }
    if (!PATTERNS.name.test(trimmed)) {
      return { isValid: false, message: 'Name should contain letters only.' };
    }
    return { isValid: true, message: '' };
  }

  function validateEmail(email) {
    const trimmed = (email || '').trim();
    if (!trimmed) {
      return { isValid: false, message: 'Please provide an email address for your confirmation.' };
    }
    if (!PATTERNS.email.test(trimmed)) {
      return { isValid: false, message: 'Please enter a valid email address (e.g. name@domain.com).' };
    }
    return { isValid: true, message: '' };
  }

  function validatePhone(phone) {
    const trimmed = (phone || '').trim();
    if (!trimmed) {
      return { isValid: false, message: 'Please enter a mobile or contact phone number.' };
    }
    // Remove formatting to check digits
    const digitsOnly = trimmed.replace(/\D/g, '');
    if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      return { isValid: false, message: 'Please enter a valid telephone number (8–15 digits).' };
    }
    if (!PATTERNS.phone.test(trimmed)) {
      return { isValid: false, message: 'Phone contains invalid characters.' };
    }
    return { isValid: true, message: '' };
  }

  function validateDateString(dateStr) {
    if (!dateStr) {
      return { isValid: false, message: 'Please choose an appointment date.' };
    }
    const targetDate = new Date(`${dateStr}T23:59:59`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(targetDate.getTime())) {
      return { isValid: false, message: 'Invalid date selection.' };
    }
    if (targetDate < today) {
      return { isValid: false, message: 'Appointments cannot be booked for past dates.' };
    }
    return { isValid: true, message: '' };
  }

  // Update UI element with validation state
  function applyFieldFeedback(inputEl, feedbackEl, validationResult) {
    if (!inputEl) return;
    if (validationResult.isValid) {
      inputEl.classList.remove('is-invalid');
      inputEl.classList.add('is-valid');
      if (feedbackEl) {
        feedbackEl.textContent = '';
        feedbackEl.classList.remove('d-block');
      }
    } else {
      inputEl.classList.remove('is-valid');
      inputEl.classList.add('is-invalid');
      if (feedbackEl) {
        feedbackEl.textContent = validationResult.message;
        feedbackEl.classList.add('d-block');
      }
    }
  }

  return {
    sanitize,
    validateName,
    validateEmail,
    validatePhone,
    validateDateString,
    applyFieldFeedback
  };
})();
