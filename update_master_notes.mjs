import fs from 'fs';

let content = fs.readFileSync('build_master_notes.mjs', 'utf8');

const replacements = [
  ['title: "Part 1: Reading Comprehension Strategies & Technical Analysis",', 'title: "Part 1: Reading Comprehension Strategies & Technical Analysis",\n    shortTitle: "Part 1: Reading",'],
  ['title: "Part 2: English Grammar, Syntax, Conditionals & Prepositions",', 'title: "Part 2: English Grammar, Syntax, Conditionals & Prepositions",\n    shortTitle: "Part 2: Grammar",'],
  ['title: "Part 3: Technical Aviation Vocabulary, Synonyms & Antonyms",', 'title: "Part 3: Technical Aviation Vocabulary, Synonyms & Antonyms",\n    shortTitle: "Part 3: Vocab",'],
  ['title: "Part 4: Verbal Analogies & Linguistic Reasoning",', 'title: "Part 4: Verbal Analogies & Linguistic Reasoning",\n    shortTitle: "Part 4: Verbal",'],
  ['title: "Part 5: Master Mathematics Curriculum (Probability, Binary, Functions, Geometry & Fractions)",', 'title: "Part 5: Master Mathematics Curriculum (Probability, Binary, Functions, Geometry & Fractions)",\n    shortTitle: "Part 5: Mathematics 📐",'],
  ['title: "Part 6: Critical Reasoning & Deductive Logic",', 'title: "Part 6: Critical Reasoning & Deductive Logic",\n    shortTitle: "Part 6: Logic",'],
  ['title: "Part 7: Mechanical Reasoning, Simple Machines & Levers",', 'title: "Part 7: Mechanical Reasoning, Simple Machines & Levers",\n    shortTitle: "Part 7: Levers & Machines ⚙️",'],
  ['title: "Part 8: Spatial, Pattern & Diagrammatic Reasoning",', 'title: "Part 8: Spatial, Pattern & Diagrammatic Reasoning",\n    shortTitle: "Part 8: Spatial",'],
  ['title: "Part 9: Aviation Physics, Thermodynamics, Circuits, Charges & Magnetism",', 'title: "Part 9: Aviation Physics, Thermodynamics, Circuits, Charges & Magnetism",\n    shortTitle: "Part 9: Aviation Physics ⚡",'],
  ['title: "Part 10: High-Yield Exam Traps & Rapid Recall Cheat Sheet",', 'title: "Part 10: High-Yield Exam Traps & Rapid Recall Cheat Sheet",\n    shortTitle: "Part 10: Exam Traps 🎯",']
];

for (const [target, repl] of replacements) {
  content = content.replace(target, repl);
}

fs.writeFileSync('build_master_notes.mjs', content, 'utf8');
console.log('Successfully updated build_master_notes.mjs!');
