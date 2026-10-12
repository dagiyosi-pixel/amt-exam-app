import fs from 'fs';

const data = JSON.parse(fs.readFileSync('public/data/exams.json', 'utf8'));

console.log("=== COMPREHENSIVE QUESTION AUDIT ===");
let totalQuestions = 0;
let issues = [];

data.exams.forEach(exam => {
  console.log(`\nExam: ${exam.title} (${exam.questions.length} Qs)`);
  totalQuestions += exam.questions.length;

  const seenStems = new Map();

  exam.questions.forEach((q, idx) => {
    const qNum = idx + 1;

    // 1. Check duplicate stems
    const cleanStem = q.question.replace(/^\[Q\d+\]\s*/i, '').trim().toLowerCase();
    if (seenStems.has(cleanStem)) {
      issues.push({
        type: 'DUPLICATE_QUESTION',
        exam: exam.id,
        qNum,
        prevNum: seenStems.get(cleanStem) + 1,
        text: q.question.slice(0, 70)
      });
    } else {
      seenStems.set(cleanStem, idx);
    }

    // 2. Check options structure
    if (!q.options || q.options.length !== 4) {
      issues.push({
        type: 'INVALID_OPTIONS_COUNT',
        exam: exam.id,
        qNum,
        count: q.options?.length
      });
    }

    // 3. Check for empty options or duplicate option texts
    const optTexts = new Set();
    q.options?.forEach(opt => {
      if (!opt.text || !opt.text.trim()) {
        issues.push({
          type: 'EMPTY_OPTION_TEXT',
          exam: exam.id,
          qNum,
          key: opt.key
        });
      }
      const normText = opt.text?.trim().toLowerCase();
      if (optTexts.has(normText)) {
        issues.push({
          type: 'DUPLICATE_OPTION_TEXT',
          exam: exam.id,
          qNum,
          key: opt.key,
          text: opt.text
        });
      }
      optTexts.add(normText);
    });

    // 4. Check correct answer key
    if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
      issues.push({
        type: 'INVALID_CORRECT_ANSWER',
        exam: exam.id,
        qNum,
        key: q.correctAnswer
      });
    }

    // 5. Check if correct option exists in options
    const correctOpt = q.options?.find(o => o.key === q.correctAnswer);
    if (!correctOpt) {
      issues.push({
        type: 'CORRECT_OPTION_NOT_FOUND',
        exam: exam.id,
        qNum,
        key: q.correctAnswer
      });
    }

    // 6. Check explanation mentions
    const matches = [...q.explanation.matchAll(/\b(?:Option|Answer|Choice)\s*([A-D])\b/gi)];
    matches.forEach(m => {
      const letter = m[1].toUpperCase();
      if (letter !== q.correctAnswer) {
        issues.push({
          type: 'EXPLANATION_KEY_MISMATCH',
          exam: exam.id,
          qNum,
          correctKey: q.correctAnswer,
          mentioned: m[0],
          explanationExcerpt: q.explanation.slice(0, 90)
        });
      }
    });

    // 7. Check formatting artifacts like raw OCR artifacts, broken HTML, or unrendered tokens
    if (q.question.includes('undefined') || q.question.includes('null') || q.question.includes('[object')) {
      issues.push({
        type: 'CORRUPTED_TEXT',
        exam: exam.id,
        qNum,
        field: 'question'
      });
    }
  });
});

console.log(`\nAudit Complete! Total questions analyzed: ${totalQuestions}`);
console.log(`Total anomalies found: ${issues.length}\n`);

issues.forEach((iss, i) => {
  console.log(`${i + 1}. [${iss.type}] in ${iss.exam} Q${iss.qNum}:`, JSON.stringify(iss));
});
