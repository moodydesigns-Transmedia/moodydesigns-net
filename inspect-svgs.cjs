const fs = require('fs');
const html = fs.readFileSync('C:/Users/pc/Desktop/Website_Project/NEW-Working/index.html', 'utf8');
const idx = html.indexOf('The OPEN');
const slice = html.substring(idx - 1000, idx + 15000);
const svgs = [...slice.matchAll(/<svg[\s\S]*?<\/svg>/g)];
svgs.forEach((s, i) => {
  console.log(`=== SVG ${i} ===`);
  console.log(s[0].substring(0, 500));
  // check if there are paths in svg
  const paths = [...s[0].matchAll(/<path[^>]*d="([^"]+)"/g)].map(p => p[1].substring(0, 100));
  console.log('Paths:', paths);
});
