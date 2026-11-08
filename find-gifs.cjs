const fs = require('fs');
const html = fs.readFileSync('C:/Users/pc/Desktop/Website_Project/NEW-Working/index.html', 'utf8');
const gifs = ['vid-01.gif', 'vid-02.gif', 'vid-03.gif', 'vid-04.gif', 'Vid_05.gif', 'Vid_06.gif', 'Vid_07.gif', 'Vid_08.gif'];
gifs.forEach(g => {
  let count = 0;
  let pos = 0;
  while ((pos = html.indexOf(g, pos)) !== -1) {
    count++;
    console.log(`Found ${g} at ${pos}`);
    console.log(html.substring(pos - 200, pos + 200));
    pos += g.length;
  }
  console.log(`${g}: ${count} occurrences`);
});
