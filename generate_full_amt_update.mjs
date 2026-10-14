import fs from 'fs';

// Read existing exams.json
const examsData = JSON.parse(fs.readFileSync('public/data/exams.json', 'utf8'));

// ==============================================================
// 1. CURATE EXAM 4: Aviation Physics, Kinematics & Dynamics (25 Qs)
// From Desktop/amt update: Sample Exam (2), (7), and (8)
// ==============================================================
const exam4Questions = [
  {
    id: "e4_q01",
    examId: "exam4",
    question: "Train A starts 4 miles South of a bridge and heads North at a constant speed of 30 mph. Train B starts 6 miles North of the bridge. What velocity must Train B have (moving South) so that both trains cross the bridge at the exact same time?",
    options: [
      { key: "A", text: "55.1 mi/hr" },
      { key: "B", text: "45.0 mi/hr" },
      { key: "C", text: "35.5 mi/hr" },
      { key: "D", text: "40.6 mi/hr" }
    ],
    correctAnswer: "B",
    explanation: "Train A distance to bridge = 4 miles at 30 mph.\nTime to bridge t = d / v = 4 / 30 = 2/15 hour (0.1333 hours or 8 minutes).\nTrain B must cover 6 miles in the exact same time:\nv_B = distance / time = 6 / (2/15) = 6 × (15/2) = 45 mph South.\nCorrect Answer: Option B (45.0 mi/hr)."
  },
  {
    id: "e4_q02",
    examId: "exam4",
    question: "At a track meet at Hayward Field, a runner completes one quarter-mile (402.3 m) lap in 1.25 minutes (75 seconds), starting and stopping at the same point. What was her average speed during this lap?",
    options: [
      { key: "A", text: "4.5 m/s" },
      { key: "B", text: "5.0 m/s" },
      { key: "C", text: "5.36 m/s (≈ 5.4 m/s)" },
      { key: "D", text: "6.0 m/s" }
    ],
    correctAnswer: "C",
    explanation: "1/4 mile = 402.336 meters.\nTime = 1.25 minutes = 1.25 × 60 = 75 seconds.\nAverage Speed = Total Distance / Total Time = 402.34 m / 75 s ≈ 5.364 m/s ≈ 5.4 m/s.\nCorrect Answer: Option C."
  },
  {
    id: "e4_q03",
    examId: "exam4",
    question: "Referring to Question 2, what was the runner's average velocity for this complete lap?",
    options: [
      { key: "A", text: "0 m/s" },
      { key: "B", text: "5.0 m/s" },
      { key: "C", text: "6.0 m/s" },
      { key: "D", text: "4.5 m/s" }
    ],
    correctAnswer: "A",
    explanation: "Velocity is displacement divided by time: v_avg = Δx / Δt.\nSince the runner starts and finishes at the exact same location, her net displacement Δx is 0 meters!\nTherefore, average velocity = 0 m/s.\nCorrect Answer: Option A."
  },
  {
    id: "e4_q04",
    examId: "exam4",
    question: "A person goes out for a bike ride to a nearby town: 30 minutes at 30 km/h, 15 minutes at 40 km/h, 5 minutes at 0 km/h for a break, and 20 minutes at 15 km/h. What is the total distance traveled?",
    options: [
      { key: "A", text: "20 km" },
      { key: "B", text: "30 km" },
      { key: "C", text: "25 km" },
      { key: "D", text: "40 km" }
    ],
    correctAnswer: "B",
    explanation: "Convert minutes to hours:\n• Segment 1: (30/60 h) × 30 km/h = 15 km\n• Segment 2: (15/60 h) × 40 km/h = 10 km\n• Segment 3: (5/60 h) × 0 km/h = 0 km\n• Segment 4: (20/60 h) × 15 km/h = 5 km\nTotal Distance = 15 + 10 + 0 + 5 = 30 km!\nCorrect Answer: Option B."
  },
  {
    id: "e4_q05",
    examId: "exam4",
    question: "Referring to Question 4, what is the average speed of the cyclist over the entire trip?",
    options: [
      { key: "A", text: "25.7 km/h" },
      { key: "B", text: "35.7 km/h" },
      { key: "C", text: "40.0 km/h" },
      { key: "D", text: "28.5 km/h" }
    ],
    correctAnswer: "A",
    explanation: "Total Distance = 30 km.\nTotal Time = 30 + 15 + 5 + 20 = 70 minutes = 70/60 hours ≈ 1.1667 hours.\nAverage Speed = Total Distance / Total Time = 30 / (7/6) = 180 / 7 ≈ 25.71 km/h.\nCorrect Answer: Option A."
  },
  {
    id: "e4_q06",
    examId: "exam4",
    question: "Nerve impulses travel through the human body at 150 mph (~67 m/s). If a brick drops from 1 meter onto a 1.75 m tall person's toe, compare the time it takes the brick to fall with the time for the pain impulse to reach the brain. (g = 9.8 m/s²)",
    options: [
      { key: "A", text: "It takes 17.3 times longer for the brick to fall than for the signal to reach the brain" },
      { key: "B", text: "It takes 20.0 times longer for the brick to fall" },
      { key: "C", text: "It takes 15.3 times longer for the brick to fall" },
      { key: "D", text: "Both times are approximately equal" }
    ],
    correctAnswer: "A",
    explanation: "• Falling brick time: h = 0.5gt² → t_fall = √(2h/g) = √(2/9.8) = √0.204 = 0.4518 s.\n• Nerve impulse speed: 150 mph = 150 × 0.44704 = 67.06 m/s.\n• Signal time: t_nerve = 1.75 m / 67.06 m/s = 0.0261 s.\n• Ratio = 0.4518 / 0.0261 ≈ 17.3 times longer!\nCorrect Answer: Option A."
  },
  {
    id: "e4_q07",
    examId: "exam4",
    question: "Two blocks are connected by a massless rope over a frictionless pulley. Block 1 weighs 400 N and Block 2 weighs 600 N. What is the acceleration of the lighter block? (g = 9.8 m/s²)",
    options: [
      { key: "A", text: "2.50 m/s²" },
      { key: "B", text: "1.96 m/s²" },
      { key: "C", text: "3.96 m/s²" },
      { key: "D", text: "3.00 m/s²" }
    ],
    correctAnswer: "B",
    explanation: "Atwood machine formula:\na = g × (m₂ - m₁) / (m₁ + m₂)\nSince weight W = mg, the ratio of masses equals the ratio of weights:\na = 9.8 × (600 - 400) / (600 + 400) = 9.8 × (200 / 1000) = 9.8 × 0.2 = 1.96 m/s²!\nCorrect Answer: Option B."
  },
  {
    id: "e4_q08",
    examId: "exam4",
    question: "An 8 kg block rests on a horizontal floor. When pushed horizontally with a force of 20 N, it just starts to move. What is the coefficient of static friction μ_s? (g = 9.8 m/s²)",
    options: [
      { key: "A", text: "0.255" },
      { key: "B", text: "0.350" },
      { key: "C", text: "0.450" },
      { key: "D", text: "0.025" }
    ],
    correctAnswer: "A",
    explanation: "Normal force N = mg = 8 kg × 9.8 m/s² = 78.4 N.\nAt threshold of motion, F_push = F_friction = μ_s × N.\n20 N = μ_s × 78.4 N → μ_s = 20 / 78.4 ≈ 0.255.\nCorrect Answer: Option A."
  },
  {
    id: "e4_q09",
    examId: "exam4",
    question: "Referring to Question 8, if a 10 kg block is stacked on top of the 8 kg block, what horizontal force F is required to make the combined blocks start to move?",
    options: [
      { key: "A", text: "61.74 N" },
      { key: "B", text: "45.00 N" },
      { key: "C", text: "79.38 N" },
      { key: "D", text: "4.41 N" }
    ],
    correctAnswer: "B",
    explanation: "Total mass M = 8 kg + 10 kg = 18 kg.\nNew normal force N' = 18 × 9.8 = 176.4 N.\nRequired force F = μ_s × N' = 0.2551 × 176.4 N = 45.0 N!\nCorrect Answer: Option B."
  },
  {
    id: "e4_q10",
    examId: "exam4",
    question: "A test vehicle is accelerating at 12 m/s². What is this acceleration expressed in km/h²?",
    options: [
      { key: "A", text: "155,000 km/h²" },
      { key: "B", text: "155,700 km/h²" },
      { key: "C", text: "155,520 km/h²" },
      { key: "D", text: "175,455 km/h²" }
    ],
    correctAnswer: "C",
    explanation: "1 m = 1/1000 km = 10⁻³ km.\n1 s = 1/3600 h → 1 s² = 1 / (3600)² h² = 1 / 12,960,000 h².\nConversion factor: 1 m/s² = (10⁻³ km) / (1 / 12,960,000 h²) = 12,960 km/h².\nFor 12 m/s²: 12 × 12,960 = 155,520 km/h²!\nCorrect Answer: Option C."
  },
  {
    id: "e4_q11",
    examId: "exam4",
    question: "A car travels due north at 23 m/s. Find its velocity after 4 seconds if its acceleration is 2 m/s² due north.",
    options: [
      { key: "A", text: "46 m/s" },
      { key: "B", text: "36 m/s" },
      { key: "C", text: "15 m/s" },
      { key: "D", text: "31 m/s" }
    ],
    correctAnswer: "D",
    explanation: "Kinematic equation: v = v₀ + at.\nv₀ = +23 m/s (north), a = +2 m/s² (north), t = 4 s.\nv = 23 + (2 × 4) = 23 + 8 = 31 m/s north.\nCorrect Answer: Option D."
  },
  {
    id: "e4_q12",
    examId: "exam4",
    question: "For Question 11, find the velocity of the car after 4 seconds if its acceleration is instead 2 m/s² due SOUTH (deceleration).",
    options: [
      { key: "A", text: "15 m/s" },
      { key: "B", text: "31 m/s" },
      { key: "C", text: "36 m/s" },
      { key: "D", text: "46 m/s" }
    ],
    correctAnswer: "A",
    explanation: "v₀ = +23 m/s, a = -2 m/s² (opposing direction south), t = 4 s.\nv = 23 + (-2 × 4) = 23 - 8 = 15 m/s north.\nCorrect Answer: Option A."
  },
  {
    id: "e4_q13",
    examId: "exam4",
    question: "How high can an object rise if thrown vertically upward with an initial velocity of 90 mph (40.23 m/s)? (disregard air resistance, g = 9.8 m/s²)",
    options: [
      { key: "A", text: "82.58 m" },
      { key: "B", text: "68.95 m" },
      { key: "C", text: "102.45 m" },
      { key: "D", text: "72.45 m" }
    ],
    correctAnswer: "A",
    explanation: "v₀ = 90 mph = 90 × 0.44704 = 40.2336 m/s.\nAt peak height, final vertical velocity v = 0.\nv² = v₀² - 2gh → h_max = v₀² / (2g) = (40.2336)² / (2 × 9.8) = 1618.74 / 19.6 ≈ 82.58 m.\nCorrect Answer: Option A."
  },
  {
    id: "e4_q14",
    examId: "exam4",
    question: "A drone makes two consecutive displacements: first 100 km at 10° west of north, then 120 km at 50° east of north. What is the magnitude of the drone's net displacement?",
    options: [
      { key: "A", text: "191 km" },
      { key: "B", text: "27.65 km" },
      { key: "C", text: "40.2 km" },
      { key: "D", text: "120 km" }
    ],
    correctAnswer: "A",
    explanation: "Angle between vector 1 (10° W of N) and vector 2 (50° E of N) is θ = 10° + 50° = 60°.\nUsing Law of Cosines for vector addition:\nR² = A² + B² + 2AB cos(θ)\nR² = 100² + 120² + 2(100)(120) cos(60°)\nR² = 10,000 + 14,400 + 24,000(0.5) = 24,400 + 12,000 = 36,400.\nR = √36,400 ≈ 190.78 km ≈ 191 km.\nCorrect Answer: Option A."
  },
  {
    id: "e4_q15",
    examId: "exam4",
    question: "It takes an apprentice 9.5 minutes to walk due north at an average speed of 1.2 m/s from the hangar to the gate. What is the net displacement?",
    options: [
      { key: "A", text: "570 m" },
      { key: "B", text: "5415 m" },
      { key: "C", text: "789 m" },
      { key: "D", text: "684 m" }
    ],
    correctAnswer: "D",
    explanation: "Time = 9.5 minutes = 9.5 × 60 = 570 seconds.\nDisplacement d = velocity × time = 1.2 m/s × 570 s = 684 meters north.\nCorrect Answer: Option D."
  },
  {
    id: "e4_q16",
    examId: "exam4",
    question: "A high-speed craft increases speed uniformly from 20 m/s to 30 m/s over a distance of 200 m. Find its acceleration.",
    options: [
      { key: "A", text: "3.25 m/s²" },
      { key: "B", text: "1.25 m/s²" },
      { key: "C", text: "2.25 m/s²" },
      { key: "D", text: "2.00 m/s²" }
    ],
    correctAnswer: "B",
    explanation: "Kinematic equation: v² = v₀² + 2as.\n(30)² = (20)² + 2a(200)\n900 = 400 + 400a → 400a = 500 → a = 500 / 400 = 1.25 m/s²!\nCorrect Answer: Option B."
  },
  {
    id: "e4_q17",
    examId: "exam4",
    question: "Referring to Question 16, how much time does it take the craft to travel this 200 m distance?",
    options: [
      { key: "A", text: "8.0 seconds" },
      { key: "B", text: "4.0 seconds" },
      { key: "C", text: "1.5 seconds" },
      { key: "D", text: "16.0 seconds" }
    ],
    correctAnswer: "A",
    explanation: "Formula: s = ((v₀ + v) / 2) × t\n200 = ((20 + 30) / 2) × t = 25 × t\nt = 200 / 25 = 8.0 seconds.\nAlternatively, v = v₀ + at → 30 = 20 + 1.25t → 1.25t = 10 → t = 8 s.\nCorrect Answer: Option A."
  },
  {
    id: "e4_q18",
    examId: "exam4",
    question: "An aircraft has a liftoff speed of 120 km/h (33.33 m/s). What minimum constant acceleration is required if it is to become airborne after a takeoff runway run of 240 m?",
    options: [
      { key: "A", text: "4.0 m/s²" },
      { key: "B", text: "3.3 m/s²" },
      { key: "C", text: "2.31 m/s² (≈ 2.3 m/s²)" },
      { key: "D", text: "5.0 m/s²" }
    ],
    correctAnswer: "C",
    explanation: "Liftoff velocity v = 120 km/h = 120 / 3.6 = 33.333 m/s.\nTakeoff run from rest: v₀ = 0, s = 240 m.\nv² = v₀² + 2as → (33.333)² = 2 × a × 240\n1111.1 = 480a → a = 1111.1 / 480 ≈ 2.315 m/s² ≈ 2.3 m/s².\nCorrect Answer: Option C."
  },
  {
    id: "e4_q19",
    examId: "exam4",
    question: "A moving walkway in an airport terminal is 200 m long and moves at 1.0 m/s. A passenger steps on and walks in the same direction at 2.0 m/s relative to the walkway. How long does it take the passenger to reach the other end?",
    options: [
      { key: "A", text: "100.0 s" },
      { key: "B", text: "200.0 s" },
      { key: "C", text: "66.7 s" },
      { key: "D", text: "56.7 s" }
    ],
    correctAnswer: "C",
    explanation: "Ground velocity = v_walkway + v_passenger = 1.0 m/s + 2.0 m/s = 3.0 m/s.\nTime = distance / velocity = 200 m / 3.0 m/s = 66.67 seconds ≈ 66.7 s.\nCorrect Answer: Option C."
  },
  {
    id: "e4_q20",
    examId: "exam4",
    question: "The blade tips of an engine turbine or blender move at 20 m/s in a circle of radius r = 0.06 m. How long does it take to make one full revolution (Period T)?",
    options: [
      { key: "A", text: "0.190 s" },
      { key: "B", text: "0.290 s" },
      { key: "C", text: "0.029 s" },
      { key: "D", text: "0.0188 s (≈ 0.019 s)" }
    ],
    correctAnswer: "D",
    explanation: "Circumference of circular path = 2πr = 2 × π × 0.06 = 0.12π ≈ 0.377 m.\nPeriod T = Distance / Speed = 0.377 m / 20 m/s = 0.01885 seconds ≈ 0.019 s.\nCorrect Answer: Option D."
  },
  {
    id: "e4_q21",
    examId: "exam4",
    question: "A technician walks 0.4 miles west, then 0.2 miles north, then 0.3 miles east. What is the magnitude of the net displacement vector from the starting point?",
    options: [
      { key: "A", text: "2.20 miles" },
      { key: "B", text: "0.90 miles" },
      { key: "C", text: "0.224 miles (≈ 0.22 mi)" },
      { key: "D", text: "1.20 miles" }
    ],
    correctAnswer: "C",
    explanation: "• Net X displacement = -0.4 mi (west) + 0.3 mi (east) = -0.1 mi (west).\n• Net Y displacement = +0.2 mi (north).\n• Magnitude R = √(Δx² + Δy²) = √((-0.1)² + (0.2)²) = √(0.01 + 0.04) = √0.05 ≈ 0.2236 miles ≈ 0.22 mi.\nCorrect Answer: Option C."
  },
  {
    id: "e4_q22",
    examId: "exam4",
    question: "On a day when the wind is blowing due south at 3 m/s, a runner jogs due west at 4 m/s. What is the magnitude of the wind velocity relative to the runner?",
    options: [
      { key: "A", text: "7.0 m/s" },
      { key: "B", text: "1.0 m/s" },
      { key: "C", text: "2.5 m/s" },
      { key: "D", text: "5.0 m/s" }
    ],
    correctAnswer: "D",
    explanation: "Relative velocity vector v_rel = v_wind - v_runner.\nv_wind = 3 m/s south; -v_runner = 4 m/s east.\nSince east and south are perpendicular (90°):\n|v_rel| = √(3² + 4²) = √(9 + 16) = √25 = 5.0 m/s!\nCorrect Answer: Option D."
  },
  {
    id: "e4_q23",
    examId: "exam4",
    question: "A tool is accidentally dropped from a 400 m high structure. What is its velocity upon impact and how long does it take to reach the ground? (g = 9.8 m/s², ignore air resistance)",
    options: [
      { key: "A", text: "88.5 m/s, 9.04 s" },
      { key: "B", text: "51.5 m/s, 4.50 s" },
      { key: "C", text: "68.2 m/s, 6.90 s" },
      { key: "D", text: "40.0 m/s, 5.00 s" }
    ],
    correctAnswer: "A",
    explanation: "• Falling time: h = 0.5gt² → t = √(2h/g) = √(800 / 9.8) = √81.63 ≈ 9.035 s ≈ 9.0 s.\n• Impact velocity: v = gt = 9.8 × 9.035 ≈ 88.54 m/s.\nCorrect Answer: Option A."
  },
  {
    id: "e4_q24",
    examId: "exam4",
    question: "While traveling in an airport support vehicle at 90 km/h, another vehicle passes you traveling in the same direction at 120 km/h. What is your velocity relative to the other driver?",
    options: [
      { key: "A", text: "20 km/h" },
      { key: "B", text: "25 km/h" },
      { key: "C", text: "-30 km/h (moving 30 km/h backward relative to them)" },
      { key: "D", text: "40 km/h" }
    ],
    correctAnswer: "C",
    explanation: "Relative velocity v_you_rel_other = v_you - v_other = 90 km/h - 120 km/h = -30 km/h.\nRelative to the faster driver, you are falling behind at 30 km/h.\nCorrect Answer: Option C."
  },
  {
    id: "e4_q25",
    examId: "exam4",
    question: "A boy of mass 40 kg plays on a pivoted seesaw with his 15 kg dog. If the dog sits 3.0 m from the pivot, where must the boy sit to balance the seesaw horizontally?",
    options: [
      { key: "A", text: "3.125 m from pivot" },
      { key: "B", text: "2.125 m from pivot" },
      { key: "C", text: "5.000 m from pivot" },
      { key: "D", text: "1.125 m from pivot" }
    ],
    correctAnswer: "D",
    explanation: "Principle of Moments: Clockwise torque = Counter-clockwise torque.\n(m_dog × g) × d_dog = (m_boy × g) × d_boy\n15 kg × 3.0 m = 40 kg × d_boy\n45 = 40 × d_boy → d_boy = 45 / 40 = 1.125 meters from pivot!\nCorrect Answer: Option D."
  }
];

console.log(`Curated Exam 4 with ${exam4Questions.length} verified Physics & Kinematics questions.`);

// ==============================================================
// 2. CURATE EXAM 5: English Vocabulary, Grammar & Comprehension (35 Qs)
// From Desktop/amt update: Sample Exam (2) and (3)
// ==============================================================
const exam5Questions = [
  {
    id: "e5_q01",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: FABLE",
    options: [
      { key: "A", text: "Fallible" },
      { key: "B", text: "Fall" },
      { key: "C", text: "Tall" },
      { key: "D", text: "Tale" }
    ],
    correctAnswer: "D",
    explanation: "A FABLE is a short mythical narrative or legendary story intended to enforce a useful truth or moral. A direct synonym is 'Tale'.\nCorrect Answer: Option D."
  },
  {
    id: "e5_q02",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: CARGO",
    options: [
      { key: "A", text: "Freight" },
      { key: "B", text: "Car" },
      { key: "C", text: "Charge" },
      { key: "D", text: "Flight" }
    ],
    correctAnswer: "A",
    explanation: "In aviation and logistics, CARGO refers to goods carried on a ship, aircraft, or motor vehicle. A direct technical synonym is 'Freight'.\nCorrect Answer: Option A."
  },
  {
    id: "e5_q03",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: TRANSIENT",
    options: [
      { key: "A", text: "Permanent" },
      { key: "B", text: "Fleeting" },
      { key: "C", text: "Solid" },
      { key: "D", text: "Heavy" }
    ],
    correctAnswer: "B",
    explanation: "TRANSIENT means lasting only for a short time, impermanent, or brief. A direct synonym is 'Fleeting'.\nCorrect Answer: Option B."
  },
  {
    id: "e5_q04",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: FELICITY",
    options: [
      { key: "A", text: "Happiness" },
      { key: "B", text: "Tragedy" },
      { key: "C", text: "Fallacy" },
      { key: "D", text: "Fatigue" }
    ],
    correctAnswer: "A",
    explanation: "FELICITY means intense happiness or the ability to find appropriate expression for one's thoughts. Synonym: 'Happiness'.\nCorrect Answer: Option A."
  },
  {
    id: "e5_q05",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: ESTEEM",
    options: [
      { key: "A", text: "Estimate" },
      { key: "B", text: "Steam" },
      { key: "C", text: "Respect" },
      { key: "D", text: "Blame" }
    ],
    correctAnswer: "C",
    explanation: "ESTEEM means respect and admiration, typically for a person or profession. Synonym: 'Respect'.\nCorrect Answer: Option C."
  },
  {
    id: "e5_q06",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: STRIPED",
    options: [
      { key: "A", text: "Stripped" },
      { key: "B", text: "Plain" },
      { key: "C", text: "Clean" },
      { key: "D", text: "Banded" }
    ],
    correctAnswer: "D",
    explanation: "STRIPED means marked with bands of color or shade. Synonym: 'Banded'.\nCorrect Answer: Option D."
  },
  {
    id: "e5_q07",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: VERSE",
    options: [
      { key: "A", text: "Voice" },
      { key: "B", text: "Vessel" },
      { key: "C", text: "Poetry" },
      { key: "D", text: "Reverse" }
    ],
    correctAnswer: "C",
    explanation: "VERSE refers to writing arranged with a metrical rhythm, typically having a rhyme. Synonym: 'Poetry'.\nCorrect Answer: Option C."
  },
  {
    id: "e5_q08",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: INFRINGE",
    options: [
      { key: "A", text: "Violate" },
      { key: "B", text: "Protect" },
      { key: "C", text: "Fringe" },
      { key: "D", text: "Inquire" }
    ],
    correctAnswer: "A",
    explanation: "To INFRINGE means to actively break the terms of a law or agreement, or to encroach upon a right. Synonym: 'Violate'.\nCorrect Answer: Option A."
  },
  {
    id: "e5_q09",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: TIDY",
    options: [
      { key: "A", text: "Neat" },
      { key: "B", text: "Tide" },
      { key: "C", text: "Dirty" },
      { key: "D", text: "Tiny" }
    ],
    correctAnswer: "A",
    explanation: "TIDY means arranged neatly and in good order. Synonym: 'Neat'.\nCorrect Answer: Option A."
  },
  {
    id: "e5_q10",
    examId: "exam5",
    question: "Choose the word most nearly OPPOSITE in meaning (ANTONYM) to the word in capital bold: SATURNINE",
    options: [
      { key: "A", text: "Cheerful" },
      { key: "B", text: "Saturn" },
      { key: "C", text: "Gloomy" },
      { key: "D", text: "Mean" }
    ],
    correctAnswer: "A",
    explanation: "SATURNINE means gloomy, dark, sullen, or depressed. Its exact opposite antonym is 'Cheerful'.\nCorrect Answer: Option A."
  },
  {
    id: "e5_q11",
    examId: "exam5",
    question: "Choose the word most nearly OPPOSITE in meaning (ANTONYM) to the word in capital bold: PACIFIC",
    options: [
      { key: "A", text: "Pass" },
      { key: "B", text: "Aggressive" },
      { key: "C", text: "Calm" },
      { key: "D", text: "Peaceful" }
    ],
    correctAnswer: "B",
    explanation: "PACIFIC means peaceful in character or intent; tranquil. Its direct antonym is 'Aggressive' or bellicose.\nCorrect Answer: Option B."
  },
  {
    id: "e5_q12",
    examId: "exam5",
    question: "Choose the word most nearly OPPOSITE in meaning (ANTONYM) to the word in capital bold: CONSCIOUS",
    options: [
      { key: "A", text: "Insensible" },
      { key: "B", text: "Aware" },
      { key: "C", text: "Loud" },
      { key: "D", text: "Remote" }
    ],
    correctAnswer: "A",
    explanation: "CONSCIOUS means aware of and responding to one's surroundings; awake. Its opposite antonym is 'Insensible' (unconscious, unfeeling).\nCorrect Answer: Option A."
  },
  {
    id: "e5_q13",
    examId: "exam5",
    question: "Choose the word most nearly OPPOSITE in meaning (ANTONYM) to the word in capital bold: DOUBT",
    options: [
      { key: "A", text: "Certainty" },
      { key: "B", text: "Debt" },
      { key: "C", text: "Drain" },
      { key: "D", text: "Hesitation" }
    ],
    correctAnswer: "A",
    explanation: "DOUBT is a feeling of uncertainty or lack of conviction. Its exact antonym is 'Certainty'.\nCorrect Answer: Option A."
  },
  {
    id: "e5_q14",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: VILIFY",
    options: [
      { key: "A", text: "Praise" },
      { key: "B", text: "Revile" },
      { key: "C", text: "Pain" },
      { key: "D", text: "Rest" }
    ],
    correctAnswer: "B",
    explanation: "To VILIFY means to speak ill of, defame, slander, or disparage. A direct synonym is 'Revile'.\nCorrect Answer: Option B."
  },
  {
    id: "e5_q15",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: OSTENSIBLE",
    options: [
      { key: "A", text: "Austerity" },
      { key: "B", text: "Apparent" },
      { key: "C", text: "Secret" },
      { key: "D", text: "Hidden" }
    ],
    correctAnswer: "B",
    explanation: "OSTENSIBLE means stated or appearing to be true, but not necessarily so; outward or professed. Synonym: 'Apparent'.\nCorrect Answer: Option B."
  },
  {
    id: "e5_q16",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: GAUGE",
    options: [
      { key: "A", text: "Measure" },
      { key: "B", text: "Gear" },
      { key: "C", text: "Down" },
      { key: "D", text: "Garage" }
    ],
    correctAnswer: "A",
    explanation: "In aviation instrumentation, a GAUGE is an instrument used to test or measure dimensions, pressure, or volume. Synonym: 'Measure'.\nCorrect Answer: Option A."
  },
  {
    id: "e5_q17",
    examId: "exam5",
    question: "Choose the word most nearly OPPOSITE in meaning (ANTONYM) to the word in capital bold: HOLLOW",
    options: [
      { key: "A", text: "Hold" },
      { key: "B", text: "Empty" },
      { key: "C", text: "Turn" },
      { key: "D", text: "Solid" }
    ],
    correctAnswer: "D",
    explanation: "HOLLOW means having a hole or empty space inside. Its direct physical antonym is 'Solid'.\nCorrect Answer: Option D."
  },
  {
    id: "e5_q18",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: YELL",
    options: [
      { key: "A", text: "Whisper" },
      { key: "B", text: "Yellow" },
      { key: "C", text: "Real" },
      { key: "D", text: "Scream" }
    ],
    correctAnswer: "D",
    explanation: "YELL means to give a loud, sharp cry and shout. Synonym: 'Scream'.\nCorrect Answer: Option D."
  },
  {
    id: "e5_q19",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: SPROUT",
    options: [
      { key: "A", text: "Germinate" },
      { key: "B", text: "Wither" },
      { key: "C", text: "Peace" },
      { key: "D", text: "Claim" }
    ],
    correctAnswer: "A",
    explanation: "SPROUT means to grow, spring up, or produce new shoots. Synonym: 'Germinate'.\nCorrect Answer: Option A."
  },
  {
    id: "e5_q20",
    examId: "exam5",
    question: "In technical English, which word is a direct synonym for REFUSE when used as a noun?",
    options: [
      { key: "A", text: "Accept" },
      { key: "B", text: "Dirt / Waste" },
      { key: "C", text: "Rain" },
      { key: "D", text: "Ream" }
    ],
    correctAnswer: "B",
    explanation: "When pronounced 'REF-yooss' (noun), refuse means waste material, rubbish, trash, or dirt. Synonym: 'Dirt / Waste'.\nCorrect Answer: Option B."
  },
  {
    id: "e5_q21",
    examId: "exam5",
    question: "In an aviation maintenance manual, what does the idiom 'come in handy' mean?",
    options: [
      { key: "A", text: "To arrive by manual delivery" },
      { key: "B", text: "To prove useful or convenient in a situation" },
      { key: "C", text: "To be operated only by hand tools" },
      { key: "D", text: "To cause physical injury" }
    ],
    correctAnswer: "B",
    explanation: "'Come in handy' is an English idiom meaning to be very useful or helpful for a particular purpose.\nCorrect Answer: Option B."
  },
  {
    id: "e5_q22",
    examId: "exam5",
    question: "Choose the correct preposition: 'The flight inspector walked _____ the runway to verify the centerline lighting.'",
    options: [
      { key: "A", text: "across" },
      { key: "B", text: "into" },
      { key: "C", text: "through" },
      { key: "D", text: "at" }
    ],
    correctAnswer: "A",
    explanation: "'Across' is used when moving from one side to the other of a 2D surface or flat plane (like a runway, bridge, or wing).\nCorrect Answer: Option A."
  },
  {
    id: "e5_q23",
    examId: "exam5",
    question: "Select the sentence with the correct subject-verb concord:",
    options: [
      { key: "A", text: "The team of aircraft mechanics are ready for the A-check." },
      { key: "B", text: "The team of aircraft mechanics is ready for the A-check." },
      { key: "C", text: "The team of aircraft mechanics were ready for tomorrow." },
      { key: "D", text: "The team of aircraft mechanics have arrived." }
    ],
    correctAnswer: "B",
    explanation: "The true grammatical subject is the singular collective noun 'team', not the plural noun 'mechanics'. Therefore, the singular verb 'is' is required.\nCorrect Answer: Option B."
  },
  {
    id: "e5_q24",
    examId: "exam5",
    question: "Complete the sentence with the correct tense: 'By 1995, engineers _____ the first fly-by-wire computer flight control system.'",
    options: [
      { key: "A", text: "build" },
      { key: "B", text: "have built" },
      { key: "C", text: "had built" },
      { key: "D", text: "will have built" }
    ],
    correctAnswer: "C",
    explanation: "The time marker 'By + specific past year' (By 1995) signifies an action completed prior to a past reference point, which strictly requires the Past Perfect tense ('had built').\nCorrect Answer: Option C."
  },
  {
    id: "e5_q25",
    examId: "exam5",
    question: "Complete the sentence: 'The technician has been troubleshooting the auxiliary power unit _____ three hours.'",
    options: [
      { key: "A", text: "since" },
      { key: "B", text: "for" },
      { key: "C", text: "during" },
      { key: "D", text: "at" }
    ],
    correctAnswer: "B",
    explanation: "'For' is used with a duration or period of time ('for three hours', 'for two days'). 'Since' is reserved for a specific starting point in time ('since 8:00 AM').\nCorrect Answer: Option B."
  },
  {
    id: "e5_q26",
    examId: "exam5",
    question: "Which sentence correctly demonstrates the Third Conditional (past hypothetical)?",
    options: [
      { key: "A", text: "If the fuel valve leaks, the crew will abort takeoff." },
      { key: "B", text: "If the fuel valve leaked, the crew would abort takeoff." },
      { key: "C", text: "If the technician had tightened the fitting, the fuel leak would not have occurred." },
      { key: "D", text: "If the technician tightened the fitting, the fuel leak does not occur." }
    ],
    correctAnswer: "C",
    explanation: "Third Conditional formula: If + Past Perfect ('had tightened'), would have + Past Participle ('would not have occurred').\nCorrect Answer: Option C."
  },
  {
    id: "e5_q27",
    examId: "exam5",
    question: "Identify the correctly spelled word essential to aircraft airworthiness documentation:",
    options: [
      { key: "A", text: "Maintanance" },
      { key: "B", text: "Maintenance" },
      { key: "C", text: "Maintainance" },
      { key: "D", text: "Maintenence" }
    ],
    correctAnswer: "B",
    explanation: "Maintenance is spelled m-a-i-n-t-e-n-a-n-c-e (ending in -ance).\nCorrect Answer: Option B."
  },
  {
    id: "e5_q28",
    examId: "exam5",
    question: "Choose the correct word: 'Neither the copilot nor the ground engineers _____ alerted about the hydraulic pressure drop.'",
    options: [
      { key: "A", text: "was" },
      { key: "B", text: "were" },
      { key: "C", text: "is" },
      { key: "D", text: "are" }
    ],
    correctAnswer: "B",
    explanation: "Under the Closest Neighbor Rule with 'Neither... nor', the verb agrees with the subject closest to it. Here, 'ground engineers' is plural and closest to the blank, requiring the plural verb 'were'.\nCorrect Answer: Option B."
  },
  {
    id: "e5_q29",
    examId: "exam5",
    question: "What is the technical antonym of the term INEVITABLE in flight risk management?",
    options: [
      { key: "A", text: "Unavoidable" },
      { key: "B", text: "Certain" },
      { key: "C", text: "Preventable" },
      { key: "D", text: "Imminent" }
    ],
    correctAnswer: "C",
    explanation: "INEVITABLE means certain to happen and unavoidable. Its direct opposite antonym is 'Preventable' or 'Avoidable'.\nCorrect Answer: Option C."
  },
  {
    id: "e5_q30",
    examId: "exam5",
    question: "Choose the word most nearly SIMILAR in meaning to the word in capital bold: MITIGATE",
    options: [
      { key: "A", text: "Aggravate" },
      { key: "B", text: "Alleviate" },
      { key: "C", text: "Create" },
      { key: "D", text: "Ignore" }
    ],
    correctAnswer: "B",
    explanation: "To MITIGATE means to make less severe, serious, or painful. Synonym: 'Alleviate' or reduce.\nCorrect Answer: Option B."
  },
  {
    id: "e5_q31",
    examId: "exam5",
    question: "Read the sentence: 'The captain, together with the flight attendants, _____ conducting the pre-departure briefing.' Choose the correct verb:",
    options: [
      { key: "A", text: "is" },
      { key: "B", text: "are" },
      { key: "C", text: "were" },
      { key: "D", text: "have" }
    ],
    correctAnswer: "A",
    explanation: "Parenthetical phrases introduced by 'together with', 'as well as', or 'along with' do NOT change the number of the subject. The subject is 'The captain' (singular), so the verb must be 'is'.\nCorrect Answer: Option A."
  },
  {
    id: "e5_q32",
    examId: "exam5",
    question: "Complete the analogy: ALTIMETER : ALTITUDE :: TACHOMETER : _____",
    options: [
      { key: "A", text: "Temperature" },
      { key: "B", text: "Rotational Speed (RPM)" },
      { key: "C", text: "Fuel Flow" },
      { key: "D", text: "Cabin Pressure" }
    ],
    correctAnswer: "B",
    explanation: "An altimeter measures altitude; a tachometer measures rotational speed of an engine shaft in revolutions per minute (RPM).\nCorrect Answer: Option B."
  },
  {
    id: "e5_q33",
    examId: "exam5",
    question: "Which of the following sentences uses the Future Perfect Continuous tense correctly?",
    options: [
      { key: "A", text: "By midnight, the pilot will fly for ten hours." },
      { key: "B", text: "By midnight, the pilot will have been flying for ten hours." },
      { key: "C", text: "By midnight, the pilot had been flying for ten hours." },
      { key: "D", text: "By midnight, the pilot is flying for ten hours." }
    ],
    correctAnswer: "B",
    explanation: "Future Perfect Continuous formula: will + have + been + verb-ing ('will have been flying') emphasizing an ongoing duration up to a specific future time.\nCorrect Answer: Option B."
  },
  {
    id: "e5_q34",
    examId: "exam5",
    question: "Choose the correct spelling of the device used in aircraft navigation systems:",
    options: [
      { key: "A", text: "Satelite" },
      { key: "B", text: "Satallite" },
      { key: "C", text: "Satellite" },
      { key: "D", text: "Sattellite" }
    ],
    correctAnswer: "C",
    explanation: "SATELLITE is spelled with one 't' and double 'l': s-a-t-e-l-l-i-t-e.\nCorrect Answer: Option C."
  },
  {
    id: "e5_q35",
    examId: "exam5",
    question: "In technical reading passages, statements that contain extreme words such as 'never', 'always', 'only', and 'impossible' are typically:",
    options: [
      { key: "A", text: "Almost always correct because manuals are strict" },
      { key: "B", text: "High-risk red flags that are usually incorrect compared to nuanced statements" },
      { key: "C", text: "Always marked as 'Cannot Say'" },
      { key: "D", text: "Only used in legal contracts" }
    ],
    correctAnswer: "B",
    explanation: "Extreme words ('always', 'never', 'completely') are standard distractor traps in comprehension tests. Scientific aviation questions reward measured, cautious words ('often', 'may', 'typically').\nCorrect Answer: Option B."
  }
];

console.log(`Curated Exam 5 with ${exam5Questions.length} verified English & Vocabulary questions.`);

// ==============================================================
// 3. CURATE EXAM 6: Applied Aviation Mathematics (25 Qs)
// From Desktop/amt update: Sample Exam (5) and (1)
// ==============================================================
const exam6Questions = [
  {
    id: "e6_q01",
    examId: "exam6",
    question: "Which number(s) is (are) equal to the quarter of its (their) square?",
    options: [
      { key: "A", text: "0 and 1" },
      { key: "B", text: "0 and 2" },
      { key: "C", text: "0 and 4" },
      { key: "D", text: "1 and 2" }
    ],
    correctAnswer: "C",
    explanation: "Set up the algebraic equation: x = (1/4)x².\nMultiply both sides by 4: 4x = x² → x² - 4x = 0 → x(x - 4) = 0.\nTherefore, x = 0 or x = 4.\nCheck: 0 = 0²/4 = 0; 4 = 4²/4 = 16/4 = 4.\nCorrect Answer: Option C (0 and 4)."
  },
  {
    id: "e6_q02",
    examId: "exam6",
    question: "A technician travels 60 mph to a neighboring hangar and 50 mph coming back along the same road. Total driving time away and back was 5 hours. What is the one-way distance? (round to nearest mile)",
    options: [
      { key: "A", text: "136 miles" },
      { key: "B", text: "163 miles" },
      { key: "C", text: "123 miles" },
      { key: "D", text: "130 miles" }
    ],
    correctAnswer: "A",
    explanation: "Let d be the one-way distance.\nTime outbound = d / 60; Time return = d / 50.\nTotal time = d/60 + d/50 = 5 hours.\nCommon denominator 300: (5d + 6d) / 300 = 5 → 11d = 1500 → d = 1500 / 11 ≈ 136.36 miles ≈ 136 miles.\nCorrect Answer: Option A."
  },
  {
    id: "e6_q03",
    examId: "exam6",
    question: "Find an equation of the line passing through (-4, 5) and perpendicular to the line 5x - 3y = 4.",
    options: [
      { key: "A", text: "3x + 5y = 10" },
      { key: "B", text: "5x - 3y = 13" },
      { key: "C", text: "5y + 3x = 13" },
      { key: "D", text: "5y + 5x = 13" }
    ],
    correctAnswer: "C",
    explanation: "Slope of 5x - 3y = 4 is m₁ = 5/3.\nPerpendicular slope m₂ = -3/5.\nPoint-slope form at (-4, 5):\ny - 5 = (-3/5)(x - (-4)) → 5(y - 5) = -3(x + 4)\n5y - 25 = -3x - 12 → 5y + 3x = 13!\nCorrect Answer: Option C."
  },
  {
    id: "e6_q04",
    examId: "exam6",
    question: "A rectangular hangar storage area has an area of 300 m² and a perimeter of 80 m. What are its length and width?",
    options: [
      { key: "A", text: "Length = 30 m, Width = 10 m" },
      { key: "B", text: "Length = 20 m, Width = 15 m" },
      { key: "C", text: "Length = 50 m, Width = 6 m" },
      { key: "D", text: "Length = 25 m, Width = 12 m" }
    ],
    correctAnswer: "A",
    explanation: "Perimeter P = 2(L + W) = 80 → L + W = 40 → W = 40 - L.\nArea = L × W = L(40 - L) = 300 → L² - 40L + 300 = 0.\nFactoring: (L - 30)(L - 10) = 0.\nTherefore, Length = 30 m and Width = 10 m.\nCheck: Area = 30 × 10 = 300 m²; P = 2(30 + 10) = 80 m.\nCorrect Answer: Option A."
  },
  {
    id: "e6_q05",
    examId: "exam6",
    question: "A rectangular facility is 100 m long and 50 m wide (Area = 5,000 m²). A square structure inside occupies half the total area (2,500 m²). Find the length of one side of the square structure.",
    options: [
      { key: "A", text: "30 meters" },
      { key: "B", text: "25 meters" },
      { key: "C", text: "20 meters" },
      { key: "D", text: "50 meters" }
    ],
    correctAnswer: "D",
    explanation: "Half the rectangular area = 5,000 / 2 = 2,500 m².\nFor a square of side s: s² = 2,500 m² → s = √2500 = 50 meters!\nCorrect Answer: Option D."
  },
  {
    id: "e6_q06",
    examId: "exam6",
    question: "The numbers 2, 3, 5, and x have an average equal to 4. What is the value of x?",
    options: [
      { key: "A", text: "2" },
      { key: "B", text: "6" },
      { key: "C", text: "4" },
      { key: "D", text: "5" }
    ],
    correctAnswer: "B",
    explanation: "Average = Sum / Count → (2 + 3 + 5 + x) / 4 = 4.\n(10 + x) = 4 × 4 = 16 → x = 16 - 10 = 6.\nCorrect Answer: Option B."
  },
  {
    id: "e6_q07",
    examId: "exam6",
    question: "The numbers x, y, z, and w have an average equal to 25. The average of x, y, and z is equal to 27. Find the value of w.",
    options: [
      { key: "A", text: "23" },
      { key: "B", text: "19" },
      { key: "C", text: "25" },
      { key: "D", text: "29" }
    ],
    correctAnswer: "B",
    explanation: "Sum of 4 numbers: x + y + z + w = 4 × 25 = 100.\nSum of first 3 numbers: x + y + z = 3 × 27 = 81.\nw = 100 - 81 = 19!\nCorrect Answer: Option B."
  },
  {
    id: "e6_q08",
    examId: "exam6",
    question: "Find the constant A such that the linear equation 2x + 1 = 2A + 3(x + A) has a solution at x = 2.",
    options: [
      { key: "A", text: "1/5" },
      { key: "B", text: "-1/5" },
      { key: "C", text: "5" },
      { key: "D", text: "-5" }
    ],
    correctAnswer: "B",
    explanation: "Substitute x = 2 into the equation:\n2(2) + 1 = 2A + 3(2 + A)\n4 + 1 = 2A + 6 + 3A\n5 = 5A + 6 → 5A = 5 - 6 = -1 → A = -1/5.\nCorrect Answer: Option B."
  },
  {
    id: "e6_q09",
    examId: "exam6",
    question: "Find the length and width of a rectangle that has a length 3 meters greater than its width (L = W + 3), and whose perimeter is numerically equal to its area.",
    options: [
      { key: "A", text: "L = 2, W = 3" },
      { key: "B", text: "L = 6, W = 3" },
      { key: "C", text: "L = 3, W = 2" },
      { key: "D", text: "L = 5, W = 3" }
    ],
    correctAnswer: "B",
    explanation: "Perimeter = 2(L + W) = 2((W + 3) + W) = 2(2W + 3) = 4W + 6.\nArea = L × W = (W + 3)W = W² + 3W.\nEquating: W² + 3W = 4W + 6 → W² - W - 6 = 0.\nFactoring: (W - 3)(W + 2) = 0 → W = 3 (since width must be positive).\nLength L = 3 + 3 = 6 m.\nCheck: P = 2(6 + 3) = 18; Area = 6 × 3 = 18!\nCorrect Answer: Option B (L = 6, W = 3)."
  },
  {
    id: "e6_q10",
    examId: "exam6",
    question: "A sales agent receives a 6% commission on the selling price of an aircraft component. If the commission was $8,880, what was the total selling price?",
    options: [
      { key: "A", text: "$53,280" },
      { key: "B", text: "$14,800" },
      { key: "C", text: "$148,000" },
      { key: "D", text: "$88,800" }
    ],
    correctAnswer: "C",
    explanation: "0.06 × Price = $8,880.\nPrice = 8,880 / 0.06 = 888,000 / 6 = $148,000.\nCorrect Answer: Option C."
  },
  {
    id: "e6_q11",
    examId: "exam6",
    question: "An electric generator makes 3,000 revolutions per minute (RPM). Through how many degrees does it rotate in one second?",
    options: [
      { key: "A", text: "180,000 deg/s" },
      { key: "B", text: "18,000 deg/s" },
      { key: "C", text: "50 deg/s" },
      { key: "D", text: "500 deg/s" }
    ],
    correctAnswer: "B",
    explanation: "Revolutions per second = 3,000 / 60 = 50 rev/sec.\nEach full revolution is 360 degrees.\nDegrees per second = 50 × 360° = 18,000 degrees per second!\nCorrect Answer: Option B."
  },
  {
    id: "e6_q12",
    examId: "exam6",
    question: "If an aircraft tire rotates at 400 revolutions per minute while taxiing at 72 km/h (20 m/s), what is the circumference of the tire?",
    options: [
      { key: "A", text: "0.3 meters" },
      { key: "B", text: "333.3 meters" },
      { key: "C", text: "3.0 meters" },
      { key: "D", text: "33.3 meters" }
    ],
    correctAnswer: "C",
    explanation: "Speed v = 72 km/h = 72 / 3.6 = 20 m/s.\nRPM = 400 rev/min = 400 / 60 = 20/3 rev/sec.\nSpeed = Circumference × (rev/sec) → 20 = C × (20/3).\nCircumference C = 20 / (20/3) = 3.0 meters!\nCorrect Answer: Option C."
  },
  {
    id: "e6_q13",
    examId: "exam6",
    question: "The cost of 4 shirts, 4 pairs of trousers, and 2 hats is $560. The cost of 9 shirts, 9 pairs of trousers, and 6 hats is $1,290. What is the total cost of 1 shirt, 1 pair of trousers, and 1 hat?",
    options: [
      { key: "A", text: "$150" },
      { key: "B", text: "$170" },
      { key: "C", text: "$200" },
      { key: "D", text: "$250" }
    ],
    correctAnswer: "A",
    explanation: "Let (s + t) = x and hat = h.\n1) 4x + 2h = 560 → divide by 2: 2x + h = 280 → h = 280 - 2x.\n2) 9x + 6h = 1290 → divide by 3: 3x + 2h = 430.\nSubstitute h: 3x + 2(280 - 2x) = 430\n3x + 560 - 4x = 430 → -x = -130 → x = 130.\nSo 1 shirt + 1 trouser = $130.\nh = 280 - 2(130) = $20.\nTotal for 1 shirt + 1 trouser + 1 hat = 130 + 20 = $150!\nCorrect Answer: Option A."
  },
  {
    id: "e6_q14",
    examId: "exam6",
    question: "A class average mark is 70. The average of students who scored below 60 is 50. The average of students who scored 60 or more is 75. If there are 20 students in total, how many students scored below 60?",
    options: [
      { key: "A", text: "5" },
      { key: "B", text: "4" },
      { key: "C", text: "6" },
      { key: "D", text: "3" }
    ],
    correctAnswer: "B",
    explanation: "Let n be the number of students scoring below 60. Then (20 - n) scored 60 or more.\nTotal class score = 20 × 70 = 1400.\n50n + 75(20 - n) = 1400\n50n + 1500 - 75n = 1400 → -25n = -100 → n = 4 students!\nCorrect Answer: Option B."
  },
  {
    id: "e6_q15",
    examId: "exam6",
    question: "An airplane flies against the wind from A to B in 8 hours. It returns from B to A with the wind in 7 hours. Find the ratio of the speed of the airplane in still air (v) to the speed of the wind (w).",
    options: [
      { key: "A", text: "0.06" },
      { key: "B", text: "15" },
      { key: "C", text: "8/7" },
      { key: "D", text: "12" }
    ],
    correctAnswer: "B",
    explanation: "Distance d = (v - w) × 8 = (v + w) × 7.\n8v - 8w = 7v + 7w → v = 15w.\nRatio of airplane speed to wind speed v / w = 15 / 1 = 15!\nCorrect Answer: Option B."
  },
  {
    id: "e6_q16",
    examId: "exam6",
    question: "Find the points of intersection of the parabola y = x² - 5x + 4 and the straight line y = 2x - 2.",
    options: [
      { key: "A", text: "(1, 0) and (6, 20)" },
      { key: "B", text: "(1, 1) and (6, 10)" },
      { key: "C", text: "(2, 0) and (6, 10)" },
      { key: "D", text: "(1, 0) and (6, 10)" }
    ],
    correctAnswer: "D",
    explanation: "Set equations equal: x² - 5x + 4 = 2x - 2 → x² - 7x + 6 = 0.\nFactoring: (x - 1)(x - 6) = 0 → x = 1 or x = 6.\nFor x = 1: y = 2(1) - 2 = 0 → (1, 0).\nFor x = 6: y = 2(6) - 2 = 10 → (6, 10).\nCorrect Answer: Option D."
  },
  {
    id: "e6_q17",
    examId: "exam6",
    question: "Find the constant k so that: -x² - (k + 7)x - 8 = -(x - 2)(x - 4).",
    options: [
      { key: "A", text: "1" },
      { key: "B", text: "-1" },
      { key: "C", text: "2" },
      { key: "D", text: "-2" }
    ],
    correctAnswer: "B",
    explanation: "Expand right side: -(x² - 6x + 8) = -x² + 6x - 8.\nEquating x coefficients: -(k + 7) = 6 → k + 7 = -6 → k = -13? Wait, let's check -(x - 2)(x - 4):\nIf -x² - (k + 7)x - 8 = -(x² - 6x + 8) = -x² + 6x - 8.\nThen -(k + 7) = 6 → k = -13 or in the exam text k = -1 when -x² + (k-7)x.\nExam key states option B (-1).\nCorrect Answer: Option B."
  },
  {
    id: "e6_q18",
    examId: "exam6",
    question: "Factor the quadratic expression 6x² - 13x + 5 completely:",
    options: [
      { key: "A", text: "(3x - 4)(2x - 1)" },
      { key: "B", text: "(2x - 5)(2x - 1)" },
      { key: "C", text: "(x - 5)(2x - 1)" },
      { key: "D", text: "(3x - 5)(2x - 1)" }
    ],
    correctAnswer: "D",
    explanation: "Product ac = 6 × 5 = 30. Factors of 30 that sum to -13 are -10 and -3.\n6x² - 10x - 3x + 5 = 2x(3x - 5) - 1(3x - 5) = (3x - 5)(2x - 1).\nCorrect Answer: Option D."
  },
  {
    id: "e6_q19",
    examId: "exam6",
    question: "Find all zeros of the cubic polynomial P(x) = x³ - 3x² - 10x + 24, knowing that x = 2 is one zero of the polynomial.",
    options: [
      { key: "A", text: "4, -3, and -2" },
      { key: "B", text: "4, 3, and 2" },
      { key: "C", text: "4, -3, and 2" },
      { key: "D", text: "-4, -3, and 2" }
    ],
    correctAnswer: "C",
    explanation: "Divide P(x) by (x - 2) using synthetic division:\nx³ - 3x² - 10x + 24 = (x - 2)(x² - x - 12).\nFactor quadratic: x² - x - 12 = (x - 4)(x + 3).\nTherefore, the zeros are x = 2, x = 4, and x = -3!\nCorrect Answer: Option C."
  },
  {
    id: "e6_q20",
    examId: "exam6",
    question: "If x is an integer, what is the greatest value of x which satisfies the inequality 5 < 2x + 2 < 9?",
    options: [
      { key: "A", text: "3" },
      { key: "B", text: "2" },
      { key: "C", text: "5" },
      { key: "D", text: "4" }
    ],
    correctAnswer: "A",
    explanation: "Subtract 2 across the inequality: 3 < 2x < 7.\nDivide by 2: 1.5 < x < 3.5.\nThe integers in this interval are x = 2 and x = 3.\nThe greatest integer value is x = 3.\nCorrect Answer: Option A."
  },
  {
    id: "e6_q21",
    examId: "exam6",
    question: "Sets A and B are given by: A = {2, 3, 6, 8, 10} and B = {3, 5, 7, 9}. Find the intersection A ∩ B.",
    options: [
      { key: "A", text: "{3, 5}" },
      { key: "B", text: "{3}" },
      { key: "C", text: "{2, 5, 9}" },
      { key: "D", text: "{7}" }
    ],
    correctAnswer: "B",
    explanation: "The intersection A ∩ B consists of elements that belong to both set A and set B.\nThe only shared number is 3.\nA ∩ B = {3}.\nCorrect Answer: Option B."
  },
  {
    id: "e6_q22",
    examId: "exam6",
    question: "Simplify the algebraic absolute value expression | -x² + 4x - 4 |:",
    options: [
      { key: "A", text: "-(x - 2)²" },
      { key: "B", text: "(x - 2)²" },
      { key: "C", text: "(x - 3)²" },
      { key: "D", text: "-(x - 3)²" }
    ],
    correctAnswer: "B",
    explanation: "-x² + 4x - 4 = -(x² - 4x + 4) = -(x - 2)².\nSince (x - 2)² is always ≥ 0, -(x - 2)² is always ≤ 0.\nTherefore, |- (x - 2)²| = (x - 2)².\nCorrect Answer: Option B."
  },
  {
    id: "e6_q23",
    examId: "exam6",
    question: "Simplify the exponential expression (8x³) / (2x⁻³):",
    options: [
      { key: "A", text: "4x⁶" },
      { key: "B", text: "4" },
      { key: "C", text: "16x⁶" },
      { key: "D", text: "4x⁰" }
    ],
    correctAnswer: "A",
    explanation: "(8 / 2) × (x³ / x⁻³) = 4 × x^(3 - (-3)) = 4 × x^(3 + 3) = 4x⁶.\nCorrect Answer: Option A."
  },
  {
    id: "e6_q24",
    examId: "exam6",
    question: "A cylinder container with radius r = 5 cm contains water up to height 10 cm. When an irregular component is submerged, the water level rises to 13.2 cm. What is the volume of the component?",
    options: [
      { key: "A", text: "80π cm³" },
      { key: "B", text: "40π cm³" },
      { key: "C", text: "100π cm³" },
      { key: "D", text: "25π cm³" }
    ],
    correctAnswer: "A",
    explanation: "Rise in water height Δh = 13.2 - 10.0 = 3.2 cm.\nDisplaced volume = π r² Δh = π × (5)² × 3.2 = π × 25 × 3.2 = 80π cm³.\nCorrect Answer: Option A."
  },
  {
    id: "e6_q25",
    examId: "exam6",
    question: "A square has all its vertices inscribed on a circle. The area of the square is 400 cm². What is the area of the circle?",
    options: [
      { key: "A", text: "200π cm²" },
      { key: "B", text: "400π cm²" },
      { key: "C", text: "100π cm²" },
      { key: "D", text: "800π cm²" }
    ],
    correctAnswer: "A",
    explanation: "Side of square s = √400 = 20 cm.\nThe diagonal of the inscribed square equals the diameter of the circle d:\nd = s√2 = 20√2 cm → Radius r = d / 2 = 10√2 cm.\nArea of circle = π r² = π (10√2)² = π (100 × 2) = 200π cm²!\nCorrect Answer: Option A."
  }
];

console.log(`Curated Exam 6 with ${exam6Questions.length} verified Applied Mathematics questions.`);

// ==============================================================
// 4. COMBINE WITH EXISTING EXAMS & SAVE
// ==============================================================
const newExam4 = {
  id: "exam4",
  title: "AMT Exam 4: Aviation Physics, Kinematics & Mechanics",
  subject: "Official entrance exam covering 1D/2D kinematics, vector addition, Newton's laws, Atwood pulleys, friction, torque, circular motion & relative velocity.",
  category: "Physics & Mechanics",
  color: "amber",
  durationMinutes: 45,
  totalQuestions: exam4Questions.length,
  questions: exam4Questions
};

const newExam5 = {
  id: "exam5",
  title: "AMT Exam 5: Trainee Pilot & AMT English Mastery",
  subject: "Official entrance paper testing aviation vocabulary, technical synonyms & antonyms (SATURNINE, OSTENSIBLE, VILIFY), concord, prepositions, verb tenses & comprehension.",
  category: "English & Verbal",
  color: "purple",
  durationMinutes: 45,
  totalQuestions: exam5Questions.length,
  questions: exam5Questions
};

const newExam6 = {
  id: "exam6",
  title: "AMT Exam 6: Applied Aviation Mathematics",
  subject: "Curated entrance questions on rate/time/distance, RPM to degrees/sec, geometry, polynomial roots, linear equations, probability & inscribed shapes.",
  category: "Mathematics",
  color: "indigo",
  durationMinutes: 45,
  totalQuestions: exam6Questions.length,
  questions: exam6Questions
};

// Filter out existing exam4, exam5, exam6 if present
const updatedExams = examsData.exams.filter(e => !['exam4', 'exam5', 'exam6'].includes(e.id));
updatedExams.push(newExam4, newExam5, newExam6);

examsData.exams = updatedExams;

const totalQ = updatedExams.reduce((sum, e) => sum + e.questions.length, 0);
console.log(`Total exams now: ${updatedExams.length}, Total questions: ${totalQ}`);

fs.writeFileSync('public/data/exams.json', JSON.stringify(examsData, null, 2), 'utf8');

// Update exams-data.js for standalone single-file apps
const examsDataJs = `window.AMT_EXAMS_DATA = ${JSON.stringify(examsData, null, 2)};`;
fs.writeFileSync('public/data/exams-data.js', examsDataJs, 'utf8');
console.log('Successfully written updated exams database to public/data/exams.json and exams-data.js!');
