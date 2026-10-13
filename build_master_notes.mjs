import fs from 'fs';

export const masterNotes = [
  {
    id: "part1",
    number: 1,
    title: "Part 1: Reading Comprehension Ninja Strategies",
    shortTitle: "Part 1: Reading Ninja 🥷",
    icon: "book-open",
    content: `1.1 How to Read Like an Aviation Radar Operator
• Strategy 1: The 45-Second Flight Path Scan
Don't get bogged down in the swamp of technical numbers on your first pass! Scan the passage like radar mapping terrain in 30–45 seconds. Find the big picture: Is it talking about a broken engine (problem-solution), turbine history (timeline), or comparing Boeing vs Airbus materials (comparison)?

• Strategy 2: Anchor Truth to the Text, Not Your Imagination
🚨 [TRAP ALERT]: The exam makers love inserting answers that sound completely logical in real life, but are NOT mentioned anywhere in the passage! If the text doesn't say it, treat it as unproven.
- TRUE: Directly stated in black and white by the author.
- FALSE: Explicitly contradicted by facts in the passage.
- CANNOT SAY: You might know it from personal life, but the text is silent!

• Strategy 3: The Extreme Word Red Flag
Whenever an answer choice contains extreme words—like "always", "never", "only", "completely", "exclusively"—your mental alarm bells should ring!
⚡ [SPEED SHORTCUT]: Extreme statements are 95% wrong in comprehension exams. Nuanced words like "often", "can", "may", "partially", and "typically" are almost always the winning answers.

• Strategy 4: The 2-Sentence Spy Technique
Encountered a scary vocabulary word like "mitigate" or "debacle"? Read two full sentences before it and two sentences after it. The tone (danger vs safety, success vs failure) will instantly expose its true meaning.

🧠 [POP QUIZ]: A passage explains that jet fuel prices increased, but never mentions ticket prices. The question asks: "Did airline ticket prices rise? (True / False / Cannot Say)". What is the answer? || CANNOT SAY! Even though ticket prices obviously rise in the real world, the passage never affirmed it!`
  },
  {
    id: "part2",
    number: 2,
    title: "Part 2: English Grammar, Syntax & Aviation Concord",
    shortTitle: "Part 2: Grammar & Rules ✍️",
    icon: "file-text",
    content: `2.1 Subject-Verb Concord (The Collective Trap)
• The "Fleet" & "Crew" Illusion
Don't let long descriptive prepositional phrases trick your verb agreement!
- ❌ Wrong: "The fleet of 40 cargo aircraft are grounded."
- ✅ Right: "The fleet of 40 cargo aircraft is grounded." (The true subject is the singular noun 'fleet', not the 40 aircraft!).

• The Closest Neighbor Rule ("Neither... Nor" & "Either... Or")
💡 [AHA! MOMENT]: When "Neither... nor" enters the hangar, the verb only cares about its absolute closest neighbor!
- "Neither the captain nor the technicians were ready." ('technicians' is plural → were).
- "Neither the technicians nor the captain was ready." ('captain' is singular → was).

2.2 Aviation Prepositions: Where Things Actually Go
• across: Gliding from one edge of a flat surface to the other ("The engineer walked across the wing").
• through: Traveling inside a 3D enclosed tube or volume ("Hydraulic fluid shoots through the steel line").
• into: Moving from outside to the inside of a container ("Put the torque wrench into the toolbox").
• at: Pinpoint temperatures or calibrations ("The turbine ignites at 600°C").
• in accordance with: Strict manual compliance ("Work completed in accordance with the maintenance manual").

2.3 The Four Flight Levels of Conditionals
• Zero Conditional (Laws of Nature): If + Present, Present.
  "If fuel pressure drops below 1,500 PSI, the warning horn sounds."
• First Conditional (Real Tomorrow): If + Present, will + Verb.
  "If the crack grows, the inspector will reject the fuselage."
• Second Conditional (The Unreal Daydream): If + Past, would + Verb.
  "If we had five spare engines, we would fly to London tomorrow."
• Third Conditional (The Hindsight Regret): If + Past Perfect, would have + Past Participle.
  "If the technician had tightened the bolt, the leak would not have occurred."

🧠 [POP QUIZ]: Fill the blank: "Neither the flight attendants nor the chief pilot ___ (was/were) informed." || WAS! The singular noun 'chief pilot' is closest to the verb!`
  },
  {
    id: "part3",
    number: 3,
    title: "Part 3: Technical Aviation Vocabulary & Spelling Traps",
    shortTitle: "Part 3: Vocab Vault 📖",
    icon: "list",
    content: `3.1 High-Yield Technical Synonyms
• ARDUOUS → Strenuous, grueling, backbreaking, exhausting.
• MITIGATE → Alleviate, reduce, lessen, cool down, abate.
• FORMULATE → Devise, invent, engineer, construct.
• AMBIGUOUS → Vague, unclear, hazy, equivocal.
• COHESIVE → Unified, bonded together, sticky, integrated.
• VIABLE → Workable, feasible, usable, practical.
• DEBACLE → Total disaster, catastrophe, complete failure.
• ADVERSITY → Hardship, tough times, misfortune.

3.2 High-Yield Technical Antonyms (Opposites)
• AUGMENT (make bigger, beef up) ↔ SHRINK, diminish, deplete, reduce.
• EXCEPTIONALLY (extraordinary) ↔ ORDINARILY, customarily, routinely.
• INEVITABLE (bound to happen) ↔ PREVENTABLE, avoidable, optional.
• ACCORDANCE (following rules) ↔ DEFIANCE, conflict, disobedience.
• PRELIMINARY (starting warm-up) ↔ FINAL, concluding, definitive.

3.3 The Top 5 Spelling Assassins on the Exam
🚨 [TRAP ALERT]: These 5 words are deliberately planted in questions to catch careless eyes:
1. Maintenance (m-a-i-n-t-e-n-a-n-c-e) → Remember: ends in -ANCE, never -ence!
2. Gauge (g-a-u-g-e) → 'a' comes before 'u'!
3. Satellite (s-a-t-e-l-l-i-t-e) → One 't', double 'l'!
4. Occurrence (o-c-c-u-r-r-e-n-c-e) → Double 'c', double 'r'!
5. Independent (i-n-d-e-p-e-n-d-e-n-t) → Ends in -ENT, never -ant!

🧠 [POP QUIZ]: What is the exact technical antonym of the word "AUGMENT"? || DIMINISH or REDUCE (Augment means to expand or enlarge).`
  },
  {
    id: "part4",
    number: 4,
    title: "Part 4: Verbal Analogies & Mind Benders",
    shortTitle: "Part 4: Analogies & Logic 🧩",
    icon: "git-merge",
    content: `4.1 Cracking the Analogy Secret Code
An analogy is simply a math equation made of words: A is to B exactly as C is to D (A : B :: C : D).
Always build a super specific sentence connecting the first pair, then test that exact sentence on the options!

• Pattern 1: Control & Steering
- Rudder : Ship :: Elevator : Airplane
  (A rudder steers a ship horizontally; an elevator controls an aircraft pitch vertically!).
- Brake : Wheel :: Reverse Thrust : Jet Engine
  (Both decelerate motion).

• Pattern 2: Tool to Craft
- Micrometer : Machinist :: Stethoscope : Doctor :: Rivet Gun : Sheet Metal Tech.

• Pattern 3: The Expanding Universe of Language
💡 [AHA! MOMENT]: Letters make Words, Words make Phrases, Phrases make Sentences, Sentences make Paragraphs!
Letters (Graphemes) → Words (Lexemes) → Phrases → Sentences → Paragraphs.

🧠 [POP QUIZ]: Complete the analogy: Microphone : Amplify :: Microscope : ___? || MAGNIFY (A microphone amplifies sound; a microscope magnifies sight!).`
  },
  {
    id: "part5",
    number: 5,
    title: "Part 5: Master Mathematics Curriculum (Probability, Binary, Functions, Geometry & Fractions)",
    shortTitle: "Part 5: Mathematics 📐",
    icon: "percent",
    content: `5.1 Probability: The Lazy Genius Complement Hack
• Classical Probability:
📐 [FORMULA]: P(Event) = (Favorable Outcomes) / (Total Possible Outcomes)

• The "At-Least-One" Miracle Shortcut:
Calculating "at least one head" in multiple coin tosses usually requires adding lots of branches. Don't waste 3 minutes!
⚡ [SPEED SHORTCUT]: Always calculate the chance of getting ZERO (none), and subtract it from 1:
📐 [FORMULA]: P(At least one) = 1 - P(None)
Example: Toss a fair coin 3 times. What is the probability of getting at least one head?
- P(No heads at all) = P(Tail, Tail, Tail) = (1/2) × (1/2) × (1/2) = 1/8.
- P(At least 1 Head) = 1 - 1/8 = 7/8! (Done in 5 seconds!).

• The Handshake Party Formula:
If n aircraft mechanics meet in a hangar and everyone shakes hands with everyone else once:
📐 [FORMULA]: Handshakes = n(n - 1) / 2
Example: 6 mechanics meet for morning inspection: 6 × 5 / 2 = 15 handshakes!

5.2 Binary Number Systems (The Light Switch Game)
Computers and flight management systems speak in Base-2 (0 and 1). Each position represents a power of 2:
[128] [64] [32] [16] [8] [4] [2] [1]

• Binary to Decimal Example: Convert 10110₂:
Turn ON: 16 + 4 + 2 = 22₁₀!

• Decimal to Binary Example: Convert 25₁₀:
- 25 - 16 = 9  (Bit 1 at 16)
- 9 - 8 = 1    (Bit 1 at 8)
- 4 is too big (Bit 0 at 4)
- 2 is too big (Bit 0 at 2)
- 1 - 1 = 0    (Bit 1 at 1)
Result: 11001₂!

⚡ [SPEED SHORTCUT]: The Instant Odd/Even Parity Trick:
Look ONLY at the very last digit (the Least Significant Bit):
- If the last bit is 1 → The number is always ODD!
- If the last bit is 0 → The number is always EVEN!

5.3 Functions & The Parentheses Bodyguard
• The Negative Sign Ambush:
🚨 [TRAP ALERT]: Look at this carefully:
(-3)² = (-3) × (-3) = +9 (Parentheses protect the minus!).
-3² = -(3 × 3) = -9 (The minus sign stays outside!).
When evaluating f(-2) for f(x) = 3x² - 4x + 1:
f(-2) = 3(-2)² - 4(-2) + 1 = 3(4) + 8 + 1 = 12 + 8 + 1 = 21!

• Two Golden Domain Red Lines:
1. Division by Zero is strictly forbidden! If f(x) = 10 / (x - 7), domain is x ≠ 7.
2. Square roots of negative numbers don't exist in real math! If f(x) = √(x - 5), then x ≥ 5.

• The Difference of Two Squares:
📐 [FORMULA]: x² - y² = (x - y)(x + y)
If x² - y² = 80 and x - y = 8, then 8(x + y) = 80 → x + y = 10!
Subtract equations: (x + y) - (x - y) = 10 - 8 → 2y = 2 → y = 1!

5.4 Geometry: The Sneaky Semicircle & Pythagorean Triples
• The Pythagorean Triples to Tattoo on Your Brain:
Don't waste time squaring numbers! Memorize these classic right triangles:
- (3, 4, 5)   [or 6, 8, 10]
- (5, 12, 13) [or 10, 24, 26]
- (7, 24, 25)
- (8, 15, 17)

• The Sneaky Semicircle Perimeter Trap:
🚨 [TRAP ALERT]: Arc length of a semicircle is πr. But if the problem says "CLOSED semicircle" or shows a solid shape, you MUST add the straight bottom diameter (+ 2r)!
📐 [FORMULA]: Closed Semicircle Perimeter = πr + 2r

5.5 Decimals, Fractions & The Reciprocal Dance (f = 1 / T)
• Quick Fraction Scaling:
Need 7/25 as a decimal? Multiply top and bottom by 4:
(7 × 4) / (25 × 4) = 28/100 = 0.28!

• Wave Frequency (f) vs. Time Period (T):
Frequency (Hertz, cycles per second) and Period (seconds per cycle) are mathematical twins doing a reciprocal dance:
📐 [FORMULA]: f = 1 / T    and    T = 1 / f
Example 1: A vibration wave has Period T = 0.02 seconds. Find frequency:
f = 1 / 0.02 = 100 / 2 = 50 Hz!

✈️ [HANGAR SECRET]: Standard commercial airliners (Boeing 787, Airbus A350) use 400 Hz AC electrical systems because higher frequency allows generators and transformers to be much lighter!
What is the period of a 400 Hz aircraft electrical wave?
T = 1 / 400 = 0.0025 seconds = 2.5 milliseconds!

🧠 [POP QUIZ]: An alternating current waveform has a time period of 0.005 seconds. What is its frequency? || 200 Hz! (f = 1 / 0.005 = 1000 / 5 = 200 Hz).`
  },
  {
    id: "part6",
    number: 6,
    title: "Part 6: Critical Reasoning & Deductive Logic",
    shortTitle: "Part 6: Logic Master 🧠",
    icon: "check-circle",
    content: `6.1 Argument Anatomy: The 3 Pieces
• Premise: Hard evidence stated by the author (cannot be argued with).
• Conclusion: The main opinion or claim the author is selling you.
• Assumption: The hidden, unwritten bridge that holds the premise and conclusion together.

6.2 How to Destroy an Argument (Weakening Questions)
To weaken an author's conclusion, you don't attack the premise! You introduce an alternate cause that explains the result.
Example: Author says "Installing high-tech headsets caused technician mistakes to drop by 40%."
Weakener: "At the exact same time, the hangar hired senior supervisors who double-checked every inspection." (The headsets didn't do it—the supervisors did!).

6.3 Syllogisms & The Venn Diagram Trap
Premise 1: All flight captains wear white shirts.
Premise 2: Some hangar workers wear white shirts.
🚨 [TRAP ALERT]: Does this mean some hangar workers are captains? NO! White shirt wearers is a big circle that contains many different people!

🧠 [POP QUIZ]: "All jets have wings. This vehicle has wings. Therefore, it is a jet." Is this valid deduction? || False! Birds and gliders have wings too. Never reverse subset logic!`
  },
  {
    id: "part7",
    number: 7,
    title: "Part 7: Mechanical Reasoning, Simple Machines & Levers",
    shortTitle: "Part 7: Levers & Machines ⚙️",
    icon: "tool",
    content: `7.1 The Principle of Moments (Seesaw Equilibrium)
Torque is turning force:
📐 [FORMULA]: Torque (τ) = Force × Distance from Fulcrum
For rotational balance: Left Moment = Right Moment:
📐 [FORMULA]: F₁ × d₁ = F₂ × d₂
Example: A 30 lb box sits 4 feet left of the fulcrum (30 × 4 = 120 ft-lb). What weight at 6 feet to the right balances it?
F₂ × 6 = 120 → F₂ = 20 lbs!

7.2 The Unbreakable FLE Rule (Like a Flea Jumping!)
💡 [AHA! MOMENT]: How do you know which lever class is which? Just remember the word F - L - E (1 - 2 - 3) to know who sits right in the MIDDLE:

• Class 1 Lever: FULCRUM in the middle (F - 1)
  Layout: Effort — [Fulcrum] — Load
  Examples: Crowbar, scissors, seesaw, pliers.
  Superpower: Reverses force direction! Mechanical advantage can be > 1, = 1, or < 1.

• Class 2 Lever: LOAD in the middle (L - 2)
  Layout: Fulcrum — [Load] — Effort
  Examples: Wheelbarrow, nutcracker, aircraft rudder/brake pedals.
  Superpower: Effort arm is ALWAYS longer than load arm! Mechanical Advantage is ALWAYS > 1. Force multiplier—makes heavy loads feel feather-light!

• Class 3 Lever: EFFORT in the middle (E - 3)
  Layout: Fulcrum — [Effort] — Load
  Examples: Tweezers, tongs, your human forearm, hydraulic cylinder retracting landing gear.
  Superpower: Load arm is longer! Mechanical Advantage is ALWAYS < 1. It requires extra force, but multiplies speed and distance! One small cylinder stroke moves the landing gear across a huge arc!

7.3 Pulley Systems: Count the Strands!
• Single Fixed Pulley: MA = 1. Only changes pull direction. (Pull down 50 lbs to lift 50 lbs).
• Single Movable Pulley: MA = 2. Supported by 2 rope strands. Cuts your pulling effort in half!
⚡ [SPEED SHORTCUT]: To find the Mechanical Advantage of any block-and-tackle system, count the number of rope strands directly supporting the movable load!

🧠 [POP QUIZ]: A hydraulic actuator operates a landing gear door with the effort applied between the pivot hinge and the door edge. What lever class is this? || Class 3 Lever! (Effort in the middle, multiplying sweep angle and speed).`
  },
  {
    id: "part8",
    number: 8,
    title: "Part 8: Spatial, Pattern & Diagrammatic Reasoning",
    shortTitle: "Part 8: Spatial Reasoning 🧊",
    icon: "grid",
    content: `8.1 Folding Cube Nets Without Losing Your Mind
In a classic 6-square cross net:
💡 [AHA! MOMENT]: Faces separated by exactly one intervening square fold into opposite, parallel faces! They can NEVER touch or share an edge!
If Face A is separated from Face C by Face B, then Face A will be directly opposite Face C.

8.2 Diagrammatic Matrices: The Latin Square Rule
When looking at 3x3 symbol matrices:
- Check Rows & Columns: Each row must contain every shape (circle, diamond, triangle) and every fill (solid, striped, clear) exactly once.
- Check Clockwise Rotation: Look for steps of 45°, 90°, or 180°.

8.3 Block Stacking & Contact Surface Counting
🚨 [TRAP ALERT]: When an exam question asks "How many blocks touch Block X?", count ONLY flat, continuous facial contacts! Shared pointy corners (vertices) and razor edges do NOT count as surface contacts!

🧠 [POP QUIZ]: If two faces on a flat cube net share a single common edge line, will they be parallel or perpendicular when folded? || Perpendicular (adjacent at 90°)! Only faces separated by another face fold to parallel sides.`
  },
  {
    id: "part9",
    number: 9,
    title: "Part 9: Aviation Physics, Thermodynamics, Circuits, Charges & Magnetism",
    shortTitle: "Part 9: Aviation Physics ⚡",
    icon: "activity",
    content: `9.1 Thermodynamics & The Three Heat Movers
• Conduction: Direct microscopic bumper-cars of atoms in solids. Free electrons make metals (copper, aluminum) phenomenal heat conductors.
• Convection: Hot stuff expands, becomes less dense, and floats upward! Bulk displacement of fluids (liquids and gases).
• Radiation: Heat carried by infrared photons (electromagnetic waves).
🚨 [TRAP ALERT]: Radiation is the ONLY heat transfer mechanism that requires NO physical substance and travels across a complete vacuum! That's how solar heat crosses 150 million kilometers of empty space to heat aircraft skins at 40,000 feet!

• The Boeing Landing Tire Explosion Secret (Gay-Lussac's Law):
✈️ [HANGAR SECRET]: When a 300-ton airliner touches down at 250 km/h, brake friction generates intense heat (up to 800°C).
Why does tire pressure dangerously skyrocket?
Because the tire volume is fixed and rigid (V = constant).
📐 [FORMULA]: Gay-Lussac's Law: P₁ / T₁ = P₂ / T₂
When temperature spikes under constant volume, pressure MUST spike! That's why aircraft tires use fusible safety plugs that melt to safely vent air before tires explode!

9.2 Force, Mass, Dynamics & Newton's Trio
• Newton's 1st Law: Inertia. An object at rest stays at rest unless kicked by an unbalanced net force.
• Newton's 2nd Law: Acceleration is proportional to force:
📐 [FORMULA]: F_net = m · a
• Newton's 3rd Law: Action & Reaction.
A jet turbine blasts hot exhaust gases rearward with immense force; the exhaust gas pushes the engine forward with equal force!
• Invariant Mass vs Weight:
Mass (kg) is the amount of matter. It NEVER changes, whether you are on Earth, the Moon, or in deep space!
Weight (Newtons or lbs) is gravity pulling on that mass (W = mg). It changes with local gravity!
• The Perpendicular Zero-Work Trap:
📐 [FORMULA]: Work = Force × Distance × cos(θ)
🚨 [TRAP ALERT]: If you carry a heavy 40 lb battery horizontally across the hangar floor, gravity pulls down (90° to your walking direction). Since cos(90°) = 0, your vertical carrying force does ZERO mechanical work!

9.3 Electricity: Series vs. Parallel Circuits
• Ohm's Magic Triangle:
📐 [FORMULA]: V = I · R    and    Power: P = V · I = I²R

• Series Circuits (The Single-File Train):
- Current is identical everywhere: I_total = I₁ = I₂.
- Voltages add up: V_total = V₁ + V₂.
- Resistances add up: R_total = R₁ + R₂.

• Parallel Circuits (The Multi-Lane Highway):
- Voltage is identical across all branches: V_total = V₁ = V₂.
- Currents divide across lanes: I_total = I₁ + I₂.
- Total resistance DROPS when you add parallel branches!
⚡ [SPEED SHORTCUT]: Two Resistors in Parallel Product-Over-Sum:
📐 [FORMULA]: R_eq = (R₁ × R₂) / (R₁ + R₂)
Example: Resistors of 6Ω and 3Ω in parallel: (6 × 3) / (6 + 3) = 18 / 9 = 2Ω!
🚨 [TRAP ALERT]: The equivalent resistance of a parallel circuit is ALWAYS strictly smaller than the smallest branch resistor! (2Ω is smaller than 3Ω).

9.4 Electrostatics & Why Fuel Trucks Hold Hands with Airplanes
• Fundamental Rule: Like charges repel (+ and +), unlike charges attract (+ and -).
• Quantization: Q = n · e (Electron charge e = 1.602 × 10⁻¹⁹ C).
• Coulomb's Inverse-Square Law: Doubling distance reduces force to 1/4!
✈️ [HANGAR SECRET]: Aircraft Fuel Grounding:
When aviation kerosene rushes through hoses, friction strips billions of electrons, charging the aircraft to thousands of volts! One static spark can ignite fuel vapor into an inferno. Technicians clamp a heavy copper grounding cable to an earth rod BEFORE opening fuel caps to safely drain static charges.

9.5 Magnetism: The No-Monopole Law & Moving Charges
• Magnetic Field Lines: Continuous closed loops! Directed North to South outside the magnet, and returning South to North inside!
• The No-Monopole Curse: You can NEVER isolate a single North pole! Cut a magnet in two and you get two complete magnets, each with its own N and S!
• Magnetic Force on Moving Charges:
📐 [FORMULA]: F = q · v · B · sin(θ)
🚨 [TRAP ALERT]:
1. A stationary charge (v = 0) feels ZERO magnetic force!
2. A charge moving parallel to magnetic lines (θ = 0°) feels ZERO magnetic force!
3. Maximum force occurs when moving perpendicular (θ = 90°)!
• Faraday's Induction: Moving magnetic fields through wire coils generate voltage. This powers aircraft engine magnetos and AC alternators!

🧠 [POP QUIZ]: If a parallel circuit has three resistors of 100Ω, 50Ω, and 4Ω, will the total resistance be greater than 4Ω or less than 4Ω? || LESS than 4Ω! In parallel, the equivalent resistance is ALWAYS smaller than the smallest single branch!`
  },
  {
    id: "part10",
    number: 10,
    title: "Part 10: High-Yield Exam Traps & Rapid Recall Cheat Sheet",
    shortTitle: "Part 10: Rapid Cheat Sheet 🎯",
    icon: "award",
    content: `10.1 Top Math Traps You Won't Fall For
1. Radius vs. Diameter: Given d = 16 cm? Divide by 2 immediately (r = 8 cm) before calculating area πr²!
2. Closed Semicircle Perimeter: Arc length is πr, but you MUST add the straight diameter base (+ 2r). P = πr + 2r!
3. Negative Sign in Functions: (-4)² = +16, but -4² = -16!
4. "At Least One" Shortcut: Calculate 1 - P(None)!
5. Binary Parity: Last bit is 1 = ODD; last bit is 0 = EVEN!
6. Handshakes Among n People: n(n - 1) / 2!

10.2 Top Physics Traps You Won't Fall For
1. Vacuum Heat: Only Radiation can transfer thermal energy through empty space!
2. Invariant Mass: Mass in kg never changes with altitude; weight changes with gravity (W = mg)!
3. Zero Mechanical Work: If applied force is at 90° perpendicular to movement, Work is strictly 0 Joules!
4. Parallel Circuit Rule: Equivalent parallel resistance is always smaller than the smallest branch!
5. Stationary Charges: A stationary electric charge in a magnetic field feels ZERO magnetic force (v = 0)!
6. Aircraft Tire Pressure Rise: Governed by Gay-Lussac's Law (P₁/T₁ = P₂/T₂) because tire air volume is fixed!
7. Aircraft Fuel Grounding: Connected to earth to prevent electrostatic spark discharge from igniting fuel vapors!

🧠 [POP QUIZ]: A technician applies a 500 N force pushing against a locked hangar door for 1 hour, but the door never moves an inch. How much mechanical work was done? || EXACTLY 0 JOULES! Since displacement is 0, Work = F × d = 500 × 0 = 0 J!`
  }
];

// Write to public/data/notes-data.js
const jsContent = `// Ethiopian AMT Exam Master - Complete Official Notes & Formulas
window.AMT_NOTES_DATA = ${JSON.stringify(masterNotes, null, 2)};
`;

fs.writeFileSync('public/data/notes-data.js', jsContent);
console.log(`Successfully generated public/data/notes-data.js with ${masterNotes.length} FUN, interactive modules!`);
