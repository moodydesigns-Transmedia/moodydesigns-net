(function() {
  // -------------------------------------------------------------
  // 0. Performance Optimizations (Preconnect & Resource Hints)
  // -------------------------------------------------------------
  const preconnectUrls = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
  preconnectUrls.forEach(url => {
    let link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    if (url.includes('gstatic')) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // -------------------------------------------------------------
  // 1. Force Scroll to Top on Page Load
  // -------------------------------------------------------------
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  window.addEventListener('load', () => window.scrollTo(0, 0));

  // -------------------------------------------------------------
  // 2. Moody Audio Engine
  // -------------------------------------------------------------
    class MoodyAudioEngine {
        constructor() {
            this.muted = false;
            try {
                this.hoverEnter = new Audio('Audio/m_HoverEnter.wav');
                this.click = new Audio('Audio/m_Click.wav');
            } catch(e) {
                console.warn('Audio initialization deferred:', e);
            }
        }
        
        play(audioObj) {
            if (this.muted || !audioObj) return;
            try {
                audioObj.currentTime = 0;
                const promise = audioObj.play();
                if (promise !== undefined) {
                    promise.catch(() => {});
                }
            } catch(err) {}
        }

        hoverTone() { this.play(this.hoverEnter); }
        hoverOutTone() { /* Hover exit sound disabled */ }
        clickTone() { this.play(this.click); }
        
        toggleMute() {
            this.muted = !this.muted;
            return !this.muted;
        }
    }
    const sfx = new MoodyAudioEngine();

  // -------------------------------------------------------------
  // 3. Spaces & Meta-Civilizations Data (DeepVoid Sovereign Sectors)
  // -------------------------------------------------------------
  const MOODY_SPACES = [
    { title: "New Alexandria Citadel", path: "egypt-2222.html", tag: "Post-Cataclysm", available: true },
    { title: "Giza 2030", path: "egypt-2030.html", tag: "Abundance Engine", available: true },
    { title: "Abyssal Cathedral", path: "palace-of-solitude-11111.html", tag: "Abyssal Stage", available: true },
    { title: "Cherry Blossom", path: "escape-island.html", tag: "Encrypted Node", available: true },
    { title: "The Bamboo Sanctuaries", path: "bali-2111.html", tag: "World Sector A", available: true },
    { title: "The P-AB Habitat", path: "egypt-2030.html", tag: "Abundance Engine", available: false },
    { title: "The Moloch Wastes", path: "cyber-kings-2055.html", tag: "Sector 11 Arena", available: false },
    { title: "The Sovereign Refuge", path: "escape-island.html", tag: "Encrypted Node", available: false },
    { title: "The Genesis Vault", path: "egypt-genesis-11111.html", tag: "Vantablack Room", available: false },
    { title: "Archive of the Ancients", path: "cleopatras-tomb-55.html", tag: "Volumetric History", available: false },
    { title: "Founders Cathedral", path: "palace-of-solitude-11111.html", tag: "Abyssal Stage", available: false },
    { title: "The Mother Fish Submarine", path: "intergalactic-ship.html", tag: "Hadal Flagship", available: false },
    { title: "Sovereign Asset Forge", path: "meta-mall.html", tag: "Procedural Tech Art", available: false },
    { title: "Crossverse Command Center", path: "metaverse-lab.html", tag: "AirGlass Sandbox", available: false },
    { title: "Supported Architectures", path: "supported-platforms.html", tag: "Unity DOTS / WebGPU", available: false }
  ];

  function buildSpacesMenuContent(currentUrl) {
    const headerHtml = `
      <div style="padding: 8px 14px; font-size: 10px; font-weight: 700; color: #f7931e; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid rgba(255,255,255,0.06);">
        DeepVoid Sovereign Sectors
      </div>
    `;
    const itemsHtml = MOODY_SPACES.map(s => {
      const active = currentUrl.includes(s.path.replace('.html', '')) ? 'active' : '';
      if (s.available) {
        return `
          <a href="${s.path}" class="moody-dropdown-item ${active}">
            <span>${s.title}</span>
            <span class="badge badge-available">available</span>
          </a>
        `;
      } else {
        return `
          <div class="moody-dropdown-item disabled" style="pointer-events: none !important; opacity: 0.55; cursor: not-allowed;">
            <span style="color: #94a3b8;">${s.title}</span>
            <span class="badge badge-coming-soon">coming soon</span>
          </div>
        `;
      }
    }).join('');

    return headerHtml + itemsHtml;
  }

  // -------------------------------------------------------------
  // 4. UI Construction & Floating Centered Navigation
  // -------------------------------------------------------------
  function setupMoodyUI() {
    let progressBar = document.getElementById('metaverse-scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'metaverse-scroll-progress';
      document.body.appendChild(progressBar);
    }

    const currentUrl = window.location.pathname.replace(/^\//, '') || 'index.html';
    const isHomePage = currentUrl === 'index.html' || currentUrl === '';

    let nav = document.getElementById('moody-floating-navbar');
    
    if (!nav) {
      nav = document.createElement('nav');
      nav.id = 'moody-floating-navbar';
      nav.setAttribute('aria-label', 'Main Navigation');

      const isPortfolioActive = currentUrl.includes('metaverse-portfolio');
      const isServicesActive = currentUrl.includes('metaverse-services');
      const isInvestorsActive = currentUrl.includes('investors');
      const isSpaceActive = MOODY_SPACES.some(s => currentUrl.includes(s.path.replace('.html', '')));

      // Sovereign Widget source button exists ONLY on active portfolio sector pages with data to pull from
      const hasSovereignSource = MOODY_SPACES.some(s => s.available && currentUrl.toLowerCase().includes(s.path.toLowerCase().replace('.html', '')));


      let spacesDropdownHtml = buildSpacesMenuContent(currentUrl);

      let logoHtml = '';
      if (!isHomePage) {
        logoHtml = `
          <a href="index.html" title="DeepVoid Saga Sovereign Universe" style="display:flex; align-items:center; margin-right: 10px;">
            <img src="images/moody-design-logo-1.png" alt="Moody Designs Logo" style="height: 28px; width: auto; object-fit: contain; filter: drop-shadow(0 0 5px rgba(247,147,30,0.5));">
          </a>
        `;
      }
      
      let homeButtonHtml = `
        <a href="home.html" class="moody-nav-home" title="DeepVoid Saga Home">
          <svg viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z"/>
          </svg>
        </a>
      `;

      nav.innerHTML = `
        ${logoHtml}
        ${homeButtonHtml}
        <a href="metaverse-portfolio.html" class="moody-nav-pill ${isPortfolioActive ? 'active' : ''}">
          <span class="dot">●</span>
          <span>Portfolio</span>
        </a>
        <div class="moody-dropdown-wrap">
          <button class="moody-nav-pill ${isSpaceActive ? 'active' : ''}" id="moody-spaces-btn" aria-haspopup="true" aria-expanded="false">
            <span class="dot">●</span>
            <span>Sovereign Spaces</span>
            <span style="font-size: 9px; opacity: 0.7; margin-left: 2px;">▼</span>
          </button>
          <div class="moody-dropdown-menu" id="moody-spaces-menu">
            ${spacesDropdownHtml}
          </div>
        </div>
        <a href="metaverse-services.html" class="moody-nav-pill ${isServicesActive ? 'active' : ''}">
          <span class="dot">●</span>
          <span>Our Services</span>
        </a>
        <a href="investors.html" class="moody-nav-pill ${isInvestorsActive ? 'active' : ''}">
          <span class="dot">●</span>
          <span>Distribution & Porting</span>
        </a>
        <a href="https://youtube.com/@Moodydesigns_Metaverse" target="_blank" rel="noopener noreferrer" class="moody-nav-pill">
          <span class="dot">●</span>
          <span>YouTube</span>
        </a>
        <a href="The_Moody.html" class="moody-nav-pill">
          <span class="dot">●</span>
          <span>About Moody</span>
        </a>
        <button class="moody-nav-icon-btn" id="moody-sound-toggle" title="Toggle Sound Feedback">
          <span>${sfx.muted ? '🔇' : '🔊'}</span>
        </button>
        ${hasSovereignSource ? `
        <button class="moody-nav-pill moody-nav-listen-btn" id="moody-nav-listen" title="Open Sovereign Widget Listen Mode" style="background: linear-gradient(135deg, #ff9900 0%, #f77a00 100%); color: #000000; font-weight: 800; border: none; display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 9999px; cursor: pointer; box-shadow: 0 2px 12px rgba(255,153,0,0.5);">
          <span style="font-size: 14px;">🔊</span>
          <span>Listen &amp; Watch</span>
        </button>
        <button class="moody-nav-icon-btn" id="moody-ai-talk-btn" title="Talk to AI (Speech-to-Speech Integration Placeholder)" style="background: rgba(247, 147, 30, 0.15); border: 1px solid rgba(247, 147, 30, 0.4); display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; cursor: pointer;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f7931e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </button>
        ` : ''}
      `;
      document.body.prepend(nav);
      // Initialize state for fade-in
      nav.style.setProperty('opacity', '0', 'important');
      nav.style.setProperty('visibility', 'hidden', 'important');
      nav.style.setProperty('transition', 'opacity 0.5s ease', 'important');
    }

    // Attach Listen & Watch button handler if SovereignOverlay is available
    const navListenBtn = document.getElementById('moody-nav-listen');
    if (navListenBtn) {
      navListenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sfx.clickTone();
        if (window.SovereignOverlay && typeof window.SovereignOverlay.open === 'function') {
          window.SovereignOverlay.open();
        } else {
          // Fallback trigger by dispatching event or finding/creating root
          const existingRoot = document.getElementById('sovereign-root');
          if (existingRoot) {
            existingRoot.classList.add('is-active');
            const player = document.getElementById('sovereign-player');
            if (player) {
              player.style.display = 'flex';
              player.classList.add('player-active');
            }
          } else {
            // Re-run init or trigger gate entry
            window.location.reload();
          }
        }
      });
    }

    const aiTalkBtn = document.getElementById('moody-ai-talk-btn');
    if (aiTalkBtn) {
      aiTalkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sfx.clickTone();
        if (window.MoodyAIAgent && typeof window.MoodyAIAgent.open === 'function') {
          window.MoodyAIAgent.open();
        } else {
          console.log('Opening Moody AI...');
        }
      });
    }

    // Dropdown toggle logic
    const spacesBtn = document.getElementById('moody-spaces-btn');
    const spacesMenu = document.getElementById('moody-spaces-menu');
    if (spacesMenu) {
      spacesMenu.innerHTML = buildSpacesMenuContent(currentUrl);
    }
    if (spacesBtn && spacesMenu) {
      spacesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = spacesMenu.classList.contains('show');
        if (isOpen) {
          spacesMenu.classList.remove('show');
          spacesBtn.setAttribute('aria-expanded', 'false');
        } else {
          spacesMenu.classList.add('show');
          spacesBtn.setAttribute('aria-expanded', 'true');
          sfx.clickTone();
        }
      });
      spacesMenu.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', () => {
          spacesMenu.classList.remove('show');
          spacesBtn.setAttribute('aria-expanded', 'false');
        });
      });
      document.addEventListener('click', (e) => {
        if (!spacesBtn.contains(e.target) && !spacesMenu.contains(e.target)) {
          spacesMenu.classList.remove('show');
          spacesBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Sound toggle listener
    const soundToggle = document.getElementById('moody-sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        const unmuted = sfx.toggleMute();
        soundToggle.querySelector('span').textContent = unmuted ? '🔊' : '🔇';
      });
    }

    // Floating Navigation Visibility & Opacity Logic (Fades in at 150px)
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (nav) {
            // Calculate opacity: 0 at top, 1 at 150px scroll
            const opacity = Math.min(Math.max(winScroll / 150, 0), 1);
            nav.style.setProperty('opacity', opacity, 'important');
            nav.style.setProperty('visibility', opacity > 0 ? 'visible' : 'hidden', 'important');
        }
    });

    // Ensure initial state is hidden
    if (nav) {
        nav.style.setProperty('opacity', '0', 'important');
        nav.style.setProperty('visibility', 'hidden', 'important');
    }

    // 8. End-of-Page Footer Card
    function setupFooterCard() {
        window.addEventListener('scroll', () => {
            const bottomReached = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50;
            let card = document.getElementById('moody-footer-card');
            
            if (bottomReached && !card) {
                card = document.createElement('div');
                card.id = 'moody-footer-card';
                card.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    z-index: 10000;
                    padding: 20px;
                    background: #000;
                    border: 2px solid #f7931e;
                    border-radius: 10px;
                    color: #fff;
                    text-align: center;
                    box-shadow: 0 0 20px rgba(247,147,30,0.5);
                    cursor: pointer;
                `;
                card.innerHTML = `
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#f7931e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                        <circle cx="12" cy="8" r="3"/>
                        <path d="M6 15h12"/>
                        <path d="M6 18h8"/>
                    </svg>
                    <p style="margin: 10px 0 0; font-family: sans-serif; font-weight: 700;">Explore Personal Resume</p>
                `;
                card.addEventListener('click', () => {
                    window.location.href = 'The_Moody.html';
                });
                document.body.appendChild(card);
            } else if (!bottomReached && card) {
                card.remove();
            }
        });
    }
    if (!currentUrl.toLowerCase().includes('the_moody')) {
        setupFooterCard();
    }

    // 6. Interactive Sounds for Links & Sovereign Handshake
    function attachSoundEffects() {
        const interactiveSelector = [
            'a[href]',
            '.moody-nav-home',
            '.moody-nav-pill',
            '.moody-dropdown-item',
            '.moody-nav-icon-btn',
            '.moody-clickable-image',
            '.moody-clickable-image-wrap',
            'button',
            '.sovereign-btn-listen',
            '.sovereign-btn-scroll',
            '.sovereign-choice-icon',
            '.player-btn-scroll-read',
            '.player-play-btn',
            '.player-progress-bar',
            '.img-nav',
            '.space-nav'
        ].join(', ');
        const allInteractive = document.querySelectorAll(interactiveSelector);
        allInteractive.forEach(el => {
            if (el.dataset.hasSfx) return;
            el.dataset.hasSfx = 'true';
            el.addEventListener('mouseenter', () => sfx.hoverTone());
            el.addEventListener('click', () => sfx.clickTone());
        });
    }
    attachSoundEffects();
    setInterval(attachSoundEffects, 1000);

    // 7. Lightbox for Space Preview Images
    function closeLightbox() {
        const lb = document.getElementById('moody-lightbox');
        if (lb) {
            lb.classList.remove('open');
            sfx.clickTone();
        }
    }

    function createLightbox() {
        let lb = document.getElementById('moody-lightbox');
        if (!lb) {
            lb = document.createElement('div');
            lb.id = 'moody-lightbox';
            lb.innerHTML = `
              <div class="moody-lightbox-overlay"></div>
              <div class="moody-lightbox-content">
                <button class="moody-lightbox-close" aria-label="Close Lightbox">&times;</button>
                <img class="moody-lightbox-img" src="" alt="">
                <div class="moody-lightbox-desc"></div>
              </div>
            `;
            document.body.appendChild(lb);
        }
        const closeBtn = lb.querySelector('.moody-lightbox-close');
        if (closeBtn && !closeBtn.dataset.hasCloseHandler) {
            closeBtn.dataset.hasCloseHandler = 'true';
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeLightbox();
            });
        }
        const overlay = lb.querySelector('.moody-lightbox-overlay');
        if (overlay && !overlay.dataset.hasCloseHandler) {
            overlay.dataset.hasCloseHandler = 'true';
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeLightbox();
            });
        }
        return lb;
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.moody-lightbox-close') || e.target.classList.contains('moody-lightbox-overlay')) {
            e.preventDefault();
            e.stopPropagation();
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    function openLightbox(src, title) {
        const lb = createLightbox();
        const imgEl = lb.querySelector('.moody-lightbox-img');
        const descEl = lb.querySelector('.moody-lightbox-desc');
        imgEl.src = src;
        imgEl.alt = title;
        descEl.textContent = title;
        lb.classList.add('open');
    }

    function isMoodiAvatarOrSpaceRender(src) {
      if (!src) return false;
      const s = src.toLowerCase();
      const file = s.split('/').pop().split('?')[0];

      if (s.endsWith('.svg') || s.endsWith('.gif')) return false;
      if (s.includes('spark') || s.includes('flare') || s.includes('ambient') || 
          s.includes('texture') || s.includes('lighting') || s.includes('tech-bg') ||
          s.includes('blur-bg') || s.includes('desk-bg') || s.includes('logo') || 
          s.includes('icon') || s.includes('flag') || s.includes('badge') || 
          s.includes('sdg-') || s.includes('un-sustainable') || s.includes('frame') || 
          s.includes('arrow-down') || s.includes('coming-soon') || s.includes('made-with-unity') || 
          s.includes('supported-platforms') || s.includes('portal') || s.includes('window') ||
          file === 'egypt-2030.png' || file === 'idea-book.png' || file === 'collab-image.png' ||
          file === 'ufo.png' || file === 'panda.png') {
        return false;
      }

      if (s.includes('the-moody') || s.includes('the_moody') || s.includes('moody-avatar')) {
        return true;
      }

      if (s.includes('palace') || s.includes('cleopatra') || s.includes('cyber-kings') ||
          s.includes('egypt-2030-') || s.includes('egypt-2222') || s.includes('genesis-') ||
          s.includes('escape-island-') || s.includes('intergalactic-ship-') || s.includes('meta-mall-') ||
          s.includes('meta-lab-') || s.includes('metaverse-bali-') || s.includes('metaverse-lab') ||
          s.includes('metaverse-portfolio') || s.includes('metaverse-services') || 
          s.includes('temple-architecture') || s.includes('ancient-egypt') || s.includes('ancient_egypt') ||
          s.includes('bali') || s.includes('collab')) {
        return true;
      }
      
      if (s.includes('investors-banner') || (s.includes('home_bg') && !s.includes('bali') && !s.includes('collab'))) {
        return false;
      }

      return false;
    }

    function formatImageTitle(src, fallbackAlt) {
      const s = src.toLowerCase();
      
      if (s.includes('the-moody-old') || s.includes('the-moody-young')) {
        const type = s.includes('old') ? 'Old' : 'Young';
        return `The Moody (A. Adel Hosny) Real-Life Photo — ${type}`;
      }
      
      if (s.includes('the-moody') || s.includes('moody-avatar')) {
        return 'Moody 3D Render';
      }

      if (s.includes('palace')) return 'Palace of Solitude 3D Render';
      if (s.includes('cleopatra')) return "Cleopatra's Tomb 3D Render";
      if (s.includes('cyber-kings')) return 'Cyber Kings 2055 3D Render';
      if (s.includes('egypt-2030')) return 'Egypt 2030 3D Render';
      if (s.includes('egypt-2222')) return 'Egypt 2222 3D Render';
      if (s.includes('genesis')) return 'Egypt Genesis 11111 3D Render';
      if (s.includes('escape-island')) return 'Escape Island 3D Render';
      if (s.includes('intergalactic-ship')) return 'Intergalactic Ship 3D Render';
      if (s.includes('meta-mall')) return 'Meta Mall 3D Render';
      if (s.includes('meta-lab') || s.includes('metaverse-lab')) return 'Metaverse Lab 3D Render';
      if (s.includes('metaverse-bali')) return 'Bali 2111 3D Render';
      if (s.includes('ancient-egypt') || s.includes('ancient_egypt')) return 'Ancient Egypt 3D Render';
      return fallbackAlt && fallbackAlt !== 'Moodydesigns' ? fallbackAlt : 'Moody Designs 3D Render';
    }

    function setupLightboxHandlers() {
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            if (img.closest('#sovereign-root') || img.closest('#moody-lightbox')) return;
            const src = (img.getAttribute('src') || '').trim();
            if (!src || !isMoodiAvatarOrSpaceRender(src)) {
              return;
            }
            
            let bestSrc = src;
            const srcset = img.getAttribute('srcset');
            if (srcset) {
              const parts = srcset.split(',').map(s => s.trim());
              if (parts.length > 0) {
                const lastPart = parts[parts.length - 1].split(' ')[0];
                if (lastPart) bestSrc = lastPart;
              }
            }

            const rawAlt = img.getAttribute('alt') || '';
            const displayTitle = formatImageTitle(src, rawAlt);

            img.classList.add('moody-clickable-image');
            img.dataset.bestSrc = bestSrc;
            img.dataset.displayTitle = displayTitle;
            img.setAttribute('alt', displayTitle);
            img.setAttribute('loading', 'lazy');
            img.style.cursor = 'pointer';
            img.style.pointerEvents = 'auto';

            // Also mark parent container as clickable
            const parent = img.parentElement;
            if (parent && !parent.classList.contains('moody-clickable-image-wrap')) {
              parent.classList.add('moody-clickable-image-wrap');
              parent.style.cursor = 'pointer';
              parent.style.pointerEvents = 'auto';
            }

            if (img.dataset.hasLbHandler) return;
            img.dataset.hasLbHandler = 'true';

            const handleImageClick = (e) => {
              const parentLink = img.closest('a');
              if (parentLink && parentLink.getAttribute('href') && !parentLink.getAttribute('href').startsWith('#') && !parentLink.classList.contains('lightbox-link')) {
                return;
              }
              e.preventDefault();
              e.stopPropagation();
              sfx.clickTone();
              openLightbox(bestSrc, displayTitle);
            };

            img.addEventListener('mouseenter', () => sfx.hoverTone());
            img.addEventListener('mouseleave', () => sfx.hoverOutTone());
            img.addEventListener('click', handleImageClick);
        });
    }

    // Delegated click listener for portfolio images and their wrapper frames
    document.addEventListener('click', (e) => {
      if (e.target.closest('#moody-lightbox') || e.target.closest('#sovereign-root') || e.target.closest('#moody-floating-nav')) return;

      const img = e.target.closest('img.moody-clickable-image') || 
                  e.target.closest('.moody-clickable-image-wrap')?.querySelector('img.moody-clickable-image');
      if (!img) return;

      const parentLink = img.closest('a');
      if (parentLink && parentLink.getAttribute('href') && !parentLink.getAttribute('href').startsWith('#') && !parentLink.classList.contains('lightbox-link')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      sfx.clickTone();
      const bestSrc = img.dataset.bestSrc || img.getAttribute('src');
      const title = img.dataset.displayTitle || img.getAttribute('alt') || 'Bali 2111 3D Render';
      openLightbox(bestSrc, title);
    });

    setupLightboxHandlers();
    setInterval(setupLightboxHandlers, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMoodyUI);
  } else {
    setupMoodyUI();
  }
})();