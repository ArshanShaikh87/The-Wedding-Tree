document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------
     Horizontal scroll on mobile
  ------------------------------------ */
  document.querySelectorAll('.services-grid').forEach(grid => {
    grid.addEventListener('wheel', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        grid.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  });

  /* ------------------------------------
     Card active toggle (optional)
  ------------------------------------ */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      document
        .querySelectorAll('.service-card.active')
        .forEach(c => c.classList.remove('active'));

      card.classList.toggle('active');
    });
  });

  /* ------------------------------------
     Read More / Less (AUTO)
  ------------------------------------ */
  document.querySelectorAll('.service-card').forEach(card => {
    const desc = card.querySelector('.service-description');
    const btn  = card.querySelector('.read-more-btn');

    if (!desc || !btn) return;

    // Check if text is actually long
    desc.classList.remove('clamped');
    const fullHeight = desc.scrollHeight;
    desc.classList.add('clamped');
    const clampedHeight = desc.scrollHeight;

    if (fullHeight > clampedHeight + 5) {
      btn.hidden = false;
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent card click

      const isClamped = desc.classList.toggle('clamped');

      btn.textContent = isClamped ? 'Read More' : 'Read Less';
      btn.setAttribute('aria-expanded', !isClamped);
    });
  });

});
