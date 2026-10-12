import fs from 'fs';
import path from 'path';

// Read all source files
const indexHtml = fs.readFileSync('index.html', 'utf8');
const styleCss = fs.readFileSync('style.css', 'utf8');
const authJs = fs.readFileSync('auth.js', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');
const examsDataJs = fs.readFileSync('public/data/exams-data.js', 'utf8');
const notesDataJs = fs.readFileSync('public/data/notes-data.js', 'utf8');

// Build standalone HTML
let standalone = indexHtml;

// Replace style link with inline style
standalone = standalone.replace(
  /<link rel="stylesheet" href="style\.css.*?">/,
  `<style>\n${styleCss}\n</style>`
);

// Remove external data script tags
standalone = standalone.replace(/<script src="public\/data\/exams-data\.js.*?"><\/script>/, '');
standalone = standalone.replace(/<script src="public\/data\/notes-data\.js.*?"><\/script>/, '');
standalone = standalone.replace(/<script src="auth\.js.*?"><\/script>/, '');
standalone = standalone.replace(/<script src="app\.js.*?"><\/script>/, '');

// Inject all scripts inline before </body>
const injectedScripts = `
<script>
${examsDataJs}
</script>
<script>
${notesDataJs}
</script>
<script>
${authJs}
</script>
<script>
${appJs}
</script>
</body>
`;

standalone = standalone.replace('</body>', injectedScripts);

// Write to Desktop and repo deliverables
const desktopPath = 'C:\\Users\\Dagi 3\\Desktop\\AMT_Exam_Master.html';
const windowsPath = 'AMT_Exam_Windows.html';
const androidPath = 'AMT_Exam_Android.html';

fs.writeFileSync(desktopPath, standalone, 'utf8');
fs.writeFileSync(windowsPath, standalone, 'utf8');
fs.writeFileSync(androidPath, standalone, 'utf8');

console.log('Successfully created standalone single-file apps:');
console.log(' - ' + desktopPath);
console.log(' - ' + windowsPath);
console.log(' - ' + androidPath);
console.log('File size:', (fs.statSync(desktopPath).size / 1024).toFixed(1), 'KB');
