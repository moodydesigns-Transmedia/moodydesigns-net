const fs = require('fs');
const path = require('path');

const directory = 'C:/Users/pc/Desktop/Website_Project/NEW-Working';
const files = fs.readdirSync(directory).filter(file => file.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(directory, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Look for the logo container which is the anchor for the legacy header block
  // The structure seems to be: <div id="[dynamic-id]" style="...grid-area:2 / 5 / 7 / 6...">...<img src="images/moody-design-logo-1.png"...</div>
  // I need to find the DIV that wraps this and remove it.
  
  // This is the specific block found in investors.html
  // <div id="vWCAJaiXwFJD9hpr" style="display:grid;position:relative;grid-area:2 / 5 / 7 / 6;">
  
  // Regex to find the div containing the logo that has grid-area style, 
  // which is characteristic of the legacy Canva layout
  const logoDivRegex = /<div id="[^"]+" style="[^"]*grid-area:[^"]*">[\s\S]*?moody-design-logo-1\.png[\s\S]*?<\/div>/;
  
  // This is still risky. I'll take a safer approach: Just remove the header container based on common ID patterns
  // From previous analysis, the container is often the div directly inside F3t4jMzyyn9ljqeh (or similar dynamic ID)
  // Let's refine the search.
});
console.log('Script prepared. I will refine the removal logic to be safer.');
