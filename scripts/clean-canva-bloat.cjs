const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'backups', 'pre_canva_cleanup');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function cleanCanvaBloat(content) {
  let modified = content;

  // 1. Remove all scripts containing C_CAPTCHA (window.C_CAPTCHA_..., and the _footer / report script)
  const safeCaptchaRegex = /<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?C_CAPTCHA(?:(?!<\/script>)[\s\S])*?<\/script>\s*/gi;
  modified = modified.replace(safeCaptchaRegex, '');

  // 2. Remove any remaining scripts referencing _footer if any exist
  const safeFooterRegex = /<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?_footer\?lang=(?:(?!<\/script>)[\s\S])*?<\/script>\s*/gi;
  modified = modified.replace(safeFooterRegex, '');

  // 3. Neutralize contextmenu blocker (allows user to right click freely)
  modified = modified.replace(
    /document\.querySelectorAll\("img, image, video, svg"\)\.forEach\(\(t=>t\.addEventListener\("contextmenu",\(t=>t\.preventDefault\(\)\)\)\)\)/g,
    '/* right-click enabled */'
  );

  // 4. Neutralize analytics events
  modified = modified.replace(
    /fetch\("_api\/analytics\/events",\{method:"POST",headers:\{"Content-Type":"application\/json"\},body:JSON\.stringify\(e\)\}\)/g,
    '/* analytics disabled */'
  );

  return modified;
}

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
console.log(`Processing ${htmlFiles.length} HTML files...`);

let cleanedCount = 0;
htmlFiles.forEach(file => {
  const filePath = path.join('.', file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check if file has Canva markers
  const hasCanva = content.includes('C_CAPTCHA') || 
                   content.includes('_footer?lang=') || 
                   content.includes('_api/analytics/events') ||
                   content.includes('contextmenu');

  if (hasCanva) {
    // 1. Backup original file
    const backupPath = path.join(BACKUP_DIR, file);
    fs.writeFileSync(backupPath, content, 'utf8');

    // 2. Clean content
    const cleaned = cleanCanvaBloat(content);

    // 3. Sanity check: must end with </html> and not lose massive content unintentionally
    if (!cleaned.trim().endsWith('</html>')) {
      console.error(`ERROR: Cleaning ${file} produced malformed HTML! Aborting for this file.`);
      return;
    }
    const byteDiff = content.length - cleaned.length;
    if (byteDiff < 0 || byteDiff > 20000) {
      console.warn(`WARNING: ${file} byte difference is unusual (${byteDiff} bytes).`);
    }

    fs.writeFileSync(filePath, cleaned, 'utf8');
    cleanedCount++;
    console.log(`✓ Cleaned ${file}: Removed ${byteDiff} bytes of Canva bloat. (Backup: ${backupPath})`);
  } else {
    console.log(`- Skipped ${file} (no Canva bloat detected).`);
  }
});

console.log(`\nSuccessfully cleaned ${cleanedCount} files.`);
