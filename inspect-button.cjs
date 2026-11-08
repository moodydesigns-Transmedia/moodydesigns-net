const fs = require('fs');
const htmlOld = fs.readFileSync('C:/Users/pc/Desktop/Website_Project/Old-Working/index.html', 'utf8');
const htmlBroken = fs.readFileSync('C:/Users/pc/Desktop/Website_Project/New-Broken/public/index.html', 'utf8');

const idxOld = htmlOld.indexOf('The OPEN');
console.log('Old-Working around The OPEN:');
console.log(htmlOld.substring(idxOld - 500, idxOld + 2500));

const idxBroken = htmlBroken.indexOf('The OPEN');
console.log('New-Broken around The OPEN:');
console.log(htmlBroken.substring(idxBroken - 500, idxBroken + 2500));
