/**
 * ==========================================================================
 * MOODY DESIGNS — SOVEREIGN AI VOICE & CONVERSATIONAL INTELLIGENCE AGENT
 * Pure Voice-to-Voice Real-Time Conversational AI Overlay
 * Dual-Engine: Browser-Native Sovereign Intelligence + Gemini Live API Bridge
 * Author: Moody Designs Engine — www.moodydesigns.net
 * ==========================================================================
 */

(function () {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. EMBEDDED SOVEREIGN KNOWLEDGE VAULT
  // ------------------------------------------------------------------------
  const VAULT = {
    founder: {
      name: "Moody (A. Adel Hosny)",
      role: "Founder, Lead 3D Architect, Spatial Computing Developer",
      bio: "Moody (A. Adel Hosny) is the visionary founder and lead 3D architect behind Moody Designs and the DeepVoid Saga. He fuses thousands of years of ancient architectural wisdom with low-level mathematical optimization, real-time WebGPU shaders, Unity DOTS, and sovereign zero-server virtual environments."
    },
    sectors: {
      giza: "Giza 2030 A.C. is an Abundance Engine and sovereign financial stage set on the Giza Plateau. It synthesizes sacred golden-ratio geometry with high-density solar pyramids, cybernetic data vaults, and clean energy distribution. You can explore it directly on egypt-2030.html.",
      alexandria: "New Alexandria Citadel (Egypt 2222) is our sovereign post-cataclysm cyber sanctuary. Ancient obelisks are integrated into crystalline power conduits and volumetric emerald light canopies across egypt-2222.html.",
      bali: "The Bamboo Sanctuaries (Bali 2111) is World Sector A — an organic architectural haven woven from natural bamboo lattices, volumetric emerald canopies, and mirror-sea reflections on bali-2111.html.",
      escape: "The White Grove Basilica (Escape Island) is Sector E — an isolated sakura refuge surrounded by floating cherry blossoms, cyber-waterfalls, and zero-server spatial sanctuaries on escape-island.html.",
      solitude: "The Palace of Solitude (Vernal Colonnade Arrival 11111) is a serene aquatic haven submerged in meditative deep-sea tranquility on palace-of-solitude-11111.html.",
      metamall: "The Triaxial Metropolis is the Metamall — a sovereign 3D commercial space station designed for multi-tier virtual commerce, interactive retail pavilions, and WebGPU 3D checkout experiences on meta-mall.html.",
      ship: "The Kinetic Slipway (Intergalactic Ship) is Sector H — a deep-space interstellar transit station built with kinetic orbital geometries on intergalactic-ship.html.",
      lab: "The Crossverse Core is the Metaverse Lab — our spatial computing R&D sanctuary featuring real-time WebGPU shaders, interactive DOTS simulations, neural-radiance visualizers, and cross-platform metaverse architectures on metaverse-lab.html.",
      cleopatra: "Cleopatra's Tomb 55 is the Genesis Vault — an encrypted archaeological crypt preserving ancestral cryptographic secrets beneath procedural sandstone vaults on cleopatras-tomb-55.html.",
      cyberkings: "The Moloch Wastes (Cyber Kings 2055) is Sector 11 — a high-voltage cybernetic arena and sovereign battlefield with dystopian industrial aesthetics on cyber-kings-2055.html.",
      genesis: "The Origin (Pavilion of Absolutes 11111 B.C.) is our primordial architectural seed on egypt-genesis-11111.html, grounding the sovereign DeepVoid saga in foundational sacred mathematics."
    },
    services: "Moody Designs provides high-end metaverse architectural production, including: 1) Meta-Commerce & Virtual Storefronts, 2) High-Fidelity Spatial Digital Twins, 3) Real-Time WebGPU 3D Experiences, 4) Custom Unity DOTS Shaders, and 5) Transmedia Worldbuilding. You can explore our complete portfolio on metaverse-services.html or submit a partnership proposal on request-offer.html.",
    tech: "Our architecture is engineered for low latency, zero server costs, and locked 60+ FPS performance directly in web browsers, PC, and standalone VR headsets (Meta Quest, Apple Vision Pro). We use real-time WebGPU shaders, WebGL, Unity DOTS, and zero-GC JavaScript pipelines.",
    investors: "For strategic angel investors, venture funds, and spatial computing syndicates, explore our institutional deck and vision documents on investors.html or email us at moodydesigns.sales@gmail.com."
  };

  // State Management
  let isLiveActive = false;
  let recognition = null;
  let isListening = false;
  let isSpeaking = false;
  let orbAnimId = null;
  let ws = null;
  let currentEngine = 'sovereign'; // 'sovereign' | 'gemini-live' | 'gemini-rest'

  // DOM Elements cache
  const els = {};

  // ------------------------------------------------------------------------
  // 2. KNOWLEDGE QUERY RESOLVER
  // ------------------------------------------------------------------------
  function queryVault(text) {
    const q = (text || '').toLowerCase().trim();

    if (q.includes('giza') || q.includes('2030') || q.includes('p-ab') || q.includes('abundance')) {
      return VAULT.sectors.giza;
    }
    if (q.includes('alexandria') || q.includes('2222') || q.includes('citadel')) {
      return VAULT.sectors.alexandria;
    }
    if (q.includes('bali') || q.includes('2111') || q.includes('bamboo')) {
      return VAULT.sectors.bali;
    }
    if (q.includes('escape') || q.includes('island') || q.includes('cherry') || q.includes('sakura')) {
      return VAULT.sectors.escape;
    }
    if (q.includes('solitude') || q.includes('palace') || q.includes('hadal') || q.includes('cathedral') || q.includes('abyssal')) {
      return VAULT.sectors.solitude;
    }
    if (q.includes('mall') || q.includes('metamall') || q.includes('commerce') || q.includes('triaxial') || q.includes('store')) {
      return VAULT.sectors.metamall;
    }
    if (q.includes('ship') || q.includes('intergalactic') || q.includes('transit') || q.includes('slipway')) {
      return VAULT.sectors.ship;
    }
    if (q.includes('lab') || q.includes('crossverse') || q.includes('r&d') || q.includes('core')) {
      return VAULT.sectors.lab;
    }
    if (q.includes('cleopatra') || q.includes('tomb') || q.includes('vault') || q.includes('55')) {
      return VAULT.sectors.cleopatra;
    }
    if (q.includes('moloch') || q.includes('cyber kings') || q.includes('2055') || q.includes('waste')) {
      return VAULT.sectors.cyberkings;
    }
    if (q.includes('origin') || q.includes('genesis') || q.includes('absolutes') || q.includes('11111')) {
      return VAULT.sectors.genesis;
    }
    if (q.includes('who is moody') || q.includes('founder') || q.includes('adel') || q.includes('architect') || q.includes('the moody') || q.includes('about')) {
      return `${VAULT.founder.name} — ${VAULT.founder.role}. ${VAULT.founder.bio} Learn more on The_Moody.html.`;
    }
    if (q.includes('service') || q.includes('offer') || q.includes('hire') || q.includes('pricing') || q.includes('cost') || q.includes('build')) {
      return VAULT.services;
    }
    if (q.includes('invest') || q.includes('funding') || q.includes('partner') || q.includes('capital') || q.includes('deck')) {
      return VAULT.investors;
    }
    if (q.includes('tech') || q.includes('webgpu') || q.includes('shader') || q.includes('engine') || q.includes('unity') || q.includes('fps')) {
      return VAULT.tech;
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('greetings')) {
      return "Greetings! Welcome to Moody Designs and the DeepVoid Saga sovereign universe. I am your voice intelligence agent. Ask me about our 11 sectors, 3D WebGPU architectures, founder Moody, or metaverse production services.";
    }

    return "Moody Designs spans 11 sovereign sectors — from the golden corridors of Giza 2030 to the Bamboo Sanctuaries of Bali 2111 and the Crossverse Core Metaverse Lab. How can I guide your journey through our cyber sanctuaries?";
  }

  // ------------------------------------------------------------------------
  // 3. STYLES INJECTION
  // ------------------------------------------------------------------------
  function injectStyles() {
    if (document.getElementById('moody-voice-agent-styles')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'moody-voice-agent-styles';
    styleEl.textContent = `
      /* Floating Direct Voice Trigger Button */
      #moody-live-trigger {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483640;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: linear-gradient(135deg, #f58220 0%, #ff914d 50%, #e65100 100%);
        color: #000000;
        padding: 12px 22px;
        border-radius: 9999px;
        border: 2px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 10px 30px rgba(245, 130, 32, 0.5), 0 0 20px rgba(255, 145, 77, 0.4);
        cursor: pointer;
        user-select: none;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-weight: 800;
        font-size: 14px;
        letter-spacing: 0.04em;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      #moody-live-trigger:hover {
        transform: translateY(-3px) scale(1.04);
        box-shadow: 0 16px 40px rgba(245, 130, 32, 0.7), 0 0 30px rgba(255, 145, 77, 0.6);
      }
      #moody-live-trigger .moody-trigger-icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #000000;
        color: #f58220;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      #moody-live-trigger .moody-trigger-badge {
        background: rgba(0, 0, 0, 0.25);
        color: #000000;
        font-size: 10px;
        font-weight: 900;
        padding: 2px 8px;
        border-radius: 9999px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      /* Fullscreen Pure Voice-to-Voice Overlay */
      #moody-voice-overlay {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 2147483646;
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 32px 24px;
        box-sizing: border-box;
        background: radial-gradient(circle at center, rgba(16, 18, 27, 0.96) 0%, rgba(4, 5, 8, 0.98) 100%);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #ffffff;
        overflow-y: auto;
      }
      #moody-voice-overlay.is-active {
        display: flex;
        animation: moodyFadeIn 0.35s ease-out;
      }
      @keyframes moodyFadeIn {
        from { opacity: 0; transform: scale(0.97); }
        to { opacity: 1; transform: scale(1); }
      }

      /* Header */
      .moody-voice-header {
        width: 100%;
        max-width: 900px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .moody-voice-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 800;
        font-size: 15px;
        letter-spacing: 0.06em;
        color: #f58220;
        text-transform: uppercase;
      }
      .moody-voice-live-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 10px #10b981;
        animation: moodyPulse 1.8s infinite;
      }
      @keyframes moodyPulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 16px #10b981; }
      }
      .moody-header-controls {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .moody-icon-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #ffffff;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        font-size: 18px;
      }
      .moody-icon-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.08);
      }
      .moody-icon-btn.close:hover {
        background: rgba(239, 68, 68, 0.3);
        border-color: #ef4444;
        color: #ef4444;
      }

      /* Center Stage: Holographic Orb */
      .moody-voice-center {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        max-width: 680px;
        margin: auto;
      }
      .moody-orb-container {
        position: relative;
        width: 220px;
        height: 220px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 28px;
      }
      .moody-orb-ring-1 {
        position: absolute;
        width: 250px;
        height: 250px;
        border-radius: 50%;
        border: 2px dashed rgba(245, 130, 32, 0.35);
        animation: moodySpin 22s linear infinite;
      }
      .moody-orb-ring-2 {
        position: absolute;
        width: 290px;
        height: 290px;
        border-radius: 50%;
        border: 1px solid rgba(16, 185, 129, 0.25);
        animation: moodySpinRev 28s linear infinite;
      }
      @keyframes moodySpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes moodySpinRev {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }
      .moody-orb-core {
        width: 170px;
        height: 170px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, #ffb347 0%, #f58220 50%, #9e3d00 100%);
        box-shadow: 0 0 50px rgba(245, 130, 32, 0.6), 0 0 90px rgba(255, 179, 71, 0.3);
        transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .moody-orb-core:hover {
        transform: scale(1.05);
      }
      .moody-orb-icon {
        width: 54px;
        height: 54px;
        color: #000000;
        opacity: 0.9;
      }

      /* Titles & Status */
      .moody-voice-title {
        font-size: 26px;
        font-weight: 800;
        letter-spacing: -0.01em;
        margin-bottom: 8px;
        background: linear-gradient(135deg, #ffffff 0%, #ffc078 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .moody-voice-subtitle {
        font-size: 14px;
        font-weight: 500;
        color: #94a3b8;
        line-height: 1.6;
        margin-bottom: 18px;
        max-width: 560px;
      }
      .moody-voice-status-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(245, 130, 32, 0.12);
        border: 1px solid rgba(245, 130, 32, 0.35);
        color: #ff914d;
        padding: 6px 18px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.04em;
        margin-bottom: 20px;
      }

      /* Live Speech Transcription Box */
      .moody-transcript-box {
        width: 100%;
        max-width: 600px;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 14px;
        padding: 14px 18px;
        min-height: 52px;
        font-size: 14px;
        line-height: 1.5;
        color: #e2e8f0;
        text-align: left;
        margin-bottom: 20px;
        box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.5);
      }
      .moody-transcript-user {
        color: #f58220;
        font-weight: 700;
        margin-bottom: 4px;
      }
      .moody-transcript-agent {
        color: #e2e8f0;
      }

      /* Suggested Query Chips */
      .moody-chips-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;
        max-width: 650px;
        margin-bottom: 20px;
      }
      .moody-chip {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.14);
        color: #cbd5e1;
        padding: 6px 14px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        user-select: none;
      }
      .moody-chip:hover {
        background: rgba(245, 130, 32, 0.2);
        border-color: #f58220;
        color: #ffffff;
        transform: translateY(-2px);
      }

      /* Bottom Input Bar */
      .moody-bottom-bar {
        width: 100%;
        max-width: 680px;
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .moody-chat-input {
        flex: 1;
        background: rgba(20, 24, 33, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #ffffff;
        padding: 12px 18px;
        border-radius: 9999px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }
      .moody-chat-input:focus {
        border-color: #f58220;
      }
      .moody-send-btn {
        background: #f58220;
        border: none;
        color: #000000;
        font-weight: 700;
        padding: 12px 22px;
        border-radius: 9999px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 14px;
      }
      .moody-send-btn:hover {
        background: #ff914d;
        transform: scale(1.04);
      }

      /* Settings Modal */
      #moody-settings-modal {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.75);
        z-index: 2147483647;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      #moody-settings-modal.is-active {
        display: flex;
      }
      .moody-settings-card {
        background: #0f1218;
        border: 1px solid rgba(245, 130, 32, 0.4);
        border-radius: 16px;
        padding: 28px;
        max-width: 480px;
        width: 100%;
        color: #f1f5f9;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9);
      }
      .moody-settings-title {
        font-size: 18px;
        font-weight: 800;
        color: #f58220;
        margin-bottom: 12px;
      }
      .moody-settings-desc {
        font-size: 13px;
        color: #94a3b8;
        line-height: 1.5;
        margin-bottom: 16px;
      }
      .moody-settings-input {
        width: 100%;
        box-sizing: border-box;
        background: #05070a;
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 10px 14px;
        color: #ffffff;
        font-size: 13px;
        margin-bottom: 16px;
        font-family: monospace;
      }
      .moody-settings-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // ------------------------------------------------------------------------
  // 4. FLOATING TRIGGER CREATION
  // ------------------------------------------------------------------------
  function createFloatingTrigger() {
    if (document.getElementById('moody-live-trigger')) return;
    injectStyles();

    const trigger = document.createElement('div');
    trigger.id = 'moody-live-trigger';
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('title', 'Talk with Sovereign AI Voice Assistant');
    trigger.innerHTML = `
      <div class="moody-trigger-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      </div>
      <span>Voice AI Assistant</span>
      <span class="moody-trigger-badge">Live</span>
    `;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openVoiceAgent();
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openVoiceAgent();
      }
    });

    document.body.appendChild(trigger);
  }

  // ------------------------------------------------------------------------
  // 5. OVERLAY CREATION
  // ------------------------------------------------------------------------
  function createOverlay() {
    if (document.getElementById('moody-voice-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'moody-voice-overlay';
    overlay.innerHTML = `
      <!-- Header -->
      <div class="moody-voice-header">
        <div class="moody-voice-brand">
          <div class="moody-voice-live-dot"></div>
          <span id="moody-brand-text">Moody Designs Voice AI</span>
        </div>
        <div class="moody-header-controls">
          <button class="moody-icon-btn" id="moody-settings-btn" type="button" title="Configure Gemini API Key">⚙️</button>
          <button class="moody-icon-btn close" id="moody-voice-close" type="button" title="End Voice Session">&times;</button>
        </div>
      </div>

      <!-- Center Holographic Orb -->
      <div class="moody-voice-center">
        <div class="moody-orb-container">
          <div class="moody-orb-ring-1"></div>
          <div class="moody-orb-ring-2"></div>
          <div class="moody-orb-core" id="moody-orb-core" title="Click to speak or pause listening">
            <svg class="moody-orb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </div>
        </div>

        <div class="moody-voice-title" id="moody-voice-title">Sovereign Voice Active</div>
        <div class="moody-voice-subtitle" id="moody-voice-sub">Speak naturally into your microphone or choose a topic below. The AI responds instantly in human speech.</div>
        <div class="moody-voice-status-pill" id="moody-voice-status">🟢 Listening...</div>

        <!-- Live Transcript -->
        <div class="moody-transcript-box" id="moody-transcript-box">
          <div class="moody-transcript-agent" id="moody-agent-speech">"Welcome to Moody Designs. How can I guide you through our 11 cyber sectors?"</div>
        </div>

        <!-- Topic Chips -->
        <div class="moody-chips-container">
          <span class="moody-chip" data-q="Tell me about Bali 2111">🌿 Bali 2111</span>
          <span class="moody-chip" data-q="Tell me about Giza 2030">🏛️ Giza 2030</span>
          <span class="moody-chip" data-q="Tell me about Egypt 2222 New Alexandria">⚡ New Alexandria</span>
          <span class="moody-chip" data-q="Tell me about Escape Island">🌸 Escape Island</span>
          <span class="moody-chip" data-q="Tell me about Cyber Kings 2055">👑 Cyber Kings</span>
          <span class="moody-chip" data-q="Who is founder Moody?">👤 Founder Moody</span>
          <span class="moody-chip" data-q="What services does Moody Designs offer?">💼 Services &amp; Offers</span>
          <span class="moody-chip" data-q="Tell me about WebGPU spatial shaders">🎮 WebGPU Tech</span>
        </div>
      </div>

      <!-- Bottom Input Bar -->
      <div class="moody-bottom-bar">
        <input type="text" class="moody-chat-input" id="moody-chat-input" placeholder="Or type your question here..." />
        <button class="moody-send-btn" id="moody-send-btn" type="button">Ask</button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Settings Modal
    const settingsModal = document.createElement('div');
    settingsModal.id = 'moody-settings-modal';
    settingsModal.innerHTML = `
      <div class="moody-settings-card">
        <div class="moody-settings-title">⚙️ AI Voice Engine Configuration</div>
        <p class="moody-settings-desc">
          By default, this widget connects directly to the private Gemini Live WebSocket speech bridge when hosted, or falls back to the <strong>Sovereign Zero-Server Engine</strong>.<br><br>
          <strong>Optional Custom Server Bridge:</strong>
        </p>
        <input type="text" class="moody-settings-input" id="moody-ws-url-input" placeholder="wss://your-backend-proxy.domain/live" />
        <p class="moody-settings-desc">
          <strong>Direct Browser Gemini Key (Stored in Local Browser Only):</strong>
        </p>
        <input type="password" class="moody-settings-input" id="moody-api-key-input" placeholder="Paste personal Gemini API Key" />
        <div class="moody-settings-actions">
          <button class="moody-chip" id="moody-settings-clear" type="button" style="border-color:#ef4444; color:#ef4444;">Reset</button>
          <button class="moody-chip" id="moody-settings-cancel" type="button">Cancel</button>
          <button class="moody-send-btn" id="moody-settings-save" type="button">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(settingsModal);

    // Cache elements
    els.overlay = overlay;
    els.closeBtn = document.getElementById('moody-voice-close');
    els.settingsBtn = document.getElementById('moody-settings-btn');
    els.settingsModal = settingsModal;
    els.apiKeyInput = document.getElementById('moody-api-key-input');
    els.wsUrlInput = document.getElementById('moody-ws-url-input');
    els.settingsSave = document.getElementById('moody-settings-save');
    els.settingsCancel = document.getElementById('moody-settings-cancel');
    els.settingsClear = document.getElementById('moody-settings-clear');
    els.orbCore = document.getElementById('moody-orb-core');
    els.title = document.getElementById('moody-voice-title');
    els.subtitle = document.getElementById('moody-voice-sub');
    els.status = document.getElementById('moody-voice-status');
    els.transcriptBox = document.getElementById('moody-transcript-box');
    els.agentSpeech = document.getElementById('moody-agent-speech');
    els.chatInput = document.getElementById('moody-chat-input');
    els.sendBtn = document.getElementById('moody-send-btn');

    // Event Bindings
    els.closeBtn.addEventListener('click', closeVoiceAgent);
    els.orbCore.addEventListener('click', toggleListening);

    // Settings modal events
    els.settingsBtn.addEventListener('click', () => {
      els.apiKeyInput.value = localStorage.getItem('MOODY_GEMINI_API_KEY') || '';
      els.wsUrlInput.value = localStorage.getItem('MOODY_LIVE_WS_URL') || '';
      settingsModal.classList.add('is-active');
    });
    els.settingsCancel.addEventListener('click', () => {
      settingsModal.classList.remove('is-active');
    });
    els.settingsClear.addEventListener('click', () => {
      localStorage.removeItem('MOODY_GEMINI_API_KEY');
      localStorage.removeItem('MOODY_LIVE_WS_URL');
      els.apiKeyInput.value = '';
      els.wsUrlInput.value = '';
      settingsModal.classList.remove('is-active');
      determineEngine();
    });
    els.settingsSave.addEventListener('click', () => {
      const key = els.apiKeyInput.value.trim();
      const wsUrl = els.wsUrlInput.value.trim();
      if (key) {
        localStorage.setItem('MOODY_GEMINI_API_KEY', key);
      } else {
        localStorage.removeItem('MOODY_GEMINI_API_KEY');
      }
      if (wsUrl) {
        localStorage.setItem('MOODY_LIVE_WS_URL', wsUrl);
      } else {
        localStorage.removeItem('MOODY_LIVE_WS_URL');
      }
      settingsModal.classList.remove('is-active');
      determineEngine();
    });

    // Topic chips
    overlay.querySelectorAll('.moody-chip[data-q]').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-q');
        handleUserQuery(query);
      });
    });

    // Chat input
    els.sendBtn.addEventListener('click', () => {
      const q = els.chatInput.value.trim();
      if (q) {
        handleUserQuery(q);
        els.chatInput.value = '';
      }
    });
    els.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = els.chatInput.value.trim();
        if (q) {
          handleUserQuery(q);
          els.chatInput.value = '';
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // 6. ENGINE DETECTION (Gemini Live WebSocket / Cloud API / Sovereign Vault)
  // ------------------------------------------------------------------------
  function determineEngine() {
    const customKey = localStorage.getItem('MOODY_GEMINI_API_KEY');
    if (customKey) {
      currentEngine = 'gemini-rest';
      els.status.textContent = "✨ Gemini Cloud AI Connected";
      els.title.textContent = "Gemini Cloud Intelligence Active";
      return;
    }

    // Check configured WebSocket URL or infer from current host
    const configuredWs = window.MOODY_LIVE_WS_URL || localStorage.getItem('MOODY_LIVE_WS_URL');
    let wsUrl = null;
    if (configuredWs) {
      wsUrl = configuredWs;
    } else if (location.protocol.startsWith('http') && location.host) {
      const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${wsProtocol}//${location.host}/live`;
    }

    if (wsUrl) {
      try {
        const testWs = new WebSocket(wsUrl);
        testWs.onopen = () => {
          ws = testWs;
          currentEngine = 'gemini-live';
          els.status.textContent = "🟢 Gemini Live Speech-to-Speech Active";
          els.title.textContent = "Gemini Live Mode";
          setupWsHandlers();
        };
        testWs.onerror = () => {
          engageSovereignFallback();
        };
        return;
      } catch (e) {
        engageSovereignFallback();
      }
    } else {
      engageSovereignFallback();
    }
  }

  function engageSovereignFallback() {
    currentEngine = 'sovereign';
    if (els.status) {
      els.status.textContent = "🟢 Sovereign Voice AI (Zero-Server Mode)";
      els.title.textContent = "Sovereign Intelligence Active";
    }
  }

  // Audio Contexts for Live Speech-to-Speech Streaming
  let inputAudioCtx = null;
  let outputAudioCtx = null;
  let mediaStream = null;
  let micSource = null;
  let scriptProcessor = null;
  let nextStartTime = 0;
  let activeAudioSources = [];

  function floatTo16BitPCM(float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  }

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  function base64ToInt16Array(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Int16Array(bytes.buffer);
  }

  function pcm16ToFloat32(int16Array) {
    const float32 = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32[i] = int16Array[i] / (int16Array[i] < 0 ? 0x8000 : 0x7FFF);
    }
    return float32;
  }

  function playPcmChunk(base64Audio) {
    if (!outputAudioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      outputAudioCtx = new AudioCtxClass({ sampleRate: 24000 });
      nextStartTime = outputAudioCtx.currentTime;
    }
    if (outputAudioCtx.state === 'suspended') {
      outputAudioCtx.resume();
    }

    const int16Data = base64ToInt16Array(base64Audio);
    const float32Data = pcm16ToFloat32(int16Data);
    const buffer = outputAudioCtx.createBuffer(1, float32Data.length, 24000);
    buffer.getChannelData(0).set(float32Data);

    const source = outputAudioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(outputAudioCtx.destination);

    const now = outputAudioCtx.currentTime;
    if (nextStartTime < now) nextStartTime = now;
    source.start(nextStartTime);
    nextStartTime += buffer.duration;
    activeAudioSources.push(source);

    startOrbVisualizer(true, true);
    els.status.textContent = "🗣️ Gemini Speaking...";

    source.onended = () => {
      const idx = activeAudioSources.indexOf(source);
      if (idx !== -1) activeAudioSources.splice(idx, 1);
      if (activeAudioSources.length === 0) {
        startOrbVisualizer(false);
        els.status.textContent = "🟢 Live Gemini 3.8 Listening";
      }
    };
  }

  function stopAudioPlayback() {
    activeAudioSources.forEach(s => {
      try { s.stop(); } catch(e){}
    });
    activeAudioSources = [];
    if (outputAudioCtx) nextStartTime = outputAudioCtx.currentTime;
  }

  async function startDirectMicStreaming() {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      inputAudioCtx = new AudioCtxClass({ sampleRate: 16000 });
      await inputAudioCtx.resume();

      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });

      micSource = inputAudioCtx.createMediaStreamSource(mediaStream);
      scriptProcessor = inputAudioCtx.createScriptProcessor(4096, 1, 1);

      scriptProcessor.onaudioprocess = (e) => {
        if (!isLiveActive || !ws || ws.readyState !== WebSocket.OPEN) return;
        const inputChannel = e.inputBuffer.getChannelData(0);
        const pcmBuffer = floatTo16BitPCM(inputChannel);
        const base64Audio = arrayBufferToBase64(pcmBuffer);
        ws.send(JSON.stringify({ audio: base64Audio }));
      };

      micSource.connect(scriptProcessor);
      scriptProcessor.connect(inputAudioCtx.destination);
      console.log('[GEMINI LIVE] Direct 16kHz PCM streaming active to server');
    } catch (err) {
      console.warn('[MIC STREAM WARN]', err);
    }
  }

  function setupWsHandlers() {
    if (!ws) return;
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.status === 'connected') {
          console.log('[GEMINI LIVE CONNECTED]', msg.model);
          els.status.textContent = "🟢 Live Gemini Speech-to-Speech Active";
          els.title.textContent = "Gemini Live Mode";
          startDirectMicStreaming();
        } else if (msg.audio) {
          playPcmChunk(msg.audio);
        } else if (msg.interrupted) {
          stopAudioPlayback();
        } else if (msg.error) {
          console.warn('[GEMINI WS MSG]', msg.error);
          engageSovereignFallback();
        }
      } catch (e) {
        console.error(e);
      }
    };
    ws.onclose = () => {
      stopAudioPlayback();
      engageSovereignFallback();
    };
  }

  // ------------------------------------------------------------------------
  // 7. SPEECH RECOGNITION (VOICE INPUT)
  // ------------------------------------------------------------------------
  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('[VOICE AI] Browser does not support Web Speech Recognition.');
      els.status.textContent = "💬 Voice mic unavailable — please type below";
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListening = true;
      els.status.textContent = "🎙️ Listening... (Speak now)";
      startOrbVisualizer(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        handleUserQuery(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.warn('[SPEECH REC ERROR]', event.error);
      isListening = false;
      startOrbVisualizer(false);
      if (event.error === 'not-allowed') {
        els.status.textContent = "⚠️ Mic permission denied. Please type below.";
      } else {
        els.status.textContent = "🟢 Ready — tap orb to speak";
      }
    };

    recognition.onend = () => {
      isListening = false;
      if (!isSpeaking) {
        startOrbVisualizer(false);
        els.status.textContent = "🟢 Ready — tap orb to speak";
      }
    };
  }

  function toggleListening() {
    if (isSpeaking) {
      stopSpeaking();
    }

    if (isListening) {
      if (recognition) recognition.stop();
      isListening = false;
      els.status.textContent = "🟢 Ready — tap orb to speak";
      startOrbVisualizer(false);
    } else {
      if (recognition) {
        try {
          recognition.start();
        } catch (e) {
          console.warn(e);
        }
      }
    }
  }

  // ------------------------------------------------------------------------
  // 8. QUERY PROCESSING & CLOUD API / SOVEREIGN RESOLUTION
  // ------------------------------------------------------------------------
  async function handleUserQuery(userText) {
    if (!userText) return;

    // Display user speech in transcript
    els.transcriptBox.innerHTML = `
      <div class="moody-transcript-user">You: "${escapeHtml(userText)}"</div>
      <div class="moody-transcript-agent" id="moody-agent-speech">Thinking...</div>
    `;
    els.agentSpeech = document.getElementById('moody-agent-speech');
    els.status.textContent = "⚡ Processing...";

    let replyText = "";

    // 1. If user configured custom Gemini API Key
    const apiKey = localStorage.getItem('MOODY_GEMINI_API_KEY');
    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userText }] }],
            systemInstruction: {
              parts: [{
                text: "You are the sovereign AI voice intelligence agent for Moody Designs and the DeepVoid Saga (founded by 3D architect A. Adel Hosny, known as The Moody). Provide eloquent, concise, human answers about the 11 sectors (Giza 2030, Egypt 2222 New Alexandria, Bali 2111, Escape Island, Palace of Solitude 11111, Metamall, Intergalactic Ship, Metaverse Lab, Cleopatra's Tomb 55, Cyber Kings 2055, and Genesis 11111), WebGPU shaders, and metaverse production services. Keep answers concise, elegant, and under 3 sentences for natural speech."
              }]
            }
          })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          replyText = data.candidates[0].content.parts[0].text;
        } else if (data.error) {
          console.warn('[GEMINI REST API ERROR]', data.error);
          replyText = queryVault(userText);
        }
      } catch (err) {
        console.warn('[GEMINI FETCH ERROR, FALLING BACK TO VAULT]', err);
        replyText = queryVault(userText);
      }
    } else {
      // 2. Sovereign Knowledge Vault
      replyText = queryVault(userText);
    }

    if (!replyText) {
      replyText = queryVault(userText);
    }

    // Display agent reply
    els.agentSpeech.textContent = replyText;

    // Speak reply
    speakResponse(replyText);
  }

  // ------------------------------------------------------------------------
  // 9. SPEECH SYNTHESIS (VOICE OUTPUT)
  // ------------------------------------------------------------------------
  function speakResponse(text) {
    if (!('speechSynthesis' in window)) {
      els.status.textContent = "🟢 Ready";
      return;
    }

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.98;

    // Pick natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('Samantha'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => {
      isSpeaking = true;
      els.status.textContent = "🗣️ AI Speaking...";
      startOrbVisualizer(true, true);
    };

    utterance.onend = () => {
      isSpeaking = false;
      startOrbVisualizer(false);
      els.status.textContent = "🟢 Ready — tap orb to speak";
    };

    utterance.onerror = () => {
      isSpeaking = false;
      startOrbVisualizer(false);
      els.status.textContent = "🟢 Ready — tap orb to speak";
    };

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
  }

  // ------------------------------------------------------------------------
  // 10. HOLOGRAPHIC ORB VISUALIZER
  // ------------------------------------------------------------------------
  function startOrbVisualizer(active, isSpeakingMode = false) {
    if (orbAnimId) {
      cancelAnimationFrame(orbAnimId);
      orbAnimId = null;
    }

    if (!active) {
      if (els.orbCore) {
        els.orbCore.style.transform = 'scale(1)';
        els.orbCore.style.boxShadow = '0 0 50px rgba(245, 130, 32, 0.6), 0 0 90px rgba(255, 179, 71, 0.3)';
      }
      return;
    }

    let phase = 0;
    function animate() {
      phase += 0.08;
      const pulse = Math.sin(phase) * (isSpeakingMode ? 0.12 : 0.06);
      const scale = 1.04 + pulse;
      const glow = 50 + (pulse + 0.1) * 120;

      if (els.orbCore) {
        els.orbCore.style.transform = `scale(${scale})`;
        els.orbCore.style.boxShadow = `0 0 ${glow}px rgba(245, 130, 32, 0.8), 0 0 ${glow * 1.5}px rgba(255, 179, 71, 0.45)`;
      }

      orbAnimId = requestAnimationFrame(animate);
    }
    animate();
  }

  // ------------------------------------------------------------------------
  // 11. LIFECYCLE MANAGEMENT
  // ------------------------------------------------------------------------
  function openVoiceAgent() {
    if (isLiveActive) return;

    createOverlay();
    els.overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    isLiveActive = true;

    determineEngine();
    initSpeechRecognition();

    // Welcome greeting
    const welcomeText = "Greetings! Welcome to Moody Designs. I am your sovereign AI voice intelligence. Ask me about our 11 sectors, WebGPU spatial architectures, founder Moody, or metaverse production services.";
    speakResponse(welcomeText);
  }

  function closeVoiceAgent() {
    isLiveActive = false;
    stopSpeaking();

    if (recognition && isListening) {
      try { recognition.stop(); } catch (e) {}
    }
    isListening = false;

    startOrbVisualizer(false);

    if (ws) {
      try { ws.close(); } catch (e) {}
      ws = null;
    }

    if (els.overlay) {
      els.overlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
  }

  // ------------------------------------------------------------------------
  // 12. GLOBAL API EXPOSURE
  // ------------------------------------------------------------------------
  window.MoodyLiveVoice = {
    start: openVoiceAgent,
    stop: closeVoiceAgent
  };
  window.MoodyAIAgent = {
    open: openVoiceAgent,
    close: closeVoiceAgent
  };

  // Auto-init on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createFloatingTrigger);
  } else {
    createFloatingTrigger();
  }
})();
