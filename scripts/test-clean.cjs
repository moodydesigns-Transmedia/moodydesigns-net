const fs = require('fs');

function cleanCanvaBloat(content) {
  let modified = content;

  // 1. Remove all scripts containing C_CAPTCHA (this cleanly removes window.C_CAPTCHA_..., and the _footer / report script)
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

const original = fs.readFileSync('ZZ.html', 'utf8');
const cleaned = cleanCanvaBloat(original);

console.log('Original length:', original.length);
console.log('Cleaned length:', cleaned.length);
console.log('Total bytes removed:', original.length - cleaned.length);

console.log('Contains _footer?:', cleaned.includes('_footer'));
console.log('Contains C_CAPTCHA?:', cleaned.includes('C_CAPTCHA'));
console.log('Contains _api/analytics?:', cleaned.includes('_api/analytics'));
console.log('Right-click blocker neutralized?:', cleaned.includes('/* right-click enabled */'));
console.log('HTML structure intact (ends with </html>)?:', cleaned.trim().endsWith('</html>'));
