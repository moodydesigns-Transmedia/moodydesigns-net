require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');
let GoogleGenAI = null;
let Modality = { AUDIO: 'AUDIO' };
try {
  const genaiModule = require('@google/genai');
  GoogleGenAI = genaiModule.GoogleGenAI;
  if (genaiModule.Modality) Modality = genaiModule.Modality;
} catch (e) {
  console.warn('[SERVER INIT] @google/genai not installed. Falling back to Sovereign Knowledge Vault.');
}

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname);
const BACKUP_DIR = path.join(ROOT_DIR, 'backups', 'editor_saves');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.cjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

// Editor Client Script that gets injected dynamically into HTML responses
const EDITOR_CLIENT_SCRIPT = `
<!-- __MOODY_EDITOR_INJECTION_START__ -->
<style id="__moody_editor_styles__">
  #__moody_editor_bar__ {
    position: fixed;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2147483647;
    background: rgba(14, 14, 18, 0.95);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(245, 130, 32, 0.5);
    border-radius: 9999px;
    padding: 8px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(245, 130, 32, 0.25);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    color: #f4f4f5;
    user-select: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  #__moody_editor_bar__.minimized {
    padding: 6px 12px;
    opacity: 0.7;
  }
  #__moody_editor_bar__.minimized:hover {
    opacity: 1;
  }
  #__moody_editor_bar__ .brand-badge {
    font-weight: 800;
    letter-spacing: 0.05em;
    color: #f58220;
    display: flex;
    align-items: center;
    gap: 6px;
    text-transform: uppercase;
    font-size: 11px;
  }
  #__moody_editor_bar__ .brand-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 8px #10b981;
    animation: __moody_pulse__ 2s infinite;
  }
  @keyframes __moody_pulse__ {
    0% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.8; }
  }
  #__moody_editor_bar__ .divider {
    width: 1px;
    height: 20px;
    background: rgba(255, 255, 255, 0.15);
  }
  #__moody_editor_bar__ .btn-edit {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #27272a;
    border: 1px solid #3f3f46;
    color: #e4e4e7;
    padding: 6px 14px;
    border-radius: 9999px;
    cursor: pointer;
    font-weight: 600;
    font-size: 12px;
    transition: all 0.2s;
  }
  #__moody_editor_bar__ .btn-edit.active {
    background: #f58220;
    color: #000;
    border-color: #f58220;
    box-shadow: 0 0 14px rgba(245, 130, 32, 0.5);
  }
  #__moody_editor_bar__ .btn-save {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #10b981;
    border: none;
    color: #ffffff;
    padding: 6px 16px;
    border-radius: 9999px;
    cursor: pointer;
    font-weight: 700;
    font-size: 12px;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
    transition: all 0.2s;
  }
  #__moody_editor_bar__ .btn-save:hover {
    background: #059669;
    transform: translateY(-1px);
  }
  #__moody_editor_bar__ .status-text {
    font-size: 12px;
    color: #a1a1aa;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .__moody_editable_hover__ {
    outline: 2px dashed #f58220 !important;
    outline-offset: 2px !important;
    background-color: rgba(245, 130, 32, 0.1) !important;
    cursor: text !important;
  }
  .__moody_editable_focus__ {
    outline: 2px solid #10b981 !important;
    outline-offset: 2px !important;
    background-color: rgba(16, 185, 129, 0.12) !important;
  }
</style>
<div id="__moody_editor_bar__">
  <div class="brand-badge">
    <div class="brand-dot"></div>
    <span>Live Editor</span>
  </div>
  <div class="divider"></div>
  <button id="__moody_toggle_btn__" class="btn-edit" type="button">
    <span>✏️</span>
    <span id="__moody_toggle_text__">Click to Edit</span>
  </button>
  <button id="__moody_save_btn__" class="btn-save" type="button">
    <span>💾</span>
    <span>Save Changes</span>
  </button>
  <div class="divider"></div>
  <button id="__moody_ai_btn__" class="btn-save" type="button" style="background: #3b82f6;">
    <span>🤖</span>
    <span>Talk to AI</span>
  </button>
  <div class="divider"></div>
  <span id="__moody_status__" class="status-text">Ready</span>
</div>

<script id="__moody_editor_script__">
(function() {
  let isEditMode = false;
  let activeElement = null;
  const bar = document.getElementById('__moody_editor_bar__');
  const toggleBtn = document.getElementById('__moody_toggle_btn__');
  const toggleText = document.getElementById('__moody_toggle_text__');
  const saveBtn = document.getElementById('__moody_save_btn__');
  const statusEl = document.getElementById('__moody_status__');

  // Determine current filename
  let currentFile = window.location.pathname.split('/').pop() || 'index.html';
  if (!currentFile.endsWith('.html')) currentFile = 'home.html';
  statusEl.textContent = 'Editing ' + currentFile;

  function setStatus(text, color) {
    statusEl.textContent = text;
    if (color) statusEl.style.color = color;
    else statusEl.style.color = '#a1a1aa';
  }

  function isEditableTarget(el) {
    if (!el || el === document.body || el === document.documentElement) return false;
    if (el.closest('#__moody_editor_bar__')) return false;
    const tag = el.tagName.toLowerCase();
    const validTags = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'button', 'li', 'b', 'strong', 'i', 'em'];
    if (validTags.includes(tag)) return true;
    if (tag === 'div' && el.children.length === 0 && (el.textContent || '').trim().length > 0) return true;
    return false;
  }

  function toggleEditMode() {
    isEditMode = !isEditMode;
    if (isEditMode) {
      toggleBtn.classList.add('active');
      toggleText.textContent = 'Editing Active';
      setStatus('Click any text to edit', '#f58220');
      document.body.classList.add('__moody_edit_active__');
    } else {
      toggleBtn.classList.remove('active');
      toggleText.textContent = 'Click to Edit';
      setStatus('Ready');
      document.body.classList.remove('__moody_edit_active__');
      if (activeElement) {
        activeElement.removeAttribute('contenteditable');
        activeElement.classList.remove('__moody_editable_focus__');
        activeElement = null;
      }
    }
  }

  toggleBtn.addEventListener('click', toggleEditMode);

  // Mouse over text elements in edit mode
  document.addEventListener('mouseover', function(e) {
    if (!isEditMode) return;
    const target = e.target;
    if (isEditableTarget(target)) {
      target.classList.add('__moody_editable_hover__');
    }
  });

  document.addEventListener('mouseout', function(e) {
    const target = e.target;
    if (target && target.classList) {
      target.classList.remove('__moody_editable_hover__');
    }
  });

  // Intercept click in edit mode to prevent link navigation and enable contentEditable
  document.addEventListener('click', function(e) {
    if (!isEditMode) return;
    const target = e.target;
    if (target.closest('#__moody_editor_bar__')) return;

    if (isEditableTarget(target)) {
      e.preventDefault();
      e.stopPropagation();

      if (activeElement && activeElement !== target) {
        activeElement.removeAttribute('contenteditable');
        activeElement.classList.remove('__moody_editable_focus__');
      }

      activeElement = target;
      target.setAttribute('contenteditable', 'true');
      target.focus();
      target.classList.add('__moody_editable_focus__');
      setStatus('Editing <' + target.tagName.toLowerCase() + '>', '#10b981');
    }
  }, true);

  // Keyboard shortcut Ctrl+S to save
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveChanges();
    }
  });

  async function saveChanges() {
    setStatus('Saving to disk...', '#f58220');
    saveBtn.style.opacity = '0.5';

    // Remove focus / contenteditable before exporting HTML
    if (activeElement) {
      activeElement.removeAttribute('contenteditable');
      activeElement.classList.remove('__moody_editable_focus__');
    }
    document.querySelectorAll('.__moody_editable_hover__').forEach(el => el.classList.remove('__moody_editable_hover__'));
    document.querySelectorAll('.__moody_editable_focus__').forEach(el => el.classList.remove('__moody_editable_focus__'));

    // Clone the document to strip editor elements completely
    const docClone = document.documentElement.cloneNode(true);
    
    // Remove editor UI and styles from the clone
    const editorBar = docClone.querySelector('#__moody_editor_bar__');
    if (editorBar) editorBar.remove();
    const editorStyles = docClone.querySelector('#__moody_editor_styles__');
    if (editorStyles) editorStyles.remove();
    const editorScript = docClone.querySelector('#__moody_editor_script__');
    if (editorScript) editorScript.remove();

    // Clean any remaining temporary attributes
    docClone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    docClone.classList.remove('__moody_edit_active__');
    const cloneBody = docClone.querySelector('body');
    if (cloneBody) cloneBody.classList.remove('__moody_edit_active__');

    // Strip any dynamically injected particle canvases from static save
    docClone.querySelectorAll('#moody-particles').forEach(el => el.remove());

    let fullHtml = '<!DOCTYPE html>\\n' + docClone.outerHTML;

    // Clean editor injection comments completely
    fullHtml = fullHtml.replace(/<!-- __MOODY_EDITOR_INJECTION_(START|END)__ -->\\s*/g, '');

    try {
      const response = await fetch('/api/save-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: currentFile,
          html: fullHtml
        })
      });

      const res = await response.json();
      if (res.success) {
        setStatus('✓ Saved to disk! (' + res.time + ')', '#10b981');
        setTimeout(() => {
          if (isEditMode) setStatus('Editing Active', '#f58220');
          else setStatus('Ready');
        }, 3000);
      } else {
        setStatus('Error: ' + res.error, '#ef4444');
      }
    } catch (err) {
      console.error(err);
      setStatus('Save failed: ' + err.message, '#ef4444');
    } finally {
      saveBtn.style.opacity = '1';
    }
  }

  saveBtn.addEventListener('click', saveChanges);

  // AI Chat functionality
  const aiBtn = document.getElementById('__moody_ai_btn__');
  let currentInteractionId = null;
  aiBtn.addEventListener('click', async () => {
    const prompt = prompt("What would you like to ask the AI?");
    if (!prompt) return;

    setStatus('AI is thinking...', '#3b82f6');
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, previousInteractionId: currentInteractionId })
      });
      const data = await response.json();
      if (data.success) {
        currentInteractionId = data.interactionId;
        alert('AI response: ' + data.output);
        setStatus('Ready');
      } else {
        setStatus('AI Error: ' + data.error, '#ef4444');
      }
    } catch (err) {
      console.error(err);
      setStatus('AI Chat failed: ' + err.message, '#ef4444');
    }
  });

  console.log('%c[Moody Designs Live Visual Editor]%c Initialized for ' + currentFile, 'color: #f58220; font-weight: bold;', 'color: inherit;');
})();
</script>
<!-- __MOODY_EDITOR_INJECTION_END__ -->
`;

const server = http.createServer((req, res) => {
  // Global CORS headers for cross-origin hosting & decoupled frontend deployments
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Health check endpoint for cloud platforms (Render, Railway, Fly, Cloud Run)
  if (pathname === '/health' || pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'healthy',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      editorEnabled: process.env.ENABLE_EDITOR === 'true',
      timestamp: new Date().toISOString()
    }));
  }

  // API endpoint to save updated HTML directly to disk (active only in local editor mode)
  if (req.method === 'POST' && pathname === '/api/save-page') {
    if (process.env.ENABLE_EDITOR !== 'true') {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: false, error: 'Visual editor saving is disabled in production.' }));
    }
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        let filename = path.basename(data.file || 'home.html');
        if (!filename.endsWith('.html')) filename += '.html';

        const targetPath = path.join(ROOT_DIR, filename);
        if (!fs.existsSync(targetPath)) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: 'File not found: ' + filename }));
        }

        // 1. Create timestamped backup
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(BACKUP_DIR, `${filename}_${timestamp}.bak`);
        const originalContent = fs.readFileSync(targetPath, 'utf8');
        fs.writeFileSync(backupPath, originalContent, 'utf8');

        // 2. Write new content to disk
        fs.writeFileSync(targetPath, data.html, 'utf8');

        console.log(`[SAVE] ${filename} updated successfully. Backup created: ${path.basename(backupPath)}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          file: filename,
          time: new Date().toLocaleTimeString(),
          backup: path.basename(backupPath)
        }));
      } catch (err) {
        console.error('[SAVE ERROR]', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API endpoint for AI chat using Gemini 3.8 Live with Sovereign Vault fallback
  if (req.method === 'POST' && pathname === '/api/ai-chat') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { prompt, audio, audioMime, previousInteractionId } = JSON.parse(body || '{}');
        const userQuery = (prompt || '').trim();

        // 1. If GEMINI_API_KEY is available and GoogleGenAI loaded, try Gemini API
        if (process.env.GEMINI_API_KEY && GoogleGenAI) {
          try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const systemInstruction = "You are the sovereign AI voice intelligence agent for Moody Designs and the DeepVoid Saga (founded by 3D architect A. Adel Hosny, known as The Moody). You provide eloquent, knowledgeable answers about the 11 sectors (including Giza 2030, New Alexandria Citadel Egypt 2222, Bali 2111 Bamboo Sanctuaries, White Grove Basilica Escape Island, Tri-Axial Metropolis Metamall, Kinetic Slipway Intergalactic Ship, Crossverse Core Metaverse Lab, Cleopatra's Tomb 55 Genesis Vault, Moloch Wastes Cyber Kings 2055, Vernal Colonnade Palace of Solitude, and Pavilion of Absolutes Genesis 11111), spatial web architectures, WebGPU shaders, Unity DOTS, and metaverse production services. Keep spoken answers concise, elegant, authoritative, and immersive.";

            let textOutput = "";

            // Primary: gemini-2.5-flash or gemini-2.0-flash
            try {
              let contentsPayload;
              if (audio) {
                contentsPayload = [
                  {
                    inlineData: {
                      mimeType: audioMime || "audio/webm",
                      data: audio
                    }
                  },
                  {
                    text: userQuery || "Listen to this audio and respond as Moody Designs AI Agent."
                  }
                ];
              } else {
                contentsPayload = userQuery || "Tell me about Moody Designs metaverse worlds and DeepVoid Saga.";
              }

              let response = null;
              try {
                response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: contentsPayload,
                  config: { systemInstruction }
                });
              } catch (e1) {
                console.warn('[GEMINI 3.8 FLASH FALLBACK]', e1.message);
                response = await ai.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: contentsPayload,
                  config: { systemInstruction }
                });
              }

              textOutput = response.text || "";

              // Realistic Human Speech generation via Gemini 3.8 TTS
              let audioBase64 = null;
              if (textOutput) {
                try {
                  const speechRes = await ai.models.generateContent({
                    model: "gemini-3.8-flash-lite-tts",
                    contents: [
                      {
                        role: "user",
                        parts: [
                          {
                            text: textOutput.slice(0, 500),
                            speechMetadata: {
                              style: "Warm, highly realistic, eloquent, professional human architectural narrator"
                            }
                          }
                        ]
                      }
                    ],
                    config: {
                      responseModalities: ["AUDIO"],
                      speechConfig: {
                        voiceConfig: {
                          prebuiltVoiceConfig: { voiceName: "Zephyr" }
                        }
                      }
                    }
                  });
                  audioBase64 = speechRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
                } catch (ttsErr) {
                  console.warn("[GEMINI 3.8 TTS GENERATION WARN]:", ttsErr.message);
                }
              }

              if (textOutput) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                  success: true,
                  output: textOutput,
                  audioBase64: audioBase64,
                  mimeType: 'audio/wav',
                  source: audioBase64 ? 'gemini-3.8-tts' : 'gemini-3.8-flash'
                }));
              }
            } catch (flashErr) {
              console.warn("[GEMINI 3.8 FLASH CALL FAILED]:", flashErr.message);
              // Fall through to Sovereign Knowledge Vault
            }
          } catch (geminiErr) {
            console.warn('[GEMINI API CALL FAILED, ENGAGING SOVEREIGN VAULT]:', geminiErr.message);
          }
        }

        // 2. Sovereign Knowledge Vault Intelligent Fallback
        let vault = null;
        const vaultPath = path.join(ROOT_DIR, 'assets', 'knowledge_vault', 'site_vault.json');
        if (fs.existsSync(vaultPath)) {
          try {
            vault = JSON.parse(fs.readFileSync(vaultPath, 'utf8'));
          } catch (e) {
            console.warn('[VAULT READ WARN]', e.message);
          }
        }

        const q = userQuery.toLowerCase();
        let reply = "";

        if (q.includes('giza') || q.includes('2030') || q.includes('p-ab')) {
          reply = "Giza 2030 A.C. is an Abundance Engine and sovereign financial stage set on the Giza Plateau. It synthesizes sacred golden-ratio geometry with high-density solar pyramids, cybernetic data vaults, and clean energy distribution, aligning ancient architectural wisdom with UN Sustainable Development Goals. You can experience it directly on egypt-2030.html.";
        } else if (q.includes('crossverse') || q.includes('core') || q.includes('metaverse lab')) {
          reply = "The Crossverse Core is the Metaverse Lab — our bleeding-edge spatial computing R&D sanctuary. It showcases real-time WebGPU shaders, interactive DOTS simulations, neural-radiance visualizers, and cross-platform metaverse architectures on metaverse-lab.html.";
        } else if (q.includes('triaxial') || q.includes('tri-axial') || q.includes('metamall') || q.includes('mall') || q.includes('commerce')) {
          reply = "The Triaxial Metropolis is the Metamall — a sovereign 3D commercial space station designed for multi-tier virtual commerce, interactive retail pavilions, and WebGPU 3D checkout experiences on meta-mall.html.";
        } else if (q.includes('alexandria') || q.includes('2222') || q.includes('citadel')) {
          reply = "New Alexandria Citadel (Egypt 2222) is our sovereign post-cataclysm cyber sanctuary. Ancient obelisks are integrated into crystalline power conduits and volumetric emerald light canopies across egypt-2222.html.";
        } else if (q.includes('bali') || q.includes('2111') || q.includes('bamboo')) {
          reply = "The Bamboo Sanctuaries (Bali 2111) is World Sector A — an organic architectural haven woven from natural bamboo lattices, volumetric emerald canopies, and mirror-sea reflections on bali-2111.html.";
        } else if (q.includes('cleopatra') || q.includes('tomb') || q.includes('vault') || q.includes('genesis')) {
          reply = "Cleopatra's Tomb 55 is the Genesis Vault — an encrypted archaeological crypt preserving ancestral cryptographic secrets beneath procedural sandstone vaults on cleopatras-tomb-55.html.";
        } else if (q.includes('moloch') || q.includes('cyber kings') || q.includes('2055')) {
          reply = "The Moloch Wastes (Cyber Kings 2055) is Sector 11 — a high-voltage cybernetic arena and sovereign battlefield with dystopian industrial aesthetics on cyber-kings-2055.html.";
        } else if (q.includes('solitude') || q.includes('vernal') || q.includes('11111') || q.includes('abyssal')) {
          reply = "The Palace of Solitude (Vernal Colonnade Arrival 11111) is a serene aquatic haven submerged in meditative deep-sea tranquility on palace-of-solitude-11111.html.";
        } else if (q.includes('ship') || q.includes('intergalactic') || q.includes('slipway')) {
          reply = "The Kinetic Slipway (Intergalactic Ship) is Sector H — a deep-space interstellar transit station built with kinetic orbital geometries on intergalactic-ship.html.";
        } else if (q.includes('cherry') || q.includes('escape') || q.includes('island') || q.includes('basilica')) {
          reply = "The White Grove Basilica (Escape Island) is Sector E — an isolated sakura refuge surrounded by floating cherry blossoms and cyber-waterfalls on escape-island.html.";
        } else if (q.includes('origin') || q.includes('absolutes') || q.includes('genesis 11111')) {
          reply = "The Origin (Pavilion of Absolutes 11111 B.C.) is our primordial architectural seed on egypt-genesis-11111.html, grounding the sovereign DeepVoid saga in foundational sacred mathematics.";
        } else if (q.includes('who is moody') || q.includes('founder') || q.includes('adel') || q.includes('architect') || q.includes('the moody')) {
          reply = "Moody (A. Adel Hosny) is the visionary founder and lead 3D architect behind Moody Designs and the DeepVoid Saga. With over a decade of expertise in spatial computing, Unity DOTS, WebGPU shaders, and architectural digital twins, he constructs sovereign metaverse worlds that fuse timeless civilization heritage with futuristic cybernetics.";
        } else if (q.includes('service') || q.includes('offer') || q.includes('hire') || q.includes('pricing') || q.includes('commercial')) {
          reply = "Moody Designs provides high-end metaverse architectural production, including: 1) Meta-Commerce & Virtual Storefronts, 2) High-Fidelity Spatial Digital Twins, 3) Real-Time WebGPU 3D Experiences, 4) Custom Unity DOTS Shaders, and 5) Transmedia Worldbuilding. Explore our complete portfolio on metaverse-services.html.";
        } else {
          reply = `Welcome to Moody Designs and the DeepVoid Saga Sovereign Universe. I am your Gemini 3.8 Live voice intelligence agent. We span 11 distinct sovereign sectors—from the golden corridors of Giza 2030 to the Crossverse Core Metaverse Lab and the Triaxial Metropolis Metamall. How can I guide your journey through our cyber sanctuaries?`;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          interactionId: 'moody-vault-' + Date.now(),
          output: reply,
          audioBase64: null,
          source: 'sovereign-vault'
        }));
      } catch (err) {
        console.error('[AI CHAT SERVER ERROR]', err);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          output: "Greetings from Moody Designs! I am your sovereign AI intelligence. Explore our 11 sectors, WebGPU architectures, and metaverse services anytime.",
          source: 'emergency-fallback'
        }));
      }
    });
    return;
  }

  // Handle static file serving
  if (pathname === '/') {
    pathname = fs.existsSync(path.join(ROOT_DIR, 'index.html')) ? '/index.html' : '/home.html';
  }

  const filePath = path.join(ROOT_DIR, pathname);

  // Security check: stay within ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    return res.end('Access Denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found: ' + pathname);
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    // If it's an HTML file and ENABLE_EDITOR is true, inject live visual editor script!
    if (ext === '.html' && process.env.ENABLE_EDITOR === 'true') {
      fs.readFile(filePath, 'utf8', (readErr, content) => {
        if (readErr) {
          res.writeHead(500);
          return res.end('Server error reading file');
        }

        // Inject editor right before </body>
        let injected = content;
        if (injected.includes('</body>')) {
          injected = injected.replace('</body>', `${EDITOR_CLIENT_SCRIPT}\n</body>`);
        } else {
          injected += EDITOR_CLIENT_SCRIPT;
        }

        res.writeHead(200, {
          'Content-Type': mimeType,
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        });
        res.end(injected);
      });
      return;
    }

    // Stream non-HTML files
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

// Attach WebSocket server for Gemini 3.8 Live real-time speech-to-speech
const wss = new WebSocketServer({ server, path: '/live' });

wss.on('connection', async (clientWs) => {
  console.log('[GEMINI LIVE WS] Client connected to speech-to-speech bridge');
  let liveSession = null;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      clientWs.send(JSON.stringify({ error: 'GEMINI_API_KEY not configured on server. Engage client Sovereign Voice fallback.' }));
      return;
    }
    if (!GoogleGenAI) {
      clientWs.send(JSON.stringify({ error: '@google/genai not available. Engage client Sovereign Voice fallback.' }));
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    let liveModel = 'gemini-3.8-live';
    try {
      liveSession = await ai.live.connect({
        model: liveModel,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' }
            }
          },
          systemInstruction: "You are the sovereign AI voice intelligence for Moody Designs and the DeepVoid Saga (founded by 3D architect A. Adel Hosny, known as The Moody). You speak naturally, conversationally, eloquently, and concisely like a real human narrator. Answer questions about the 11 sectors, WebGPU spatial computing, and metaverse production services."
        },
        callbacks: {
          onmessage: (message) => {
            for (const part of message.serverContent?.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) {
                clientWs.send(JSON.stringify({ audio: part.inlineData.data }));
              }
            }
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onerror: (err) => {
            console.error('[GEMINI LIVE SESSION ERROR]:', err.message);
            clientWs.send(JSON.stringify({ error: err.message }));
          },
          onclose: () => {
            console.log('[GEMINI LIVE SESSION CLOSED]');
          }
        }
      });
      clientWs.send(JSON.stringify({ status: 'connected', model: liveModel }));
    } catch (connectErr) {
      console.warn('[GEMINI LIVE 3.8 CONNECT RETRY WITH FALLBACK]:', connectErr.message);
      liveModel = 'gemini-2.0-flash-exp';
      liveSession = await ai.live.connect({
        model: liveModel,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' }
            }
          },
          systemInstruction: "You are the sovereign AI voice intelligence for Moody Designs and the DeepVoid Saga (founded by 3D architect A. Adel Hosny, known as The Moody). You speak naturally, conversationally, eloquently, and concisely like a real human narrator. Answer questions about the 11 sectors, WebGPU spatial computing, and metaverse production services."
        },
        callbacks: {
          onmessage: (message) => {
            for (const part of message.serverContent?.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) {
                clientWs.send(JSON.stringify({ audio: part.inlineData.data }));
              }
            }
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onerror: (err) => {
            console.error('[GEMINI LIVE SESSION ERROR]:', err.message);
            clientWs.send(JSON.stringify({ error: err.message }));
          },
          onclose: () => {
            console.log('[GEMINI LIVE SESSION CLOSED]');
          }
        }
      });
      clientWs.send(JSON.stringify({ status: 'connected', model: liveModel }));
    }
  } catch (err) {
    console.error('[GEMINI LIVE CONNECT ERROR]:', err.message);
    clientWs.send(JSON.stringify({ error: err.message }));
  }

  clientWs.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.audio && liveSession) {
        liveSession.sendRealtimeInput({
          audio: {
            data: msg.audio,
            mimeType: 'audio/pcm;rate=16000'
          }
        });
      }
    } catch (e) {
      console.warn('[GEMINI LIVE CLIENT MSG WARN]:', e.message);
    }
  });

  clientWs.on('close', () => {
    console.log('[GEMINI LIVE WS] Client disconnected');
    if (liveSession) {
      try { liveSession.close(); } catch (e) {}
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 MOODY DESIGNS LIVE VISUAL EDITOR SERVER STARTED!`);
  console.log(`======================================================`);
  console.log(`\n  👉 Open in your browser:  http://localhost:${PORT}/home.html`);
  console.log(`  👉 Or open clean index:   http://localhost:${PORT}/index.html`);
  console.log(`\n  Features enabled:`);
  console.log(`  • ✏️  Click any text on the page to edit directly`);
  console.log(`  • 💾  Click 'Save Changes' (or Ctrl+S) to write to file`);
  console.log(`  • 🔄  Press F5 / Refresh to see your edits persist!`);
  console.log(`  • 🛡️  Automatic timestamped backups in /backups/editor_saves/`);
  console.log(`\n  Press Ctrl + C in this terminal to stop the server.`);
  console.log(`======================================================\n`);
});
