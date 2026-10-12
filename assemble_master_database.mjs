import fs from 'fs';
import path from 'path';

const e1 = JSON.parse(fs.readFileSync('curated_e1.json', 'utf8'));
const e2 = JSON.parse(fs.readFileSync('curated_e2.json', 'utf8'));
const e3 = JSON.parse(fs.readFileSync('curated_e3.json', 'utf8'));
const em = JSON.parse(fs.readFileSync('curated_model.json', 'utf8'));
const ep = JSON.parse(fs.readFileSync('curated_practice.json', 'utf8'));

// Helper to balance answer distribution across A, B, C, D and keep explanations strictly synchronized
function balanceAndSync(questions, examId) {
  const targetKeys = ['A', 'B', 'C', 'D'];

  return questions.map((q, idx) => {
    const targetKey = targetKeys[idx % 4];
    const oldKey = q.correctAnswer || 'A';

    if (oldKey !== targetKey) {
      // Find current correct option and target option
      const correctOpt = q.options.find(o => o.key === oldKey) || q.options[0];
      const targetOpt = q.options.find(o => o.key === targetKey) || q.options[1];

      // Swap their text
      const tempText = correctOpt.text;
      correctOpt.text = targetOpt.text;
      targetOpt.text = tempText;

      // Update question's correct answer
      q.correctAnswer = targetKey;

      // Update any explicit letter mentions in explanation
      if (q.explanation) {
        q.explanation = q.explanation.replace(
          new RegExp(`\\b(Option|Choice|Answer|Figure)\\s*${oldKey}\\b`, 'gi'),
          `$1 ${targetKey}`
        );
      }
    }

    // Ensure valid on-disk card image
    const pageNum = String(idx + 1).padStart(3, '0');
    const folder = examId === 'exam2' ? 'exam1' : examId;
    const prefix = examId === 'exam2' ? 'exam1' : examId;
    const candidateImg = `public/cards/${folder}/${prefix}_page_${pageNum}.png`;
    if (fs.existsSync(candidateImg)) {
      q.cardImage = candidateImg;
    }

    return q;
  });
}

const balancedE1 = balanceAndSync(e1, 'exam1');
const balancedE2 = balanceAndSync(e2, 'exam2');
const balancedE3 = balanceAndSync(e3, 'exam3');
const balancedEM = balanceAndSync(em, 'model');
const balancedEP = balanceAndSync(ep, 'practice');

// Construct Master Database
const masterDatabase = {
  exams: [
    {
      id: "exam1",
      title: "AMT Exam 1: Mathematics & Applied Computation",
      subject: "Aviation Arithmetic, Algebra, Geometry, Fractions & Applied Physics",
      color: "sky",
      totalQuestions: balancedE1.length,
      questions: balancedE1
    },
    {
      id: "exam2",
      title: "AMT Exam 2: Aviation English Grammar & Syntax",
      subject: "Technical Prepositions, Conditionals, Modals, Concord & Aviation Vocabulary",
      color: "emerald",
      totalQuestions: balancedE2.length,
      questions: balancedE2
    },
    {
      id: "exam3",
      title: "AMT Exam 3: Aviation Reading, Economics & Logic",
      subject: "Technical Comprehension, Critical Reasoning, Gear Mechanics & Aviation Economics",
      color: "amber",
      totalQuestions: balancedE3.length,
      questions: balancedE3
    },
    {
      id: "model",
      title: "AMT Model Exam: Full Comprehensive Simulation",
      subject: "Complete Simulation: Applied Hydraulics, Aerodynamics, Instruments & Electric Circuits",
      color: "purple",
      totalQuestions: balancedEM.length,
      questions: balancedEM
    },
    {
      id: "practice",
      title: "AMT Practice Exam: Technical Grammar, Prepositions & Acoustics",
      subject: "High-Yield Review: Acoustics, Wave Speed, Turbine Fundamentals & Engineering Terminology",
      color: "rose",
      totalQuestions: balancedEP.length,
      questions: balancedEP
    }
  ]
};

// Rigorous Multi-Tier Automated Validation
console.log("=== EXECUTING RIGOROUS MULTI-TIER MASTER DATABASE AUDIT ===");
let totalErrors = 0;
let totalChecked = 0;
const globalStemMap = new Map();

masterDatabase.exams.forEach(exam => {
  console.log(`\nValidating [${exam.id}] ${exam.title} (${exam.questions.length} questions)...`);
  const examStemMap = new Map();
  const answerCounts = { A: 0, B: 0, C: 0, D: 0 };

  exam.questions.forEach((q, idx) => {
    totalChecked++;
    const qNum = idx + 1;
    answerCounts[q.correctAnswer] = (answerCounts[q.correctAnswer] || 0) + 1;

    // 1. Check Question Stem
    if (!q.question || q.question.trim().length < 8) {
      console.error(`[ERROR] ${exam.id} Q${qNum}: Question stem is too short or empty!`);
      totalErrors++;
    }

    // 2. Check for duplicate questions within the exam
    const normStem = q.question.replace(/^\[.*?\]\s*/, '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (examStemMap.has(normStem)) {
      console.error(`[ERROR] ${exam.id} Q${qNum}: DUPLICATE of Q${examStemMap.get(normStem)}: "${q.question.slice(0, 60)}"`);
      totalErrors++;
    } else {
      examStemMap.set(normStem, qNum);
    }

    // 3. Check Exactly 4 Options with keys A, B, C, D
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      console.error(`[ERROR] ${exam.id} Q${qNum}: Must have exactly 4 options!`);
      totalErrors++;
    }

    const keys = q.options.map(o => o.key).join('');
    if (keys !== 'ABCD') {
      console.error(`[ERROR] ${exam.id} Q${qNum}: Option keys are not ABCD: ${keys}`);
      totalErrors++;
    }

    // Check for duplicate or empty option text
    const seenOptText = new Set();
    q.options.forEach(opt => {
      if (!opt.text || opt.text.trim().length === 0) {
        console.error(`[ERROR] ${exam.id} Q${qNum}: Option ${opt.key} has empty text!`);
        totalErrors++;
      }
      const normOpt = opt.text.trim().toLowerCase();
      if (seenOptText.has(normOpt)) {
        console.error(`[ERROR] ${exam.id} Q${qNum}: Option ${opt.key} has duplicate text: "${opt.text}"`);
        totalErrors++;
      }
      seenOptText.add(normOpt);
    });

    // 4. Check Correct Answer
    if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
      console.error(`[ERROR] ${exam.id} Q${qNum}: Invalid correct answer '${q.correctAnswer}'`);
      totalErrors++;
    }

    // 5. Check Explanation
    if (!q.explanation || q.explanation.trim().length < 5) {
      console.error(`[ERROR] ${exam.id} Q${qNum}: Missing or empty explanation!`);
      totalErrors++;
    }

    // 6. Check Explanation Letter Mismatches
    const matches = [...q.explanation.matchAll(/\b(?:Option|Choice|Answer|Figure)\s*([A-D])\b/gi)];
    matches.forEach(m => {
      const letter = m[1].toUpperCase();
      if (letter !== q.correctAnswer) {
        console.error(`[ERROR] ${exam.id} Q${qNum}: Explanation references ${m[0]} but correct answer is ${q.correctAnswer}!`);
        totalErrors++;
      }
    });
  });

  console.log(`  -> Key Distribution: A=${answerCounts.A}, B=${answerCounts.B}, C=${answerCounts.C}, D=${answerCounts.D}`);
});

if (totalErrors > 0) {
  console.error(`\nAUDIT FAILED: Found ${totalErrors} errors across ${totalChecked} questions.`);
  process.exit(1);
}

console.log(`\nALL CHECKS PASSED PERFECTLY! ${totalChecked} questions validated with 0 errors!`);

// Save updated databases
fs.writeFileSync('public/data/exams.json', JSON.stringify(masterDatabase, null, 2));

const jsContent = `// Ethiopian AMT Exam Master - Complete Verified Offline Question Database\nwindow.AMT_EXAMS_DATA = ${JSON.stringify(masterDatabase, null, 2)};\n`;
fs.writeFileSync('public/data/exams-data.js', jsContent);

console.log("Successfully updated public/data/exams.json and public/data/exams-data.js!");
