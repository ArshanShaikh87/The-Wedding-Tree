// =========================================
//  HOME PAGE JS (Organized & Cleaned)
//  Sections:
//  1. AOS Initialization
//  2. Modal Viewer (Images / Videos)
//  3. Smooth Scroll for # links
//  4. Hero Background Lazy Load
//  5. Scroll Indicator → Highlights Section
// =========================================

document.addEventListener("DOMContentLoaded", function () {

  // ==========================================================
  // 1. AOS INITIALIZATION
  // ==========================================================
  try {
    if (AOS) AOS.init({ duration: 800, once: true });
  } catch (e) {
    console.warn("AOS not loaded");
  }



  // ==========================================================
  // 2. MODAL VIEWER (Image / Video Popup)
  // ==========================================================
  (function(){
  const row = document.getElementById('gpRow');
  const cards = Array.from(row.querySelectorAll('.gp-card'));
  const modal = document.getElementById('gpModal');
  const modalImg = document.getElementById('gpModalImg');
  const closeBtn = document.getElementById('gpClose');

  let activeIndex = -1;        // no active initially (flat)
  let hasActive = false;

  // helper: set active class
  function setActive(index){
    // clamp
    if(index < 0 || index >= cards.length) return;
    activeIndex = index;
    cards.forEach((c,i) => {
      c.classList.toggle('is-active', i === index);
    });
    row.classList.toggle('has-active', true);
    hasActive = true;
    // ensure focused
    cards[index].focus({preventScroll:true});
  }

  // helper: clear active (go back to flat)
  function clearActive(){
    activeIndex = -1;
    cards.forEach(c=> c.classList.remove('is-active'));
    row.classList.remove('has-active');
    hasActive = false;
  }

  // card click behavior:
  cards.forEach((card, i) => {
    // click: expand in place if not active or switch active, if click again while active -> open modal
    card.addEventListener('click', (e) => {
      if(activeIndex !== i){
        setActive(i);
      } else {
        openModal(i);
      }
    });

    // keyboard: Enter = expand/open, Space = open modal
    card.addEventListener('keydown', (ev) => {
      if(ev.key === 'Enter'){
        ev.preventDefault();
        if(activeIndex !== i) setActive(i); else openModal(i);
      } else if(ev.key === ' ' || ev.key === 'Spacebar'){
        ev.preventDefault();
        openModal(i);
      }
    });
  });

  // clicking outside active area clears active state
  document.addEventListener('click', (e) => {
    // if clicked outside the row entirely, clear active
    if(!row.contains(e.target) && hasActive && !modal.classList.contains('active')){
      clearActive();
    }
  });

  // modal handling
  function openModal(index){
    const src = cards[index].dataset.src || cards[index].querySelector('img').src;
    modalImg.src = src;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden','true');
    modalImg.src = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
  });

  // keyboard navigation: arrow keys for active selection and Esc to close modal
  document.addEventListener('keydown', function(e){
    if(modal.classList.contains('active')){
      if(e.key === 'Escape') closeModal();
      return;
    }

    if(e.key === 'Escape'){
      clearActive();
      return;
    }

    if(e.key === 'ArrowRight'){
      if(!hasActive) setActive(0);
      else setActive((activeIndex + 1) % cards.length);
    }
    if(e.key === 'ArrowLeft'){
      if(!hasActive) setActive(cards.length -1);
      else setActive((activeIndex - 1 + cards.length) % cards.length);
    }
  });

  // Optional: autoplay rotate when no user interaction (5s)
  let autoRotate = true;
  let rotateInterval = 5000;
  let rotateTimer = null;
  function startRotate(){
    if(!autoRotate) return;
    rotateTimer = setInterval(() => {
      if(!hasActive){
        // rotate visible card highlight (visual hint) but do not set active
        // we can set a temporary active ripple - for now, just highlight next then clear
        let idx = (Math.floor(Math.random()*cards.length));
        // quick pulse
        cards[idx].classList.add('pulse');
        setTimeout(()=>cards[idx].classList.remove('pulse'), 900);
      } else {
        // advance active
        setActive((activeIndex + 1) % cards.length);
      }
    }, rotateInterval);
  }
  function stopRotate(){ clearInterval(rotateTimer); rotateTimer = null; }

  // stop rotation when user interacts
  ['click','touchstart','keydown','mousemove'].forEach(ev => {
    document.addEventListener(ev, ()=> { autoRotate=false; stopRotate(); }, {once:true});
  });

  startRotate();

})();

// / Add this at bottom of gallery-preview.js (after DOMContentLoaded setup) or inside DOMContentLoaded
(function addMobileSwipeSupport() {
  const row = document.getElementById('gpRow');
  if (!row) return;

  let startX = 0;
  let startTime = 0;
  const threshold = 40;       // px needed to qualify as swipe
  const allowedTime = 500;    // max ms to consider it a quick swipe

  row.addEventListener('touchstart', function (e) {
    const t = e.changedTouches[0];
    startX = t.pageX;
    startTime = Date.now();
  }, {passive: true});

  row.addEventListener('touchend', function (e) {
    const t = e.changedTouches[0];
    const dist = t.pageX - startX;
    const elapsed = Date.now() - startTime;

    // locate cards NodeList and current active index
    const cards = Array.from(row.querySelectorAll('.gp-card:not(.empty)'));
    if (!cards.length) return;

    // find current active index (fallback: 0 if none)
    let activeIndex = cards.findIndex(c => c.classList.contains('is-active'));
    if (activeIndex === -1) activeIndex = 0;

    if (elapsed <= allowedTime && Math.abs(dist) >= threshold) {
      // swipe left (dist < 0) means go next; swipe right means prev
      if (dist < 0) {
        activeIndex = (activeIndex + 1) % cards.length;
      } else {
        activeIndex = (activeIndex - 1 + cards.length) % cards.length;
      }
      // call existing setActive if available
      if (typeof window.setActive === 'function') {
        window.setActive(activeIndex);
      } else {
        // fallback: simulate click on target card
        const target = cards[activeIndex];
        if (target) {
          target.click();
          // ensure we scroll it into view nicely
          target.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
        }
      }
    } else {
      // treat as tap: ensure clicked card becomes active or opens modal
      const tappedEl = document.elementFromPoint(t.pageX - window.pageXOffset, t.pageY - window.pageYOffset);
      const card = tappedEl && tappedEl.closest && tappedEl.closest('.gp-card');
      if (card) {
        const idx = cards.indexOf(card);
        if (idx !== -1) {
          // click to trigger existing behavior
          card.click();
        }
      }
    }
  }, {passive: true});
})();
  // ==========================================================
  // 3. SMOOTH SCROLL FOR INTERNAL LINKS (#)
  // ==========================================================
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetID = this.getAttribute("href");

      if (targetID.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(targetID);

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });



  // ==========================================================
  // 4. HERO BACKGROUND IMAGE LAZY LOAD
  // ==========================================================
  const hero = document.querySelector(".hero");
  if (hero && hero.dataset.bg) {
    const img = new Image();
    img.src = hero.dataset.bg;

    img.onload = () => {
      hero.style.backgroundImage = `url('${hero.dataset.bg}')`;
      hero.classList.add("loaded");
    };
  }



  // ==========================================================
  // 5. SCROLL INDICATOR → Highlights Section
  // ==========================================================
  const indicator = document.getElementById("scrollIndicator");
  if (indicator) {
    const findSection = () => {
      const highlights =
        document.querySelector(".highlights") ||
        document.querySelector("#highlights") ||
        document.querySelector('[data-section="highlights"]');

      if (highlights) return highlights;

      const heroNext = document.querySelector(".hero")?.nextElementSibling;
      return heroNext && heroNext.tagName === "SECTION" ? heroNext : null;
    };

    const scrollToSection = () => {
      const target = findSection();
      if (!target) return;

      const header = document.querySelector(".navbar");
      const offset = header ? header.offsetHeight : 0;

      const topPosition = target.getBoundingClientRect().top + window.scrollY - offset - 10;

      window.scrollTo({ top: topPosition, behavior: "smooth" });
    };

    indicator.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToSection();
    });

    indicator.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollToSection();
      }
    });
  }

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


document.addEventListener("DOMContentLoaded", () => {
    const alertBox = document.querySelector(".alert-message");
    if (alertBox) {
        setTimeout(() => {
            alertBox.style.transition = "opacity 0.6s ease";
            alertBox.style.opacity = "0";
            setTimeout(() => alertBox.remove(), 600);
        }, 3000); // hide after 3 seconds
    }
});

});
