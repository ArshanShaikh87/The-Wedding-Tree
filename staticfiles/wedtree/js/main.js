// ====================================================
// 🌟 The Wedding Tree — Final JS (Navigation + Scroll)
// ====================================================

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("mobileOverlay");
  const header = document.querySelector(".site-header");
  const scrollTopBtn = document.getElementById("scrollTop");
  const body = document.body;

  // Mobile menu toggle
  menuToggle.addEventListener("click", () => {
    const active = mobileMenu.classList.toggle("active");
    overlay.classList.toggle("active");
    body.style.overflow = active ? "hidden" : "auto";
  });

  // Close menu on overlay click
  overlay.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
    body.style.overflow = "auto";
  });

  // Auto close when clicking a link
  document.querySelectorAll(".mobile-nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      overlay.classList.remove("active");
      body.style.overflow = "auto";
    });
  });

  // Header scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");

    scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  // Scroll top behavior
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});