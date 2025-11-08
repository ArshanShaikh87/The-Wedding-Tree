// Shrink navbar on scroll
window.addEventListener("scroll", function() {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.backgroundColor = "#111";
    navbar.style.padding = "10px 40px";
  } else {
    navbar.style.backgroundColor = "var(--black)";
    navbar.style.padding = "20px 40px";
  }
});
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});