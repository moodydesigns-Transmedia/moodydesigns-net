const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log(`
Usage:
  node scripts/find-replace.cjs "Search String" "Replacement String" [optional-specific-file.html]

Examples:
  node scripts/find-replace.cjs "Old Title" "New Title"
  node scripts/find-replace.cjs "support@old.com" "sales@moodydesigns.net" home.html
  `);
  process.exit(1);
}

const searchText = args[0];
const replaceText = args[1];
const targetSpecificFile = args[2];

const BACKUP_DIR = path.join(__dirname, '..', 'backups', 'find_replace');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

let filesToProcess = [];
if (targetSpecificFile) {
  if (fs.existsSync(targetSpecificFile)) {
    filesToProcess = [targetSpecificFile];
  } else {
    console.error(`Error: File not found: ${targetSpecificFile}`);
    process.exit(1);
  }
} else {
  filesToProcess = fs.readdirSync('.').filter(f => f.endsWith('.html'));
}

console.log(`\nSearching for: "${searchText}"`);
console.log(`Replacing with: "${replaceText}"\n`);

let totalReplacements = 0;
let modifiedFiles = 0;

filesToProcess.forEach(file => {
  const filePath = path.join('.', file);
  const content = fs.readFileSync(filePath, 'utf8');

  if (content.includes(searchText)) {
    // Count occurrences
    const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    const count = matches ? matches.length : 0;

    // Backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `${file}_${timestamp}.bak`);
    fs.writeFileSync(backupPath, content, 'utf8');

    // Replace
    const updated = content.replace(regex, replaceText);
    fs.writeFileSync(filePath, updated, 'utf8');

    console.log(`✓ ${file}: Replaced ${count} occurrence(s). Backup saved.`);
    totalReplacements += count;
    modifiedFiles++;
  }
});

console.log(`\nDone! Replaced ${totalReplacements} occurrence(s) across ${modifiedFiles} file(s).`);
