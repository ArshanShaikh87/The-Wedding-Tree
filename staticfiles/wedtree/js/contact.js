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
