import fs from 'fs';

// Read existing notes-data.js
let notesFileContent = fs.readFileSync('public/data/notes-data.js', 'utf8');

// Parse window.AMT_NOTES_DATA and window.AMT_FLASHCARDS
// We can use a clean regex or evaluate in a sandboxed vm
import vm from 'vm';
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(notesFileContent, sandbox);

const notesData = sandbox.window.AMT_NOTES_DATA || [];
const flashcards = sandbox.window.AMT_FLASHCARDS || [];

console.log(`Current Notes Modules: ${notesData.length}`);
console.log(`Current Flashcards: ${flashcards.length}`);

// Define Module 11
const module11 = {
  id: "part11",
  number: 11,
  title: "Part 11: Master English Verb Tenses & Aviation Grammar",
  shortTitle: "Part 11: Verb Tenses ⏳",
  icon: "clock",
  content: `11.1 The Complete 12-Tense Aviation Timeline Matrix
Every single verb tense in technical English is built at the intersection of TIME (Past, Present, Future) and ASPECT (Simple, Progressive, Perfect, Perfect Progressive).

• Simple Aspect (The Fact & Habit Engine):
- Present Simple (V1 / V1+s): Expresses universal physical truths, regular maintenance habits, and scheduled flight operations.
  "The Boeing 787 cruises at Mach 0.85; Flight ET 500 departs at 08:00 UTC."
- Past Simple (V2 / verb+ed): A completed historical action with an explicit or understood past timestamp.
  "The technician replaced the fuel control unit yesterday."
- Future Simple (will + V1): Instant decisions, predictions, and future commitments.
  "Hydraulic pressure is dropping; I will shut down the pump immediately."

• Progressive / Continuous Aspect (The Action-in-Motion Engine):
- Present Progressive (am/is/are + V-ing): Action taking place right at this exact moment.
  "Technicians are calibrating the weather radar right now."
- Past Progressive (was/were + V-ing): Ongoing past action interrupted by a sudden past simple event.
  "We were inspecting the engine cowling when the hangar siren sounded."
- Future Progressive (will be + V-ing): Action in continuous motion at a specific future benchmark.
  "At 10:00 AM tomorrow, the inspectors will be evaluating turbine clearances."

• Perfect Aspect (The Bridge to the Present & Past Deadlines):
- Present Perfect (have/has + V3 past participle): Action completed before now with direct relevance to the current situation. Never pair with specific past timestamps like 'yesterday'!
  "The ground crew has completed the pre-flight checklist [so the aircraft is ready right now]."
- Past Perfect (had + V3): The 'Past of the Past'! Occurred strictly before another past action.
  "The mechanics had completed the pressure test before the inspector arrived."
- Future Perfect (will have + V3): Guaranteed completion before a specific future deadline.
  "By Friday afternoon, the engineering shop will have overhauled five landing gear assemblies."

• Perfect Progressive Aspect (The Duration & Stamina Engine):
- Present Perfect Progressive (have/has been + V-ing): Began in the past and continues right now into the present.
  "She has been logging aircraft telemetry data for four consecutive hours."
- Past Perfect Progressive (had been + V-ing): Past ongoing duration leading up to another past event.
  "The generator had been vibrating erratically for thirty minutes before it tripped the circuit breaker."
- Future Perfect Progressive (will have been + V-ing): Ongoing duration measured at a future milestone.
  "By December, the chief avionics engineer will have been serving Ethiopian Airlines for 25 years."

11.2 The Past Participle (V3) Vault & Irregular Verbs
📐 Regular verbs add -ed (inspected, calibrated, torqued).
Irregular verbs use special forms ending in -en, -n, -t, or vowel shifts:
• write → wrote → written
• fly → flew → flown
• drive → drove → driven
• break → broke → broken
• freeze → froze → frozen
• rise → rose → risen
• run → ran → run

11.3 Top 4 Exam Tense Traps (Deliberately Placed in EAU & Ethiopian Papers)
🚨 [TRAP 1: The 'Since / For' Timestamp Trap]:
With 'since' (point in time) or 'for' (duration), ALWAYS use Present Perfect or Present Perfect Progressive—NEVER Present Simple!
- ❌ Wrong: "I work at Ethiopian Airlines since 2018."
- ✅ Right: "I have worked / have been working at Ethiopian Airlines since 2018."

🚨 [TRAP 2: The Specific Past Timestamp Ambush]:
When a sentence specifies a closed past time ('yesterday', 'in 1995', 'three hours ago'), you MUST use Past Simple (V2), NOT Present Perfect!
- ❌ Wrong: "The inspector has signed the logbook yesterday."
- ✅ Right: "The inspector signed the logbook yesterday."

🚨 [TRAP 3: The 'By the time...' Past Perfect Anchor]:
"By the time + Past Simple clause, the main clause MUST be Past Perfect (had + V3)!"
- "By the time the tug arrived, the pilot had already started the auxiliary power unit."

🚨 [TRAP 4: The 'By next...' Future Perfect Anchor]:
"By [future time], Subject + will have + V3!"
- "By next month, the academy will have certified thirty new AMT apprentices."

11.4 Hangar Reality: Aircraft Maintenance Logs & Operational Concord
✈️ [HANGAR SECRET]: Why does the Ethiopian Civil Aviation Authority mandate exact verb tenses in aircraft technical logs?
• Closed Defects: Written strictly in Past Simple (V2): "Removed and replaced No. 1 hydraulic servo actuator. Operational check carried out satisfactory."
• Open Deferrals (MEL): Written in Present Perfect: "Right generator has been deferred under Minimum Equipment List Item 24-20-01."
• Active Maintenance: Written in Present Progressive: "Line crew currently troubleshooting cabin pressurization controller."

🧠 [POP QUIZ 1]: "By the time the Boeing 787 touched down, the ramp agents ___ (staged / had staged) the passenger stairs." || HAD STAGED! ('By the time + past action' requires Past Perfect for the earlier event).
🧠 [POP QUIZ 2]: "The lead avionics technician ___ (works / has been working) on this radar issue since 7:00 AM." || HAS BEEN WORKING! (Actions beginning in the past and continuing through present with 'since' require Present Perfect Progressive).
🧠 [POP QUIZ 3]: "By 18:00 UTC tomorrow, the maintenance team ___ (will finish / will have finished) the A-Check." || WILL HAVE FINISHED! ('By + future deadline' requires Future Perfect 'will have + V3').`
};

// Check if part11 already exists, replace or add
const updatedNotes = notesData.filter(n => n.id !== 'part11');
updatedNotes.push(module11);

// Define 10 New Flashcards (fc-51 to fc-60)
const newFlashcards = [
  {
    "id": "fc-51",
    "num": 51,
    "module": 11,
    "category": "english",
    "categoryLabel": "12 Verb Tenses",
    "icon": "⏳",
    "type": "📐 Formula Master",
    "front": "What are the core formulas for the 4 English Aspect Families (Simple, Progressive, Perfect, Perfect Progressive)?",
    "back": "⏳ The 4 Aspect Formula Keys:\n\n1. Simple: V1 (Present) | V2 (Past) | will + V1 (Future)\n2. Progressive: am/is/are/was/were/will be + V-ing\n3. Perfect: have/has/had/will have + V3 (Past Participle)\n4. Perfect Progressive: have/has/had/will have + been + V-ing\n\nAspect indicates whether an action is a factual habit, in continuous motion, completed before a benchmark, or an ongoing duration!",
    "formula": "Simple: V | Progressive: be + V-ing | Perfect: have + V3 | Perf-Prog: have been + V-ing",
    "badgeColor": "emerald"
  },
  {
    "id": "fc-52",
    "num": 52,
    "module": 11,
    "category": "english",
    "categoryLabel": "Verb Tenses & Concord",
    "icon": "⏳",
    "type": "💡 Aha! Mnemonic",
    "front": "The 'Past of the Past' Anchor: When two events occurred in the past, how do you decide between Past Simple and Past Perfect?",
    "back": "💡 The Earlier Event ALWAYS gets Past Perfect (had + V3)!\n\n• Event 1 (Earlier): had + V3\n• Event 2 (Later): V2 (Past Simple)\n\nExample: 'The aircraft had already departed before the passenger arrived at the gate.'\n(Departed = Event 1 → had departed; Arrived = Event 2 → arrived).",
    "formula": "Earlier Past = had + V3 | Later Past = V2",
    "badgeColor": "sky"
  },
  {
    "id": "fc-53",
    "num": 53,
    "module": 11,
    "category": "english",
    "categoryLabel": "Verb Tenses",
    "icon": "⏳",
    "type": "⚡ Speed Shortcut",
    "front": "The 'By + Future Deadline' Rule: Fill in the blank: 'By 5:00 PM tomorrow, the avionics shop ___ (will inspect / will have inspected) all 12 radar units.'",
    "back": "⚡ Correct: 'will have inspected'!\n\nWhenever a sentence specifies 'By [future time]' (e.g., By tomorrow, By next year, By Tuesday), the action will be finished prior to that deadline.\n\n📐 Future Perfect Formula: will + have + Past Participle (V3).",
    "formula": "By [Future Time] → will have + V3",
    "badgeColor": "amber"
  },
  {
    "id": "fc-54",
    "num": 54,
    "module": 11,
    "category": "english",
    "categoryLabel": "Verb Tenses",
    "icon": "⏳",
    "type": "🚨 Exam Trap Alert",
    "front": "The Forbidden Timestamp Trap: Why is 'The mechanic has repaired the hydraulic valve yesterday' strictly WRONG on the exam?",
    "back": "🚨 Present Perfect (has/have + V3) can NEVER be paired with a specific, finished past timestamp (yesterday, in 2015, two hours ago)!\n\n• ❌ Wrong: 'He has inspected it yesterday.'\n• ✅ Right: 'He inspected it yesterday.' (Past Simple)\n• ✅ Right: 'He has inspected it already.' (Present Perfect, unspecified time).",
    "formula": "Specific Past Time → Past Simple (V2) ONLY",
    "badgeColor": "rose"
  },
  {
    "id": "fc-55",
    "num": 55,
    "module": 3,
    "category": "english",
    "categoryLabel": "Aviation Vocabulary",
    "icon": "📖",
    "type": "📖 Vocab Vault",
    "front": "What is the technical definition and antonym of the official exam vocabulary word SATURNINE?",
    "back": "📖 SATURNINE:\n• Meaning: Gloomy, dark, sullen, morose, sluggish, taciturn in temperament.\n  (e.g., 'The supervisor had a saturnine disposition during crisis audits').\n\n• Direct Antonyms (Opposites): JOVIAL, cheerful, lively, sanguine, optimistic.",
    "formula": "SATURNINE (Sullen/Gloomy) ↔ JOVIAL (Cheerful)",
    "badgeColor": "purple"
  },
  {
    "id": "fc-56",
    "num": 56,
    "module": 3,
    "category": "english",
    "categoryLabel": "Aviation Vocabulary",
    "icon": "📖",
    "type": "📖 Vocab Vault",
    "front": "What is the technical definition and antonym of the official exam vocabulary word OSTENSIBLE?",
    "back": "📖 OSTENSIBLE:\n• Meaning: Stated or appearing to be true on the surface, but not necessarily so; apparent, outwardly professed.\n  (e.g., 'The ostensible reason for the flight diversion was weather, though a fuel valve failed').\n\n• Direct Antonyms (Opposites): GENUINE, actual, real, hidden, authentic.",
    "formula": "OSTENSIBLE (Apparent/Surface) ↔ GENUINE / ACTUAL",
    "badgeColor": "amber"
  },
  {
    "id": "fc-57",
    "num": 57,
    "module": 3,
    "category": "english",
    "categoryLabel": "Aviation Vocabulary",
    "icon": "📖",
    "type": "📖 Vocab Vault",
    "front": "What is the technical definition and antonym of the official exam vocabulary word VILIFY?",
    "back": "📖 VILIFY:\n• Meaning: To speak ill of, defame, slander, malign, denigrate, or disparage maliciously.\n  (e.g., 'Do not vilify a technician for self-reporting an honest procedural deviation').\n\n• Direct Antonyms (Opposites): PRAISE, commend, extol, laud, eulogize.",
    "formula": "VILIFY (Slander/Defame) ↔ PRAISE / COMMEND",
    "badgeColor": "rose"
  },
  {
    "id": "fc-58",
    "num": 58,
    "module": 9,
    "category": "physics",
    "categoryLabel": "Kinematics & Motion",
    "icon": "⚡",
    "type": "🚨 Exam Trap Alert",
    "front": "A runner completes one full 400-meter oval lap in 80 seconds, returning to the exact starting line. What is their average speed vs. average velocity?",
    "back": "🚨 The Closed-Loop Displacement Trap:\n\n• Average Speed = Total Distance / Time = 400 m / 80 s = 5.0 m/s!\n• Average Velocity = Net Displacement / Time = 0 m / 80 s = 0 m/s!\n\n💡 Why? Velocity depends on net change in position (Δx). If you start and end at the same spot, Δx = 0, so average velocity is strictly 0!",
    "formula": "v_avg = Δx / Δt = 0 (on any closed loop)",
    "badgeColor": "sky"
  },
  {
    "id": "fc-59",
    "num": 59,
    "module": 9,
    "category": "physics",
    "categoryLabel": "Dynamics & Pulleys",
    "icon": "⚡",
    "type": "📐 Formula Master",
    "front": "Atwood Machine: Two masses m1 (400 N) and m2 (600 N) hang over a frictionless pulley. What is the acceleration of the system?",
    "back": "📐 The Atwood Machine Formula:\n\n📐 a = g × (m₂ - m₁) / (m₁ + m₂)\n\n• Since Weight W = mg, the ratio of masses equals the ratio of weights:\n  a = 9.8 × (600 - 400) / (600 + 400) = 9.8 × (200 / 1000) = 9.8 × 0.2 = 1.96 m/s²!\n\n💡 System accelerates towards the heavier mass with fraction (Δm / M_total) of gravity.",
    "formula": "a = g(m₂ - m₁) / (m₁ + m₂)",
    "badgeColor": "emerald"
  },
  {
    "id": "fc-60",
    "num": 60,
    "module": 5,
    "category": "math",
    "categoryLabel": "Applied Math & Physics",
    "icon": "📐",
    "type": "🚨 Exam Trap Alert",
    "front": "Round-Trip Average Speed Trap: A drone flies to an outpost at 40 km/h and returns along the same route at 60 km/h. Is the average speed 50 km/h?",
    "back": "🚨 NO! It is NOT (40 + 60)/2 = 50 km/h! The drone spends more time flying at the slower speed!\n\n⚡ Round-Trip Harmonic Mean Formula:\n📐 v_avg = 2 · v₁ · v₂ / (v₁ + v₂)\n\n• v_avg = 2(40)(60) / (40 + 60) = 4800 / 100 = 48 km/h!\n\nRule: When distances are equal, average speed is always the harmonic mean, which is strictly less than the arithmetic mean!",
    "formula": "v_avg = 2 v₁ v₂ / (v₁ + v₂)",
    "badgeColor": "rose"
  }
];

// Filter out fc-51 to fc-60 if already present, then append
const updatedFlashcards = flashcards.filter(f => !newFlashcards.some(nf => nf.id === f.id));
updatedFlashcards.push(...newFlashcards);

console.log(`Updated Notes Modules: ${updatedNotes.length}`);
console.log(`Updated Flashcards: ${updatedFlashcards.length}`);

const outputJs = `// Ethiopian AMT Exam Master - Complete Official Notes & Formulas\nwindow.AMT_NOTES_DATA = ${JSON.stringify(updatedNotes, null, 2)};\n\n// Ethiopian AMT Exam Master - High-Yield Flashcards Dataset\nwindow.AMT_FLASHCARDS = ${JSON.stringify(updatedFlashcards, null, 2)};\n`;

fs.writeFileSync('public/data/notes-data.js', outputJs, 'utf8');
console.log('Successfully written Module 11 and 60 Flashcards to public/data/notes-data.js!');
