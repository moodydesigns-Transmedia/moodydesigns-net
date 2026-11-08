const fs = require('fs');

const content = fs.readFileSync('home.html', 'utf8');

// Find all script tags
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let i = 0;
while ((match = scriptRegex.exec(content)) !== null) {
  i++;
  const fullTag = match[0];
  const inner = match[1];
  console.log(`\n--- Script #${i} (Length: ${fullTag.length}) ---`);
  if (fullTag.includes('C_CAPTCHA')) {
    console.log('TYPE: Captcha script');
    console.log(fullTag);
  } else if (fullTag.includes('_footer?lang=')) {
    console.log('TYPE: Canva footer script');
    console.log(fullTag.slice(0, 200) + '...' + fullTag.slice(-100));
  } else if (inner.includes('canva_scriptExecutor') || inner.includes('canva_debounceResize')) {
    console.log('TYPE: Canva runtime script');
    // check contextmenu and analytics
    console.log('Includes contextmenu:', inner.includes('contextmenu'));
    console.log('Includes _api/analytics:', inner.includes('_api/analytics/events'));
  } else {
    console.log('TYPE: Other script: ' + fullTag.slice(0, 100));
  }
}
