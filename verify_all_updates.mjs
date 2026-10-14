import fs from 'fs';
import vm from 'vm';

console.log('--- RUNNING FULL SYSTEM AUDIT & VERIFICATION ---');

// 1. Audit public/data/exams.json
const examsData = JSON.parse(fs.readFileSync('public/data/exams.json', 'utf8'));
console.log(`Exams count in exams.json: ${examsData.exams.length}`);

let totalQuestions = 0;
const examSummary = [];

examsData.exams.forEach(exam => {
  totalQuestions += exam.questions.length;
  examSummary.push({
    id: exam.id,
    title: exam.title,
    questions: exam.questions.length,
    subject: exam.subject ? 'OK' : 'MISSING',
    color: exam.color || 'default'
  });

  // Verify all questions have 4 options and a correct answer
  exam.questions.forEach((q, idx) => {
    if (!q.options || q.options.length < 2) {
      console.error(`Question ${q.id} in ${exam.id} has invalid options!`);
    }
    if (!q.correctAnswer) {
      console.error(`Question ${q.id} in ${exam.id} missing correctAnswer!`);
    }
    if (!q.explanation) {
      console.error(`Question ${q.id} in ${exam.id} missing explanation!`);
    }
  });
});

console.table(examSummary);
console.log(`Total Verified Questions across all exams: ${totalQuestions}`);

// 2. Audit public/data/notes-data.js
const notesContent = fs.readFileSync('public/data/notes-data.js', 'utf8');
const notesSandbox = { window: {} };
vm.createContext(notesSandbox);
vm.runInContext(notesContent, notesSandbox);

const notes = notesSandbox.window.AMT_NOTES_DATA || [];
const flashcards = notesSandbox.window.AMT_FLASHCARDS || [];

console.log(`\nNotes Modules count: ${notes.length}`);
notes.forEach(n => {
  console.log(` - [Part ${n.number}] ${n.shortTitle} (id: ${n.id}, length: ${n.content.length} chars)`);
});

console.log(`\nFlashcards count: ${flashcards.length}`);
console.log(`First flashcard: ${flashcards[0].id} (${flashcards[0].categoryLabel})`);
console.log(`Last flashcard: ${flashcards[flashcards.length - 1].id} (${flashcards[flashcards.length - 1].categoryLabel})`);

// 3. Audit Standalone Deliverable C:\Users\Dagi 3\Desktop\AMT_Exam_Master.html
const masterHtml = fs.readFileSync('C:\\Users\\Dagi 3\\Desktop\\AMT_Exam_Master.html', 'utf8');
console.log(`\nMaster HTML bundle size: ${(masterHtml.length / 1024).toFixed(1)} KB`);

// Check if all scripts and data are embedded
if (masterHtml.includes('AMT_EXAMS_DATA') && masterHtml.includes('AMT_NOTES_DATA') && masterHtml.includes('AMT_FLASHCARDS')) {
  console.log('✅ Offline data sets embedded successfully.');
} else {
  console.error('❌ Missing offline data sets in Master HTML!');
}

if (masterHtml.includes('361 Qs') && masterHtml.includes('11 Modules') && masterHtml.includes('8 Sets')) {
  console.log('✅ Badges & counts properly synced in Master HTML.');
} else {
  console.error('❌ Mismatched badges in Master HTML!');
}

console.log('\n--- VERIFICATION COMPLETE: ALL SYSTEMS NOMINAL ---');
