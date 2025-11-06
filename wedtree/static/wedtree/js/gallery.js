// gallery.js — controls gallery lightbox, video controls, filters, protections
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('galleryGrid');
  const items = Array.from(document.querySelectorAll('.gallery-item'));

  // FILTERING
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  function applyFilter(filter) {
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
    items.forEach(it => {
      const cat = it.dataset.category || 'other';
      it.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
    });
  }
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  // LIGHTBOX ELEMENTS
  const lb = document.getElementById('mediaLightbox');
  const lbImage = document.getElementById('lbImage');
  const lbVideo = document.getElementById('lbVideo');
  const lbTitle = document.getElementById('lbTitle');
  const lbCategory = document.getElementById('lbCategory');
  const lbPlay = document.getElementById('lbPlay');
  const lbProgress = document.getElementById('lbProgress');
  const lbFullscreen = document.getElementById('lbFullscreen');
  const lbClose = document.querySelector('.lb-close');

  // Utility: pause all playing videos on page except optional
  function pauseAllExcept(exceptVideo) {
    document.querySelectorAll('video').forEach(v => {
      if (v !== exceptVideo) {
        try { v.pause(); } catch(e){/*ignore*/ }
      }
    });
  }

  // Handle clicking items to open lightbox (but skip clicks on controls)
  items.forEach(item => {
    const mediaType = item.dataset.type;
    const src = item.dataset.src;
    const title = item.querySelector('.overlay-text h3')?.innerText || '';
    const category = item.querySelector('.overlay-text .cat')?.innerText || '';

    // inline control buttons
    const playBtn = item.querySelector('.play-pause');
    const fullscreenBtn = item.querySelector('.fullscreen');
    const inlineProgress = item.querySelector('.progress-bar');
    const videoEl = item.querySelector('video');

    // play/pause inline behavior (and pause others)
    if (playBtn && videoEl) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (videoEl.paused) {
          pauseAllExcept(videoEl);
          videoEl.play();
          playBtn.textContent = '⏸';
        } else {
          videoEl.pause();
          playBtn.textContent = '▶';
        }
      });

      // update inline progress
      videoEl.addEventListener('timeupdate', () => {
        if (inlineProgress && videoEl.duration) {
          inlineProgress.value = (videoEl.currentTime / videoEl.duration) * 100;
        }
      });

      videoEl.addEventListener('ended', () => {
        if (playBtn) playBtn.textContent = '▶';
      });
    }

    // fullscreen inline
    if (fullscreenBtn && videoEl) {
      fullscreenBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (videoEl.requestFullscreen) videoEl.requestFullscreen();
      });
    }

    // clicking the tile opens lightbox unless click was on control
    item.addEventListener('click', (ev) => {
      const clickedControl = ev.target.closest('.inline-controls') || ev.target.closest('.play-pause') || ev.target.closest('.fullscreen') || ev.target.closest('.btn');
      if (clickedControl) return;

      // open lightbox
      lb.classList.remove('hidden');
      lb.setAttribute('aria-hidden', 'false');
      lbTitle.textContent = title;
      lbCategory.textContent = category;

      if (mediaType === 'image') {
        lbVideo.style.display = 'none';
        lbVideo.pause && lbVideo.pause();
        lbImage.src = src;
        lbImage.style.display = 'block';
      } else if (mediaType === 'video') {
        lbImage.style.display = 'none';
        lbVideo.style.display = 'block';
        lbVideo.src = src;
        lbVideo.currentTime = 0;
        lbVideo.pause();
        lbProgress.value = 0;
      }
      pauseAllExcept(null);
    });
  });

  // Lightbox controls
  lbClose.addEventListener('click', closeLightbox);
  function closeLightbox(){
    lb.classList.add('hidden');
    lb.setAttribute('aria-hidden', 'true');
    lbVideo.pause();
    lbVideo.src = '';
    lbImage.src = '';
  }

  // LB Play/pause
  lbPlay.addEventListener('click', () => {
    if (lbVideo.style.display !== 'block') return;
    if (lbVideo.paused) {
      pauseAllExcept(lbVideo);
      lbVideo.play();
      lbPlay.textContent = '⏸';
    } else {
      lbVideo.pause();
      lbPlay.textContent = '▶';
    }
  });

  // LB progress update
  lbVideo.addEventListener('timeupdate', () => {
    if (lbVideo.duration) lbProgress.value = (lbVideo.currentTime / lbVideo.duration) * 100;
  });

  // LB fullscreen
  lbFullscreen.addEventListener('click', () => {
    if (lbVideo.requestFullscreen) lbVideo.requestFullscreen();
  });

  // close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // close when clicking backdrop
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  // Ensure only one video plays at a time (global)
  document.addEventListener('play', (e) => {
    if (e.target.tagName === 'VIDEO') {
      pauseAllExcept(e.target);
    }
  }, true);

  // DOWNLOAD PROTECTION
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    // block ctrl+s, ctrl+u, ctrl+shift+i
    if (e.ctrlKey && (e.key === 's' || e.key === 'u' || (e.shiftKey && e.key === 'I'))) e.preventDefault();
  });
  document.addEventListener('dragstart', e => e.preventDefault());
  // set attributes on media elements (in case browser shows download)
  document.querySelectorAll('img, video').forEach(m => {
    m.setAttribute('oncontextmenu', 'return false');
    m.setAttribute('draggable', 'false');
    if (m.tagName.toLowerCase() === 'video') {
      m.setAttribute('controlsList', 'nodownload nofullscreen noremoteplayback');
    }
  });

  // small safety: remove src attributes from images/videos when not visible (reduce direct links)
  // (keeps media visible in DOM but can help avoid accidental right-click -> open in new tab)
  function manageMediaSrcs() {
    // keep src as is; if you want extra protection, you could load via blob URLs from server-side proxy — out of scope here.
  }
  // initial filter state
  applyFilter('all');

});
