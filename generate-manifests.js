/**
 * MOODYDESIGNS SOVEREIGN OVERLAY WIDGET — MANIFEST GENERATOR
 * Walks /assets/sectors/*, parses audio and visual media, and produces:
 *  1. /assets/sectors/<id>/manifest.json per sector
 *  2. /assets/sectors/index.json defining sector playback order
 */

const fs = require('fs');
const path = require('path');

const SECTORS_DIR = path.join(__dirname, 'assets', 'sectors');
const GLOBAL_INDEX_PATH = path.join(SECTORS_DIR, 'index.json');

// Default metadata dictionary for known DeepVoid Sovereign Sectors
const SECTOR_METADATA = {
  'bali-2111': {
    displayName: 'The Bamboo Sanctuaries - (Sector A)',
    listeningTo: 'BALI 2111',
    durationHint: '00:07:08',
    htmlPage: 'bali-2111.html'
  },
  'egypt-2222': {
    displayName: 'New Alexandria Citadel - (Sector B)',
    listeningTo: 'ALEXANDRIA 2222',
    durationHint: '00:06:45',
    htmlPage: 'egypt-2222.html'
  },
  'egypt-2030': {
    displayName: 'The P-AB Habitat - Abundance Engine',
    listeningTo: 'GIZA 2030',
    durationHint: '00:05:32',
    htmlPage: 'egypt-2030.html'
  },
  'cyber-kings-2055': {
    displayName: 'The Moloch Wastes - Sector 11 Arena',
    listeningTo: 'CYBER KINGS 2055',
    durationHint: '00:08:15',
    htmlPage: 'cyber-kings-2055.html'
  },
  'escape-island': {
    displayName: 'The Sovereign Refuge - Encrypted Node',
    listeningTo: 'ESCAPE ISLAND',
    durationHint: '00:06:20',
    htmlPage: 'escape-island.html'
  }
};

// Natural sort for filenames like Bali (1).jpg, Bali (2).jpg, Bali (10).jpg
function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function generateManifests() {
  if (!fs.existsSync(SECTORS_DIR)) {
    console.error(`Sectors directory not found: ${SECTORS_DIR}`);
    process.exit(1);
  }

  const entries = fs.readdirSync(SECTORS_DIR, { withFileTypes: true });
  const sectorIds = [];

  entries.forEach(entry => {
    if (!entry.isDirectory()) return;
    const sectorId = entry.name;
    const sectorPath = path.join(SECTORS_DIR, sectorId);

    // Skip UI assets or internal dirs if any
    if (sectorId.startsWith('.') || sectorId.toLowerCase() === 'ui-images') return;

    sectorIds.push(sectorId);
    console.log(`Processing sector: ${sectorId}...`);

    // Check for images in /images/ subdir or sector root
    let imagesDir = path.join(sectorPath, 'images');
    let imagePrefix = 'images/';
    if (!fs.existsSync(imagesDir)) {
      imagesDir = sectorPath;
      imagePrefix = '';
    }

    const imageExts = /\.(jpg|jpeg|png|webp|avif)$/i;
    const allFiles = fs.readdirSync(imagesDir);
    const images = allFiles
      .filter(f => imageExts.test(f) && !f.toLowerCase().includes('ui-') && !f.toLowerCase().includes('icon'))
      .sort(naturalSort)
      .map(f => (imagePrefix ? path.posix.join(imagePrefix, f) : f));

    // Check for audio in /audio/ subdir or sector root
    let audioDir = path.join(sectorPath, 'audio');
    let audioPrefix = 'audio/';
    if (!fs.existsSync(audioDir)) {
      audioDir = sectorPath;
      audioPrefix = '';
    }

    const audioExts = /\.(wav|mp3|ogg|m4a|aac)$/i;
    const audioFiles = fs.readdirSync(audioDir).filter(f => audioExts.test(f));
    let audioFile = audioFiles.length > 0 ? (audioPrefix ? path.posix.join(audioPrefix, audioFiles[0]) : audioFiles[0]) : '';

    const meta = SECTOR_METADATA[sectorId] || {
      displayName: sectorId.replace(/-/g, ' ').toUpperCase(),
      listeningTo: sectorId.toUpperCase(),
      durationHint: '00:07:08',
      htmlPage: `${sectorId}.html`
    };

    const manifest = {
      id: sectorId,
      displayName: meta.displayName,
      listeningTo: meta.listeningTo,
      durationHint: meta.durationHint,
      audioFile: audioFile,
      htmlPage: meta.htmlPage,
      images: images
    };

    const manifestPath = path.join(sectorPath, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`  -> Wrote manifest.json (${images.length} images, audio: ${audioFile})`);
  });

  // Write global index
  fs.writeFileSync(GLOBAL_INDEX_PATH, JSON.stringify(sectorIds, null, 2), 'utf8');
  console.log(`Wrote global sector index: ${GLOBAL_INDEX_PATH} -> [${sectorIds.join(', ')}]`);
}

generateManifests();
