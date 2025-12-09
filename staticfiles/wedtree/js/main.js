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
// const menuToggle = document.querySelector('.menu-toggle');
// const navLinks = document.querySelector('.nav-links');

// menuToggle?.addEventListener('click', () => {
//   navLinks.classList.toggle('active');
// });


// =============================
// 🌟 Mobile Menu Toggle + Click Outside Close
// =============================
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelector(".nav-links");

  // Create hamburger icon dynamically if not in HTML
  let menuToggle = document.querySelector(".menu-toggle");
  if (!menuToggle) {
    menuToggle = document.createElement("button");
    menuToggle.classList.add("menu-toggle");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    navbar.appendChild(menuToggle);
  }

  // Toggle Menu Open/Close
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent triggering document click
    const isActive = navLinks.classList.toggle("active");

    // Change icon (bars <-> cross)
    menuToggle.innerHTML = isActive
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';

    // Prevent background scroll
    document.body.style.overflow = isActive ? "hidden" : "auto";
  });

  // ✅ Close menu if user clicks outside nav-links
  document.addEventListener("click", (e) => {
    const isClickInsideMenu = navLinks.contains(e.target) || menuToggle.contains(e.target);
    if (!isClickInsideMenu && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      document.body.style.overflow = "auto";
    }
  });

  // ✅ Also close when a nav link is clicked
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        document.body.style.overflow = "auto";
      }
    });
  });
});
