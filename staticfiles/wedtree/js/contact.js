document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm') || document.getElementById('miniContactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending...';
    }
  });

  // If messages are present on page, scroll to them (improves UX)
  const messages = document.querySelector('.messages');
  if (messages) {
    messages.scrollIntoView({behavior: 'smooth', block: 'center'});
  }
});


 // Contact form Validations 
document.addEventListener('DOMContentLoaded', function () {
  const forms = document.querySelectorAll('.js-contact-form');

  forms.forEach(form => {
    const submitBtn = form.querySelector('button[type="submit"]');

    function showError(fieldName, message) {
      const errorSpan = form.querySelector(`.error-msg[data-error-for="${fieldName}"]`);
      if (errorSpan) {
        errorSpan.textContent = message || '';
      }
    }

    function clearErrors() {
      form.querySelectorAll('.error-msg').forEach(span => {
        span.textContent = '';
      });
    }

    function validateForm() {
      clearErrors();
      let isValid = true;

      const name = form.querySelector('input[name="name"]');
      const email = form.querySelector('input[name="email"]');
      const phone = form.querySelector('input[name="phone"]');
      const eventType = form.querySelector('select[name="event_type"]');
      const message = form.querySelector('textarea[name="message"]');

      // Name: min 3 chars
      if (!name.value.trim() || name.value.trim().length < 3) {
        showError('name', 'Please enter at least 3 characters.');
        isValid = false;
      }

      // Email: simple regex check
      const emailVal = email.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        showError('email', 'Please enter a valid email address.');
        isValid = false;
      }

      // Phone: digits only, 10–13 numbers
      const phoneVal = phone.value.trim();
      const digitsOnly = phoneVal.replace(/\D/g, '');
      if (!digitsOnly || digitsOnly.length < 10 || digitsOnly.length > 13) {
        showError('phone', 'Please enter a valid phone number (10–13 digits).');
        isValid = false;
      }

      // Event type: required
      if (!eventType.value) {
        showError('event_type', 'Please select an event type.');
        isValid = false;
      }

      // Message: min 10 chars
      if (!message.value.trim() || message.value.trim().length < 10) {
        showError('message', 'Please enter at least 10 characters.');
        isValid = false;
      }

      return isValid;
    }

    form.addEventListener('submit', function (e) {
      // ❗ prevent default first
      e.preventDefault();

      // Reset button state (in case of previous attempt)
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }

      const isValid = validateForm();

      if (!isValid) {
        // do NOT submit, do NOT disable button
        return;
      }

      // ✅ If valid: now lock button & submit for real
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // submit the form normally (will hit Django view)
      form.submit();
    });

    // Live validation: clear error when user types
    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', () => {
        const name = input.getAttribute('name');
        showError(name, '');
      });
    });
  });
});
  


