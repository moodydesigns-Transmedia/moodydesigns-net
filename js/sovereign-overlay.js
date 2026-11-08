/**
 * ==========================================================================
 * MOODYDESIGNS SOVEREIGN OVERLAY WIDGET — CORE ENGINE
 * Version: 1.0 (Static HTML Overlay, Zero-GC Architecture)
 * Author: Moody & Aura — www.moodydesigns.net
 * Target: Zero GC churn, zero page reload, FLIP morphing player
 * ==========================================================================
 */

(function () {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. STATE & CONSTANTS
  // ------------------------------------------------------------------------
  const STATES = {
    IDLE: 'IDLE',
    GATE_ANIMATING: 'GATE_ANIMATING',
    GATE_CHOICE: 'GATE_CHOICE',
    CLOSING: 'CLOSING',
    MORPHING: 'MORPHING',
    PLAYER_READY: 'PLAYER_READY',
    PLAYER_PLAYING: 'PLAYER_PLAYING',
    PLAYER_PAUSED: 'PLAYER_PAUSED',
    SPACE_LOADING: 'SPACE_LOADING'
  };

  let currentState = STATES.IDLE;
  let sectorList = [
    'new-alexandria',
    'giza 2030',
    'abyssal-cathedral',
    'cherry-blossom',
    'bali-2111'
  ];
  let currentSpaceIndex = 0;
  let currentImageIndex = 0;
  let currentManifest = null;
  let isDraggingProgress = false;
  let progressRafId = null;
  let lastTimeUpdate = 0;
  let shuffleTimer = null;
  let shuffleIntervalMs = 10000; // Default 10 seconds per image
  let isShufflePaused = false;

  // Paths
  const BASE_SECTOR_PATH = '/assets/sectors';
  const UI_IMAGES_PATH = '/assets/sectors/bali-2111/UI-Images';

  function encodePath(path) {
    if (!path) return '';
    const parts = path.split('/');
    const filename = parts.pop();
    return [...parts, encodeURIComponent(filename)].join('/');
  }

  function getSectorAssetUrl(sectorId, subpath) {
    const encSector = encodeURIComponent(sectorId);
    if (!subpath) return `${BASE_SECTOR_PATH}/${encSector}`;
    return `${BASE_SECTOR_PATH}/${encSector}/${encodePath(subpath)}`;
  }

  // ------------------------------------------------------------------------
  // 2. ZERO-ALLOCATION RESOURCE POOLS
  // ------------------------------------------------------------------------
  // Image pool: 3 <img> elements pre-allocated in DOM
  // [0] = visible, [1] = next, [2] = previous
  const imagePool = [null, null, null];
  let visiblePoolIdx = 0;

  // Audio pool: single HTMLAudioElement reused for entire lifetime
  const audioPool = new Audio();
  audioPool.preload = 'auto';
  audioPool.crossOrigin = 'anonymous';

  // Cached DOM references
  const els = {};

  // ------------------------------------------------------------------------
  // 3. DOM INJECTION (GATE + PLAYER)
  // ------------------------------------------------------------------------
  function createDOM() {
    // Top-level container
    const container = document.createElement('div');
    container.id = 'sovereign-root';
    container.className = 'is-active'; // Activate interactive state
    container.innerHTML = `
      <!-- GATE MODAL (WHAT DO YOU PREFER?) -->
      <div id="sovereign-gate" role="dialog" aria-modal="true" aria-label="Experience Selector">
        <!-- Flanking Character: Moody (Behind Modal) -->
        <img id="moody-gate" class="sovereign-character" src="${UI_IMAGES_PATH}/moody_listen.png" alt="Moody listening to DeepVoid audio" loading="eager" />

        <div class="sovereign-modal" id="sovereign-modal">
          <!-- Modal Title -->
          <h2 class="sovereign-modal-title">WHAT DO <span class="accent-you">YOU</span> PREFER?</h2>

          <!-- Choice Grid -->
          <div class="sovereign-modal-grid">
            <!-- Left: Listen & Watch -->
            <div class="sovereign-choice-col">
              <img class="sovereign-choice-icon" id="gate-icon-listen" src="${UI_IMAGES_PATH}/icon_listen.svg" onerror="this.onerror=null;this.src='${UI_IMAGES_PATH}/icon_listen.png';" alt="Listen and Watch Icon" />
              <button class="sovereign-btn-listen" id="gate-listen-btn" type="button" aria-label="Listen and Watch Metaverse Experience">
                <span class="icon">🔊</span>
                <span>Listen &amp; Watch</span>
              </button>
            </div>

            <!-- Right: Scroll & Read -->
            <div class="sovereign-choice-col">
              <img class="sovereign-choice-icon" id="gate-icon-scroll" src="${UI_IMAGES_PATH}/scroll_read.svg" onerror="this.onerror=null;this.src='${UI_IMAGES_PATH}/scroll_read.png';" alt="Scroll and Read Icon" />
              <button class="sovereign-btn-scroll" id="gate-scroll-btn" type="button" aria-label="Scroll and Read Static Site">
                <span>Scroll &amp; Read</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
          
          <a href="home.html" style="margin-top: 30px; padding: 12px 30px; border-radius: 9999px; background: #ff9900; color: #000; font-weight: 800; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; font-size: 14px; box-shadow: 0 4px 12px rgba(255,153,0,0.4);">Home Page</a>
        </div>

        <!-- Flanking Character: Aura (Behind Modal) -->
        <img id="aura-gate" class="sovereign-character" src="${UI_IMAGES_PATH}/aura_scroll.png" alt="Aura browsing DeepVoid archives" loading="eager" />
      </div>

      <!-- FULLSCREEN CURVED PLAYER -->
      <div id="sovereign-player" role="region" aria-label="Metaverse Slideshow and Audio Player" style="display: none;">
        <!-- Top Bar with Scroll & Read Escape Link and Shuffle Speed/Play HUD -->
        <div class="player-top-bar">
          <div class="player-top-controls">
            <a class="player-btn-scroll-read" id="player-scroll-read-link" href="bali-2111.html" title="Jump to Sector Static Article">
              <span>Scroll &amp; Read</span>
              <span>&#10558;</span>
            </a>
            <div class="player-shuffle-controls" id="player-shuffle-controls">
              <div class="shuffle-speed-row">
                <span class="shuffle-speed-label">Shuffle Speed:</span>
                <div class="shuffle-speed-pills">
                  <button class="shuffle-speed-pill active" id="speed-pill-10" type="button">10S</button>
                  <button class="shuffle-speed-pill" id="speed-pill-20" type="button">20S</button>
                </div>
              </div>
              <button class="shuffle-toggle-btn" id="shuffle-toggle-btn" type="button">
                <span class="shuffle-toggle-dot" id="shuffle-toggle-dot">●</span>
                <span id="shuffle-toggle-text">Shuffle Active</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Center Slideshow Viewport -->
        <div class="player-slideshow" id="player-slideshow">
          <!-- Image Pool (3 reused elements) -->
          <img class="slide-img active" id="slide-img-0" alt="Space visual slide 1" />
          <img class="slide-img" id="slide-img-1" alt="Space visual slide 2" />
          <img class="slide-img" id="slide-img-2" alt="Space visual slide 3" />

          <!-- Nav Arrows -->
          <button class="img-nav prev" id="img-nav-prev" type="button" aria-label="Previous Slide">&#10094;</button>
          <button class="img-nav next" id="img-nav-next" type="button" aria-label="Next Slide">&#10095;</button>
        </div>

        <!-- Bottom Player Control Bar -->
        <div class="player-bottom-bar">
          <!-- Moody Avatar Overlapping Bottom-Left -->
          <img class="player-moody-avatar" id="player-moody-avatar" src="${UI_IMAGES_PATH}/moody_listen.png" alt="Moody Avatar" />

          <!-- Play/Pause Button -->
          <button class="player-play-btn" id="player-play-btn" type="button" aria-label="Play or Pause">&#9654;</button>

          <!-- Middle Track Info & Progress Track -->
          <div class="player-center-track">
            <div class="player-meta-line">
              <span class="player-time-display" id="player-time-display">0:00:00 / 0:07:08</span>
              <span class="player-divider">|</span>
              <span class="player-title-display" id="player-title-display">The Bamboo Sanctuaries - (Sector A)</span>
            </div>
            <div class="player-progress-bar" id="player-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
              <div class="player-progress-fill" id="player-progress-fill"></div>
            </div>
          </div>

          <!-- Right Space Info & Space Navigation -->
          <div class="player-right-nav">
            <div class="player-space-info">
              <span class="player-listening-label">Listening to:</span>
              <span class="player-listening-to" id="player-listening-to">BALI 2111</span>
            </div>
            <div class="player-space-buttons">
              <button class="space-nav" id="space-nav-prev" type="button" aria-label="Previous Sector Space">Previous</button>
              <button class="space-nav" id="space-nav-next" type="button" aria-label="Next Sector Space">Next</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Cache elements
    els.root = container;
    els.gate = document.getElementById('sovereign-gate');
    els.modal = document.getElementById('sovereign-modal');
    els.moodyGate = document.getElementById('moody-gate');
    els.auraGate = document.getElementById('aura-gate');
    els.listenBtn = document.getElementById('gate-listen-btn');
    els.scrollBtn = document.getElementById('gate-scroll-btn');
    els.iconListen = document.getElementById('gate-icon-listen');
    els.iconScroll = document.getElementById('gate-icon-scroll');

    els.player = document.getElementById('sovereign-player');
    els.scrollReadLink = document.getElementById('player-scroll-read-link');
    els.playBtn = document.getElementById('player-play-btn');
    els.timeDisplay = document.getElementById('player-time-display');
    els.titleDisplay = document.getElementById('player-title-display');
    els.listeningTo = document.getElementById('player-listening-to');
    els.progressBar = document.getElementById('player-progress-bar');
    els.progressFill = document.getElementById('player-progress-fill');
    els.imgPrevBtn = document.getElementById('img-nav-prev');
    els.imgNextBtn = document.getElementById('img-nav-next');
    els.spacePrevBtn = document.getElementById('space-nav-prev');
    els.spaceNextBtn = document.getElementById('space-nav-next');

    imagePool[0] = document.getElementById('slide-img-0');
    imagePool[1] = document.getElementById('slide-img-1');
    imagePool[2] = document.getElementById('slide-img-2');
  }

  // ------------------------------------------------------------------------
  // 4. ANIMATION SEQUENCER (GATE ENTRY & MORPH)
  // ------------------------------------------------------------------------
  function runGateEntryAnimation() {
    currentState = STATES.GATE_ANIMATING;

    // 0ms: Fade backdrop in, scale modal from center
    requestAnimationFrame(() => {
      els.gate.classList.add('gate-visible');
      els.gate.classList.add('gate-animate-in');
    });

    // 100ms: Moody & Aura slide in from sides with bounce
    setTimeout(() => {
      els.gate.classList.add('gate-characters-in');
    }, 120);

    // 300ms: Choice elements & buttons fade in
    setTimeout(() => {
      els.gate.classList.add('gate-elements-in');
      currentState = STATES.GATE_CHOICE;
    }, 320);
  }

  // Full teardown and close widget
  function closeWidget() {
    if (currentState === STATES.CLOSING) return;
    currentState = STATES.CLOSING;
    pauseAudio();
    stopProgressLoop();
    stopShuffle();
    document.body.style.overflow = '';
    
    // If player loaded a sector different from current URL, navigate to its static HTML page
    const targetPage = currentManifest ? currentManifest.htmlPage : null;

    if (els.root) {
      els.root.classList.remove('is-active');
      if (els.gate) els.gate.classList.add('gate-closing');
      if (els.player) {
        els.player.classList.remove('player-active');
        els.player.style.display = 'none';
      }
      setTimeout(() => {
        if (els.root && els.root.parentNode) {
          els.root.parentNode.removeChild(els.root);
        }
        if (targetPage && !window.location.pathname.toLowerCase().includes(targetPage.toLowerCase())) {
          window.location.href = targetPage;
        }
      }, 350);
    } else {
      if (targetPage && !window.location.pathname.toLowerCase().includes(targetPage.toLowerCase())) {
        window.location.href = targetPage;
      }
    }
    currentState = STATES.IDLE;
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeWidget();
  });

  function closeGateToStaticSite() {
    closeWidget();
  }

  // FLIP Morph Animation (Gate Modal -> Fullscreen Curved Player)
  function morphGateToPlayer() {
    if (currentState === STATES.MORPHING || currentState === STATES.PLAYER_PLAYING || currentState === STATES.PLAYER_READY) return;
    currentState = STATES.MORPHING;
    document.body.style.overflow = 'hidden';

    // 1. Capture initial Gate Modal bounds
    const firstRect = els.modal.getBoundingClientRect();

    // Fade out flanking characters and gate buttons immediately
    els.moodyGate.style.opacity = '0';
    els.auraGate.style.opacity = '0';
    els.listenBtn.style.opacity = '0';
    els.scrollBtn.style.opacity = '0';

    // 2. Prepare target player bounds
    els.player.style.visibility = 'hidden';
    els.player.style.display = 'flex';
    els.player.classList.add('player-active');
    const lastRect = els.player.getBoundingClientRect();

    // 3. Calculate transform deltas using Bottom-Left pivot
    const deltaX = firstRect.left - lastRect.left;
    const deltaY = firstRect.bottom - lastRect.bottom;
    const scaleX = firstRect.width / lastRect.width;
    const scaleY = firstRect.height / lastRect.height;

    // Invert target player to modal position
    els.player.style.visibility = 'visible';
    els.player.style.transformOrigin = 'bottom left';
    els.player.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`;
    els.player.style.borderRadius = '18px';
    els.player.style.opacity = '1';

    // Fade out gate modal backdrop
    els.gate.style.transition = 'opacity 500ms ease';
    els.gate.style.opacity = '0';

    // 4. Animate to target state via FLIP (700ms, easeInOutQuart)
    requestAnimationFrame(() => {
      els.player.style.transition = 'transform 700ms cubic-bezier(0.77, 0, 0.175, 1), border-radius 700ms ease';
      els.player.style.transform = 'translate3d(0, 0, 0) scale(1, 1)';
      els.player.style.borderRadius = '16px';
    });

    // 5. Morph complete: clean up and enter PLAYER_READY
    setTimeout(() => {
      els.gate.style.display = 'none';
      els.player.style.transition = '';
      els.player.style.transform = '';
      currentState = STATES.PLAYER_READY;

      // Autoplay audio and start visual slideshow
      playAudio();
    }, 720);
  }

  // ------------------------------------------------------------------------
  // 5. ASYNC SECTOR LOADER (ZERO-ALLOCATION)
  // ------------------------------------------------------------------------
  const PAGE_SECTOR_MAP = {
    'egypt-2222': 'new-alexandria',
    'egypt-2030': 'giza 2030',
    'palace-of-solitude-11111': 'abyssal-cathedral',
    'escape-island': 'cherry-blossom',
    'bali-2111': 'bali-2111'
  };

  async function matchSectorToCurrentPage() {
    const currentUrl = (window.location.pathname + window.location.href).toLowerCase();
    for (const [pageKey, secId] of Object.entries(PAGE_SECTOR_MAP)) {
      if (currentUrl.includes(pageKey)) {
        const idx = sectorList.indexOf(secId);
        if (idx !== -1) currentSpaceIndex = idx;
        return secId;
      }
    }
    for (let i = 0; i < sectorList.length; i++) {
      const secId = sectorList[i];
      try {
        const manifestUrl = getSectorAssetUrl(secId, 'manifest.json');
        const res = await fetch(manifestUrl, { cache: 'force-cache' });
        if (res.ok) {
          const manifest = await res.json();
          const target = (manifest.htmlPage || '').toLowerCase().replace(/\.html$/, '');
          if (target && currentUrl.includes(target)) {
            currentSpaceIndex = i;
            return secId;
          }
        }
      } catch (e) {}
    }
    currentSpaceIndex = 0;
    return sectorList[0];
  }

  async function loadSector(sectorId) {
    if (!sectorId) return;
    currentState = STATES.SPACE_LOADING;
    if (els.player) els.player.classList.add('is-loading');

    const foundIdx = sectorList.indexOf(sectorId);
    if (foundIdx !== -1) currentSpaceIndex = foundIdx;

    const manifestUrl = getSectorAssetUrl(sectorId, 'manifest.json');

    try {
      const response = await fetch(manifestUrl, { cache: 'force-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status} loading ${manifestUrl}`);
      const manifest = await response.json();
      currentManifest = manifest;

      // Update UI metadata (DOM node text updates, zero recreation)
      if (els.titleDisplay) els.titleDisplay.textContent = manifest.displayName || sectorId;
      if (els.listeningTo) els.listeningTo.textContent = manifest.listeningTo || sectorId.toUpperCase();
      if (els.scrollReadLink) els.scrollReadLink.href = manifest.htmlPage || '#';

      // Push history state if htmlPage is provided
      if (window.history && window.history.pushState && manifest.htmlPage && !window.location.pathname.toLowerCase().includes(manifest.htmlPage.toLowerCase())) {
        window.history.pushState({ sectorId: manifest.id }, manifest.displayName, manifest.htmlPage);
      }

      // Reset slideshow index for new space
      currentImageIndex = 0;
      updateSlideshowView();

      // Preload & switch audio
      loadAudioForSector(sectorId, manifest.audioFile);

      currentState = STATES.PLAYER_PLAYING;
      resetShuffle();
    } catch (err) {
      console.warn('Failed to load sector manifest:', sectorId, err);
      if (els.titleDisplay) els.titleDisplay.textContent = sectorId.toUpperCase();
      if (els.listeningTo) els.listeningTo.textContent = sectorId.toUpperCase();
    } finally {
      if (els.player) els.player.classList.remove('is-loading');
    }
  }

  function loadAudioForSector(sectorId, audioFileName) {
    if (!audioFileName) return;
    const audioUrl = getSectorAssetUrl(sectorId, audioFileName);

    const wasPlaying = !audioPool.paused && audioPool.currentTime > 0;

    console.log('Loading audio for sector:', sectorId, audioUrl);
    audioPool.src = audioUrl;
    audioPool.load();

    audioPool.onloadeddata = () => {
      console.log('Audio successfully loaded and ready:', audioUrl);
    };
    audioPool.onerror = (e) => {
      console.error('Audio failed to load:', audioUrl, e);
      if (els.listeningTo) els.listeningTo.textContent = (currentManifest ? currentManifest.listeningTo : sectorId) + ' (AUDIO OFF)';
    };

    if (wasPlaying || currentState === STATES.PLAYER_READY || currentState === STATES.PLAYER_PLAYING) {
      playAudio();
    }
  }

  // ------------------------------------------------------------------------
  // 6. AUDIO CONTROLLER & PROGRESS RAF LOOP
  // ------------------------------------------------------------------------
  function playAudio() {
    const playPromise = audioPool.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          currentState = STATES.PLAYER_PLAYING;
          if (els.playBtn) {
            els.playBtn.innerHTML = '&#10074;&#10074;'; // Pause icon
            els.playBtn.setAttribute('aria-label', 'Pause Audio');
          }
          startProgressLoop();
          startShuffle();
        })
        .catch((err) => {
          console.log('Audio autoplay prevented or waiting for user interaction:', err);
          pauseAudio();
        });
    }
  }

  function pauseAudio() {
    audioPool.pause();
    currentState = STATES.PLAYER_PAUSED;
    if (els.playBtn) {
      els.playBtn.innerHTML = '&#9654;'; // Play icon
      els.playBtn.setAttribute('aria-label', 'Play Audio');
    }
    stopProgressLoop();
    stopShuffle();
  }

  function togglePlayPause() {
    if (audioPool.paused) {
      playAudio();
    } else {
      pauseAudio();
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const mStr = m < 10 ? '0' + m : m;
    const sStr = s < 10 ? '0' + s : s;
    return `${h}:${mStr}:${sStr}`;
  }

  function startProgressLoop() {
    if (progressRafId) cancelAnimationFrame(progressRafId);

    function tick(now) {
      if (currentState !== STATES.PLAYER_PLAYING) return;

      const duration = audioPool.duration || 428;
      const current = audioPool.currentTime;
      const pct = Math.min(100, Math.max(0, (current / duration) * 100));

      if (els.progressFill) els.progressFill.style.width = pct.toFixed(2) + '%';
      if (els.progressBar) els.progressBar.setAttribute('aria-valuenow', pct | 0);

      if (now - lastTimeUpdate > 200) {
        const curStr = formatTime(current);
        const durStr = formatTime(duration);
        if (els.timeDisplay) els.timeDisplay.textContent = `${curStr} / ${durStr}`;
        lastTimeUpdate = now;
      }

      progressRafId = requestAnimationFrame(tick);
    }

    progressRafId = requestAnimationFrame(tick);
  }

  function stopProgressLoop() {
    if (progressRafId) {
      cancelAnimationFrame(progressRafId);
      progressRafId = null;
    }
  }

  function seekProgress(e) {
    if (!els.progressBar) return;
    const rect = els.progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const duration = audioPool.duration || 428;
    audioPool.currentTime = ratio * duration;
    if (els.progressFill) els.progressFill.style.width = (ratio * 100).toFixed(2) + '%';
  }

  // ------------------------------------------------------------------------
  // 7. SLIDESHOW POOL CONTROLLER (ZERO DOM ALLOCATION)
  // ------------------------------------------------------------------------
  function updateSlideshowView() {
    if (!currentManifest || !currentManifest.images || currentManifest.images.length === 0) return;

    const sectorId = currentManifest.id;
    const images = currentManifest.images;
    const total = images.length;

    currentImageIndex = (currentImageIndex + total) % total;

    const curImgSrc = getSectorAssetUrl(sectorId, images[currentImageIndex]);
    console.log('Loading slide image:', curImgSrc);
    const nextImgSrc = getSectorAssetUrl(sectorId, images[(currentImageIndex + 1) % total]);

    const curElem = imagePool[visiblePoolIdx];
    visiblePoolIdx = (visiblePoolIdx + 1) % 3;
    const nextElem = imagePool[visiblePoolIdx];
    const idleElem = imagePool[(visiblePoolIdx + 1) % 3];

    if (nextElem && curElem) {
      nextElem.src = curImgSrc;
      nextElem.classList.add('active');
      curElem.classList.remove('active');
    }

    if (idleElem) {
      idleElem.src = nextImgSrc;
    }
  }

  function startShuffle() {
    stopShuffle();
    if (isShufflePaused) return;
    shuffleTimer = setInterval(() => {
      if ((currentState === STATES.PLAYER_PLAYING || currentState === STATES.PLAYER_READY) && !isShufflePaused) {
        nextSlide(true);
      }
    }, shuffleIntervalMs);
  }

  function stopShuffle() {
    if (shuffleTimer) {
      clearInterval(shuffleTimer);
      shuffleTimer = null;
    }
  }

  function resetShuffle() {
    if (currentState === STATES.PLAYER_PLAYING || currentState === STATES.PLAYER_READY) {
      startShuffle();
    }
  }

  function nextSlide(isAuto = false) {
    if (!currentManifest || !currentManifest.images || currentManifest.images.length === 0) return;
    currentImageIndex++;
    updateSlideshowView();
    if (!isAuto) resetShuffle();
  }

  function prevSlide(isAuto = false) {
    if (!currentManifest || !currentManifest.images || currentManifest.images.length === 0) return;
    currentImageIndex--;
    updateSlideshowView();
    if (!isAuto) resetShuffle();
  }

  // ------------------------------------------------------------------------
  // 8. SPACE NAVIGATION (NEXT / PREVIOUS SECTOR)
  // ------------------------------------------------------------------------
  function nextSpace() {
    if (sectorList.length === 0) return;
    currentSpaceIndex = (currentSpaceIndex + 1) % sectorList.length;
    console.log('Switching to Next Space:', currentSpaceIndex, sectorList[currentSpaceIndex]);
    loadSector(sectorList[currentSpaceIndex]);
  }

  function prevSpace() {
    if (sectorList.length === 0) return;
    currentSpaceIndex = (currentSpaceIndex - 1 + sectorList.length) % sectorList.length;
    console.log('Switching to Prev Space:', currentSpaceIndex, sectorList[currentSpaceIndex]);
    loadSector(sectorList[currentSpaceIndex]);
  }

  // ------------------------------------------------------------------------
  // 9. EVENT BINDINGS & KEYBOARD CONTROLS
  // ------------------------------------------------------------------------
  function bindEvents() {
    // Gate Buttons
    if (els.listenBtn) {
      els.listenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Listen & Watch button clicked');
        morphGateToPlayer();
      });
    }
    if (els.scrollBtn) {
      els.scrollBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Scroll & Read button clicked');
        closeGateToStaticSite();
      });
    }
    if (els.iconListen) {
      els.iconListen.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Listen icon clicked');
        morphGateToPlayer();
      });
    }
    if (els.iconScroll) {
      els.iconScroll.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Scroll icon clicked');
        closeGateToStaticSite();
      });
    }

    // Click on entire Choice Column for intuitive hit area
    const choiceCols = els.modal ? els.modal.querySelectorAll('.sovereign-choice-col') : [];
    if (choiceCols[0]) {
      choiceCols[0].addEventListener('click', (e) => {
        if (e.target.closest('#gate-listen-btn') || e.target.closest('#gate-icon-listen')) return;
        morphGateToPlayer();
      });
    }
    if (choiceCols[1]) {
      choiceCols[1].addEventListener('click', (e) => {
        if (e.target.closest('#gate-scroll-btn') || e.target.closest('#gate-icon-scroll')) return;
        closeGateToStaticSite();
      });
    }

    // Player Top Bar Scroll & Read Escape Link
    if (els.scrollReadLink) {
      els.scrollReadLink.addEventListener('click', (e) => {
        e.preventDefault();
        pauseAudio();
        closeWidget();
      });
    }

    // Shuffle Speed & Pause/Resume Bindings
    const speedPill10 = document.getElementById('speed-pill-10');
    const speedPill20 = document.getElementById('speed-pill-20');
    const shuffleToggleBtn = document.getElementById('shuffle-toggle-btn');
    const shuffleToggleDot = document.getElementById('shuffle-toggle-dot');
    const shuffleToggleText = document.getElementById('shuffle-toggle-text');

    if (speedPill10 && speedPill20) {
      speedPill10.addEventListener('click', () => {
        shuffleIntervalMs = 10000;
        speedPill10.classList.add('active');
        speedPill20.classList.remove('active');
        if (!isShufflePaused) startShuffle();
      });
      speedPill20.addEventListener('click', () => {
        shuffleIntervalMs = 20000;
        speedPill20.classList.add('active');
        speedPill10.classList.remove('active');
        if (!isShufflePaused) startShuffle();
      });
    }

    if (shuffleToggleBtn) {
      shuffleToggleBtn.addEventListener('click', () => {
        isShufflePaused = !isShufflePaused;
        if (isShufflePaused) {
          stopShuffle();
          shuffleToggleBtn.classList.add('is-paused');
          if (shuffleToggleText) shuffleToggleText.textContent = 'Shuffle Paused';
        } else {
          startShuffle();
          shuffleToggleBtn.classList.remove('is-paused');
          if (shuffleToggleText) shuffleToggleText.textContent = 'Shuffle Active';
        }
      });
    }

    // Player Play/Pause
    els.playBtn.addEventListener('click', () => togglePlayPause());

    // Progress Scrubber
    els.progressBar.addEventListener('click', (e) => seekProgress(e));
    els.progressBar.addEventListener('mousedown', () => { isDraggingProgress = true; });
    window.addEventListener('mouseup', () => { isDraggingProgress = false; });
    window.addEventListener('mousemove', (e) => {
      if (isDraggingProgress) seekProgress(e);
    });

    // Slideshow Nav
    els.imgPrevBtn.addEventListener('click', () => prevSlide());
    els.imgNextBtn.addEventListener('click', () => nextSlide());

    // Space Nav
    els.spacePrevBtn.addEventListener('click', () => prevSpace());
    els.spaceNextBtn.addEventListener('click', () => nextSpace());

    // Audio Event Handlers
    audioPool.addEventListener('ended', () => {
      // Loop or advance slide
      nextSlide();
      audioPool.currentTime = 0;
      playAudio();
    });

    audioPool.addEventListener('play', () => startProgressLoop());
    audioPool.addEventListener('pause', () => stopProgressLoop());

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // If typing in input or textarea, ignore
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

      switch (e.code) {
        case 'Space':
          if (currentState === STATES.PLAYER_PLAYING || currentState === STATES.PLAYER_PAUSED) {
            e.preventDefault();
            togglePlayPause();
          }
          break;
        case 'ArrowLeft':
          if (currentState === STATES.PLAYER_PLAYING || currentState === STATES.PLAYER_PAUSED) {
            e.preventDefault();
            prevSlide();
          }
          break;
        case 'ArrowRight':
          if (currentState === STATES.PLAYER_PLAYING || currentState === STATES.PLAYER_PAUSED) {
            e.preventDefault();
            nextSlide();
          }
          break;
        case 'KeyN':
          if (currentState === STATES.PLAYER_PLAYING || currentState === STATES.PLAYER_PAUSED) {
            nextSpace();
          }
          break;
        case 'KeyP':
          if (currentState === STATES.PLAYER_PLAYING || currentState === STATES.PLAYER_PAUSED) {
            prevSpace();
          }
          break;
        case 'Escape':
          if (currentState === STATES.GATE_CHOICE || currentState === STATES.GATE_ANIMATING) {
            closeWidget();
          } else if (currentState === STATES.PLAYER_PLAYING || currentState === STATES.PLAYER_PAUSED || currentState === STATES.PLAYER_READY) {
            pauseAudio();
            closeWidget();
          }
          break;
      }
    });

    // Touch Swipe Detection for Slideshow
    let touchStartX = 0;
    let touchStartY = 0;
    els.player.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    els.player.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0) prevSlide();
          else nextSlide();
        }
      }
    }, { passive: true });
  }

  // ------------------------------------------------------------------------
  // 10. INITIALIZATION
  // ------------------------------------------------------------------------
  async function init() {
    createDOM();
    document.body.style.overflow = 'hidden';
    bindEvents();

    // Fetch Global Sector Index
    try {
      const res = await fetch(`${BASE_SECTOR_PATH}/index.json`, { cache: 'force-cache' });
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          sectorList = list;
        }
      }
    } catch (e) {
      console.log('Using default sector index: [bali-2111]');
    }

    // Match sector ID to current page path
    const activeSecId = await matchSectorToCurrentPage();
    loadSector(activeSecId);

    // Trigger Gate Entry Animation
    runGateEntryAnimation();
  }

  // Global API Exposure
  window.SovereignOverlay = {
    open: function(secId) {
      const root = document.getElementById('sovereign-root');
      if (!root) {
        init();
      } else {
        root.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        if (secId) {
          const idx = sectorList.indexOf(secId);
          if (idx !== -1) currentSpaceIndex = idx;
          loadSector(secId);
        } else if (!currentManifest) {
          matchSectorToCurrentPage().then(id => loadSector(id));
        }
        if (els.player && (currentState === STATES.PLAYER_READY || currentState === STATES.PLAYER_PLAYING || currentState === STATES.PLAYER_PAUSED)) {
          els.player.style.display = 'flex';
          els.player.classList.add('player-active');
          playAudio();
        } else if (els.gate) {
          if (els.gate.style.display === 'none') {
            els.gate.style.display = 'flex';
            els.gate.style.opacity = '1';
          }
          runGateEntryAnimation();
        }
      }
    },
    close: closeWidget,
    loadSector: function(secId) {
      const idx = sectorList.indexOf(secId);
      if (idx !== -1) currentSpaceIndex = idx;
      loadSector(secId);
    }
  };

  let initDone = false;
  function runInit() {
    if (initDone) return;
    initDone = true;
    init();
  }

  if (document.readyState === 'complete') {
    runInit();
  } else {
    window.addEventListener('load', runInit);
    document.addEventListener('DOMContentLoaded', runInit);
  }
})();
