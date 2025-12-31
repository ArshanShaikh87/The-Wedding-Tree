const navbar = document.querySelector(".navbar");

let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  // Scroll DOWN → hide header
  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    navbar.classList.add("nav-hidden");
  }
  // Scroll UP → show header
  else {
    navbar.classList.remove("nav-hidden");
  }

  lastScrollY = currentScrollY;
});
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


// =========================
// 🔝 Scroll To Top Button
// =========================
const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // Check karein ki elements exist karte hain (Avoids "null" error)
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Background scroll lock toggle
            const isActive = navLinks.classList.contains('active');
            if (isActive) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = 'auto';
            }

            // Hamburger icon change (Bars to X)
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });

        // Link click hone par menu band karein aur scroll on karein
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                body.style.overflow = 'auto';
            });
        });
    }
});

});
