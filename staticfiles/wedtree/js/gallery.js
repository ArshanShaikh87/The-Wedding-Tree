// // gallery.js — category + media filtering + lightbox + video controls
// document.addEventListener('DOMContentLoaded', () => {

//   const items = Array.from(document.querySelectorAll('.gallery-item'));
//   const categoryBtns = Array.from(document.querySelectorAll('.filter-btn'));
//   const mediaBtns = Array.from(document.querySelectorAll('.media-btn'));

//   let activeCategory = 'all';
//   let activeMedia = 'all';

//   /* =========================
//      FILTER LOGIC (CORE)
//      ========================= */
//   function applyFilters() {
//     items.forEach(item => {
//       const itemCategory = item.dataset.category;
//       const itemType = item.dataset.type;

//       const categoryMatch =
//         activeCategory === 'all' || itemCategory === activeCategory;

//       const mediaMatch =
//         activeMedia === 'all' || itemType === activeMedia;

//       item.style.display = (categoryMatch && mediaMatch)
//         ? 'block'
//         : 'none';
//     });
//   }

//   /* =========================
//      CATEGORY BUTTONS
//      ========================= */
//   categoryBtns.forEach(btn => {
//     btn.addEventListener('click', () => {
//       categoryBtns.forEach(b => b.classList.remove('active'));
//       btn.classList.add('active');

//       activeCategory = btn.dataset.filter;
//       applyFilters();
//     });
//   });

//   /* =========================
//      MEDIA BUTTONS
//      ========================= */
//   mediaBtns.forEach(btn => {
//     btn.addEventListener('click', () => {
//       mediaBtns.forEach(b => b.classList.remove('active'));
//       btn.classList.add('active');

//       activeMedia = btn.dataset.media;
//       applyFilters();
//     });
//   });

//   // default state
//   applyFilters();

//   /* =========================
//      LIGHTBOX ELEMENTS
//      ========================= */
//   const lb = document.getElementById('mediaLightbox');
//   const lbImage = document.getElementById('lbImage');
//   const lbVideo = document.getElementById('lbVideo');
//   const lbTitle = document.getElementById('lbTitle');
//   const lbCategory = document.getElementById('lbCategory');
//   const lbPlay = document.getElementById('lbPlay');
//   const lbProgress = document.getElementById('lbProgress');
//   const lbFullscreen = document.getElementById('lbFullscreen');
//   const lbClose = document.querySelector('.lb-close');

//   /* =========================
//      UTILITY
//      ========================= */
//   function pauseAllExcept(exceptVideo) {
//     document.querySelectorAll('video').forEach(v => {
//       if (v !== exceptVideo) {
//         try { v.pause(); } catch (e) {}
//       }
//     });
//   }

//   /* =========================
//      ITEM EVENTS
//      ========================= */
//   items.forEach(item => {
//     const mediaType = item.dataset.type;
//     const src = item.dataset.src;
//     const title = item.querySelector('.overlay-text h3')?.innerText || '';
//     const category = item.querySelector('.overlay-text .cat')?.innerText || '';

//     const playBtn = item.querySelector('.play-pause');
//     const fullscreenBtn = item.querySelector('.fullscreen');
//     const inlineProgress = item.querySelector('.progress-bar');
//     const videoEl = item.querySelector('video');

//     /* -------- VIDEO CONTROLS (VIDEOS ONLY) -------- */
//     if (mediaType === 'video' && playBtn && videoEl) {

//       playBtn.addEventListener('click', e => {
//         e.stopPropagation();
//         if (videoEl.paused) {
//           pauseAllExcept(videoEl);
//           videoEl.play();
//           playBtn.textContent = '⏸';
//         } else {
//           videoEl.pause();
//           playBtn.textContent = '▶';
//         }
//       });

//       videoEl.addEventListener('timeupdate', () => {
//         if (inlineProgress && videoEl.duration) {
//           inlineProgress.value =
//             (videoEl.currentTime / videoEl.duration) * 100;
//         }
//       });

//       videoEl.addEventListener('ended', () => {
//         playBtn.textContent = '▶';
//       });

//       fullscreenBtn?.addEventListener('click', e => {
//         e.stopPropagation();
//         const fs =
//           videoEl.requestFullscreen ||
//           videoEl.webkitRequestFullscreen ||
//           videoEl.webkitEnterFullscreen;
//         if (fs) fs.call(videoEl);
//       });
//     }

//     /* -------- OPEN LIGHTBOX -------- */
//     item.addEventListener('click', e => {
//       if (e.target.closest('.inline-controls')) return;

//       lb.classList.remove('hidden');
//       document.body.classList.add('lightbox-open');

//       lbTitle.textContent = title;
//       lbCategory.textContent = category;
//       lbPlay.textContent = '▶';
//       lbProgress.value = 0;

//       if (mediaType === 'image') {
//         lbVideo.pause();
//         lbVideo.style.display = 'none';
//         lbImage.src = src;
//         lbImage.style.display = 'block';
//       } else {
//         lbImage.style.display = 'none';
//         lbVideo.src = src;
//         lbVideo.currentTime = 0;
//         lbVideo.style.display = 'block';
//         lbVideo.pause();
//       }

//       pauseAllExcept(null);
//     });
//   });

//   /* =========================
//      LIGHTBOX CONTROLS
//      ========================= */
//   function closeLightbox() {
//     lb.classList.add('hidden');
//     document.body.classList.remove('lightbox-open');
//     lbVideo.pause();
//     lbVideo.src = '';
//     lbImage.src = '';
//   }

//   lbClose.addEventListener('click', closeLightbox);

//   document.addEventListener('keydown', e => {
//     if (e.key === 'Escape') closeLightbox();
//   });

//   lb.addEventListener('click', e => {
//     if (e.target === lb) closeLightbox();
//   });

//   lbPlay.addEventListener('click', () => {
//     if (lbVideo.style.display !== 'block') return;
//     if (lbVideo.paused) {
//       pauseAllExcept(lbVideo);
//       lbVideo.play();
//       lbPlay.textContent = '⏸';
//     } else {
//       lbVideo.pause();
//       lbPlay.textContent = '▶';
//     }
//   });

//   lbVideo.addEventListener('timeupdate', () => {
//     if (lbVideo.duration) {
//       lbProgress.value =
//         (lbVideo.currentTime / lbVideo.duration) * 100;
//     }
//   });

//   lbFullscreen.addEventListener('click', () => {
//     const fs =
//       lbVideo.requestFullscreen ||
//       lbVideo.webkitRequestFullscreen ||
//       lbVideo.webkitEnterFullscreen;
//     if (fs) fs.call(lbVideo);
//   });

//   /* =========================
//      BASIC DOWNLOAD DETERRENT
//      ========================= */
//   document.addEventListener('contextmenu', e => {
//     if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
//       e.preventDefault();
//     }
//   });

//   document.addEventListener('dragstart', e => e.preventDefault());
// });

// gallery.js — category + media filtering + image/video lightbox (FINAL)

document.addEventListener("DOMContentLoaded", () => {
  const items = Array.from(document.querySelectorAll(".gallery-item"));

  /* =========================
     CATEGORY FILTER
     ========================= */
  const categoryBtns = document.querySelectorAll(".filter-btn");
  let activeCategory = "all";

  function applyFilters() {
    items.forEach((item) => {
      const itemCategory = item.dataset.category;
      const itemType = item.dataset.type;

      const categoryMatch =
        activeCategory === "all" || itemCategory === activeCategory;
      const mediaMatch = activeMedia === "all" || itemType === activeMedia;

      item.style.display = categoryMatch && mediaMatch ? "block" : "none";
    });
  }

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.filter;
      applyFilters();
    });
  });

  /* =========================
     MEDIA FILTER (Images / Videos)
     ========================= */
  const mediaBtns = document.querySelectorAll(".media-btn");
  let activeMedia = "all";

  mediaBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      mediaBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeMedia = btn.dataset.media;
      applyFilters();
    });
  });

  /* =========================
     LIGHTBOX ELEMENTS
     ========================= */
  const lb = document.getElementById("mediaLightbox");
  const lbImage = document.getElementById("lbImage");
  const lbVideo = document.getElementById("lbVideo");
  const lbPlay = document.getElementById("lbPlay");
  const lbProgress = document.getElementById("lbProgress");
  const lbFullscreen = document.getElementById("lbFullscreen");
  const lbClose = document.querySelector(".lb-close");

  const zoomInBtn = document.getElementById("imgZoomIn");
  const zoomOutBtn = document.getElementById("imgZoomOut");

  let zoomLevel = 1;

  /* =========================
     UTIL
     ========================= */
  function pauseAllVideos(except = null) {
    document.querySelectorAll("video").forEach((v) => {
      if (v !== except) {
        try {
          v.pause();
        } catch (e) {}
      }
    });
  }

  /* =========================
     GRID VIDEO CONTROLS
     ========================= */
  items.forEach((item) => {
    const playBtn = item.querySelector(".play-pause");
    const progress = item.querySelector(".progress-bar");
    const video = item.querySelector("video");

    if (playBtn && video) {
      playBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (video.paused) {
          pauseAllVideos(video);
          video.play();
          playBtn.textContent = "⏸";
        } else {
          video.pause();
          playBtn.textContent = "▶";
        }
      });

      video.addEventListener("timeupdate", () => {
        if (progress && video.duration) {
          progress.value = (video.currentTime / video.duration) * 100;
        }
      });

      video.addEventListener("ended", () => {
        playBtn.textContent = "▶";
      });
    }
  });

  /* =========================
     OPEN LIGHTBOX
     ========================= */
  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (e.target.closest(".inline-controls")) return;

      const type = item.dataset.type;
      const src = item.dataset.src;

      lb.classList.remove("hidden", "image-mode", "video-mode");
      document.body.classList.add("lightbox-open");

      pauseAllVideos();

      if (type === "image") {
        // IMAGE MODE
        lb.classList.add("image-mode");

        lbVideo.pause();
        lbVideo.style.display = "none";

        zoomLevel = 1;
        lbImage.style.transform = "scale(1)";
        lbImage.src = src;
        lbImage.style.display = "block";
      } else {
        // VIDEO MODE
        lb.classList.add("video-mode");

        lbImage.style.display = "none";

        lbVideo.src = src;
        lbVideo.currentTime = 0;
        lbVideo.style.display = "block";
        lbVideo.pause();
        lbPlay.textContent = "▶";
        lbProgress.value = 0;
      }
    });
  });

  /* =========================
     IMAGE ZOOM CONTROLS
     ========================= */
  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      zoomLevel += 0.2;
      lbImage.style.transform = `scale(${zoomLevel})`;
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      zoomLevel = Math.max(1, zoomLevel - 0.2);
      lbImage.style.transform = `scale(${zoomLevel})`;
    });
  }

  /* =========================
     VIDEO CONTROLS (LIGHTBOX)
     ========================= */
  lbPlay.addEventListener("click", () => {
    if (lbVideo.paused) {
      pauseAllVideos(lbVideo);
      lbVideo.play();
      lbPlay.textContent = "⏸";
    } else {
      lbVideo.pause();
      lbPlay.textContent = "▶";
    }
  });

  lbVideo.addEventListener("timeupdate", () => {
    if (lbVideo.duration) {
      lbProgress.value = (lbVideo.currentTime / lbVideo.duration) * 100;
    }
  });

  lbFullscreen.addEventListener("click", () => {
    const fs =
      lbVideo.requestFullscreen ||
      lbVideo.webkitRequestFullscreen ||
      lbVideo.webkitEnterFullscreen;
    if (fs) fs.call(lbVideo);
  });

  /* =========================
     CLOSE LIGHTBOX
     ========================= */
  function closeLightbox() {
    lb.classList.add("hidden");
    document.body.classList.remove("lightbox-open");

    lbVideo.pause();
    lbVideo.src = "";
    lbImage.src = "";
  }

  lbClose.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });

  /* =========================
     BASIC DOWNLOAD DETERRENT
     ========================= */
  document.addEventListener("contextmenu", (e) => {
    if (e.target.tagName === "IMG" || e.target.tagName === "VIDEO") {
      e.preventDefault();
    }
  });

  document.addEventListener("dragstart", (e) => e.preventDefault());

  // initial
  applyFilters();
});

/* =========================
   MOBILE IMAGE ZOOM
   ========================= */
let lastTap = 0;

lbImage.addEventListener("touchend", (e) => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;

  if (tapLength < 300 && tapLength > 0) {
    // Double tap
    zoomLevel = zoomLevel === 1 ? 2 : 1;
    lbImage.style.transform = `scale(${zoomLevel})`;
  }

  lastTap = currentTime;
});
