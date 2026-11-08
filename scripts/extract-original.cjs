const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('D:\\Work\\Moodydesigns Corp\\Moodydesigns Website\\NEW-Working v3.0\\index.html', 'utf8');

// Extract images
const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
let match;
const images = [];
while ((match = imgRegex.exec(html)) !== null) {
  const altMatch = match[0].match(/alt=["']([^"']*)["']/i);
  images.push({ src: match[1], alt: altMatch ? altMatch[1] : '' });
}

console.log('=== IMAGES FOUND (' + images.length + ') ===');
const uniqueImages = [...new Set(images.map(i => i.src))];
uniqueImages.forEach(src => console.log(src));

// Extract all text chunks
// Notice SVG text elements or span text elements
const textElements = [];
const textRegex = /<(?:span|p|h1|h2|h3|h4|h5|h6|a|div|text)[^>]*>([^<]+)<\/(?:span|p|h1|h2|h3|h4|h5|h6|a|div|text)>/gi;
while ((match = textRegex.exec(html)) !== null) {
  const text = match[1].trim();
  if (text.length > 1 && !text.includes('{') && !text.includes('function')) {
    textElements.push(text);
  }
}

console.log('\n=== TEXT ELEMENTS EXTRACTED (' + textElements.length + ') ===');
// Filter unique/sequential
console.log(textElements.filter((v, i, a) => a.indexOf(v) === i).join('\n'));
