import fs from 'fs';

const txt = fs.readFileSync('public/data/exams-data.js', 'utf8');
const match = txt.match(/window\.AMT_EXAMS_DATA\s*=\s*(\{[\s\S]*\});/);
if (match) {
  const data = JSON.parse(match[1]);
  console.log(`=== VERIFIED EXAM DATABASE ===`);
  console.log(`Total Exam Sets: ${data.exams.length}`);
  let grandTotal = 0;
  data.exams.forEach((exam, idx) => {
    console.log(`${idx + 1}. [${exam.id.toUpperCase()}] ${exam.title}: ${exam.questions.length} Questions`);
    grandTotal += exam.questions.length;
  });
  console.log(`================================`);
  console.log(`GRAND TOTAL VERIFIED QUESTIONS: ${grandTotal}`);
} else {
  console.log('Failed to match window.AMT_EXAMS_DATA');
}
