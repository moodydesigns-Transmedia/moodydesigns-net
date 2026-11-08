const fs = require('fs');
const html = fs.readFileSync('C:/Users/pc/Desktop/Website_Project/NEW-Working/index.html', 'utf8');
const idx = html.indexOf('The OPEN');
if (idx !== -1) {
  const slice = html.substring(idx - 2000, idx + 15000);
  const imgs = [...slice.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/g)].map(m => m[1]);
  console.log('Images in this section:', imgs);

  const svgs = [...slice.matchAll(/<svg[^>]*>([\s\S]*?)<\/svg>/g)].map(m => m[0].substring(0, 150));
  console.log('SVGs in this section count:', svgs.length);
  
  // Find all elements with background or paths that might look like a hand/finger
  const divs = [...slice.matchAll(/<div id="([^"]+)"[^>]*>/g)].map(m => m[1]);
  console.log('Div IDs count:', divs.length);
}
