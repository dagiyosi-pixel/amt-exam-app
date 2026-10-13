import fs from 'fs';

export const masterNotes = [
  {
    id: "part1",
    number: 1,
    title: "Part 1: Reading Comprehension Strategies & Technical Analysis",
    shortTitle: "Part 1: Reading",
    icon: "book-open",
    content: `1.1 Core Strategies for Technical Passages
• Strategy 1: Skim for Global Architecture Before Analyzing Details
Quickly scan the passage in 30–45 seconds to map its structure (problem-solution, historical sequence, technological comparison, cause-and-effect). Never attempt to memorize technical numbers on the first pass.

• Strategy 2: Anchor Every Factual Answer Directly to the Text
For questions concerning dates, component names, regulatory numbers, or percentages, do not trust memory. Return to the referenced paragraph. The correct answer must be explicitly affirmed or logically entailed by the passage text.

• Strategy 3: Identify and Eliminate Extreme & Absolute Language
Statements featuring extreme quantifiers—such as "always", "never", "exclusively", "wholly", "completely", or "only"—are almost universally incorrect unless the source passage uses identical absolute phraseology. Conversely, qualifying modal verbs—such as "can", "may", "typically", "often", and "partially"—indicate nuanced, defensible, and correct answers.

• Strategy 4: Contextual Vocabulary Extraction
When an exam question queries the contextual meaning of a word (e.g., "compromised", "herald", "mitigate"), read two full sentences before and after the target word. Determine whether the connotation is constructive, neutral, or detrimental to isolate the true technical synonym.

• Strategy 5: Synthesizing Multi-Sentence Inferences
For inference questions ("What can be logically inferred?"), aggregate facts distributed across distinct paragraphs. If Sentence A states that German economic output contracted, and Sentence B states that Eurozone rescue disbursements depend on German tax revenues, the valid deduction is that rescue liquidity will face constraints.

• Strategy 6: Dissecting "True", "False", and "Cannot Say"
- TRUE: Directly affirmed by the passage text without requiring unsupported assumptions.
- FALSE: Explicitly contradicted by the factual assertions in the passage.
- CANNOT SAY: The passage provides partial or zero data regarding the premise, making verification impossible.`
  },
  {
    id: "part2",
    number: 2,
    title: "Part 2: English Grammar, Syntax, Conditionals & Prepositions",
    shortTitle: "Part 2: Grammar",
    icon: "file-text",
    content: `2.1 Subject-Verb Concord (Agreement Rules)
• Core Rule: A singular subject requires a singular verb (adds -s/-es in present tense); a plural subject requires a plural verb.
  - Incorrect: "The fleet of transport aircraft are grounded."
  - Correct: "The fleet of transport aircraft is grounded." (The subject is the collective singular noun 'fleet', not 'aircraft').
• Proximity Rule with Correlative Conjunctions ("Neither... nor", "Either... or"):
  The verb agrees in number strictly with the subject closest to it.
  - "Neither the lead engineer nor the technicians were present." ('technicians' is plural → were).
  - "Neither the technicians nor the lead engineer was present." ('lead engineer' is singular → was).

2.2 Aviation Technical Prepositions
• across: Movement from one boundary or side of a surface to the opposite side ("The technician walked across the aircraft wing").
• through: Movement inside an enclosed three-dimensional volume ("Hydraulic fluid circulates through the pressurized line").
• into: Motion directed toward the interior of a container ("Place the torque wrench into the cabinet").
• at: Specific points in space, calibrations, or temperatures ("The turbine ignites at 600°C").
• in accordance with: Strict compliance with official publications ("The inspection was completed in accordance with the maintenance manual").
• good at: Demonstrating technical skill ("She is remarkably skilled at diagnosing electrical faults").

2.3 Conditional Clauses (The Four Structural Types)
• Zero Conditional (Universal Laws & Physics):
  Structure: If + Present Simple, Present Simple.
  Example: "If hydraulic fluid pressure drops below 1,500 PSI, the warning annunciator illuminates."
• First Conditional (Real Future Scenarios):
  Structure: If + Present Simple, will + Verb.
  Example: "If the crack exceeds allowable limits, the supervisor will reject the component."
• Second Conditional (Hypothetical / Unreal Present):
  Structure: If + Past Simple, would + Verb.
  Example: "If the airline had additional spare engines, it would expand transatlantic routes."
• Third Conditional (Unreal Past / Missed Opportunity):
  Structure: If + Past Perfect (had + past participle), would have + Past Participle.
  Example: "If the mechanic had inspected the o-ring earlier, the flight would not have experienced fluid starvation."`
  },
  {
    id: "part3",
    number: 3,
    title: "Part 3: Technical Aviation Vocabulary, Synonyms & Antonyms",
    shortTitle: "Part 3: Vocab",
    icon: "list",
    content: `3.1 High-Yield Technical Synonyms
• ARDUOUS → Strenuous, laborious, demanding, challenging.
• MITIGATE → Alleviate, reduce, lessen, abate, temper.
• FORMULATE → Devise, construct, engineer, develop.
• AMBIGUOUS → Equivocal, vague, indefinite, indistinct.
• COHESIVE → Unified, connected, integrated, bonded.
• VIABLE → Feasible, workable, practicable, operational.
• LUMINOUS → Radiant, brilliant, emitting light.
• DEBACLE → Catastrophe, breakdown, total failure, collapse.
• ADVERSITY → Hardship, affliction, misfortune.
• PREREQUISITE → Mandatory condition, requirement, essential.

3.2 High-Yield Technical Antonyms
• AUGMENT (to expand or make greater) ↔ SHRINK, diminish, decrease, reduce.
• EXCEPTIONALLY (unusually or extraordinarily) ↔ CUSTOMARILY, ordinarily, routinely.
• INEVITABLE (unavoidable) ↔ OPTIONAL, preventable, avoidable.
• VIABLE (workable, capable of success) ↔ IMPRACTICAL, impossible, hopeless.
• ACCORDANCE (agreement, compliance) ↔ CONFLICT, contradiction, defiance.
• MANIFEST (apparent, obvious) ↔ CONCEALED, latent, hidden.
• PRELIMINARY (initial, introductory) ↔ FINAL, concluding, definitive.

3.3 Crucial Technical Spelling Watchlist
• Maintenance (m-a-i-n-t-e-n-a-n-c-e) — Note: ends with -ance, not -ence!
• Satellite (s-a-t-e-l-l-i-t-e) — One 't', double 'l'.
• Foreign (f-o-r-e-i-g-n) — 'e' precedes 'i'.
• Gauge (g-a-u-g-e) — 'a' precedes 'u'.
• Independent (i-n-d-e-p-e-n-d-e-n-t) — Ends with -ent, never -ant.
• Occurrence (o-c-c-u-r-r-e-n-c-e) — Double 'c', double 'r'.`
  },
  {
    id: "part4",
    number: 4,
    title: "Part 4: Verbal Analogies & Linguistic Reasoning",
    shortTitle: "Part 4: Verbal",
    icon: "git-merge",
    content: `4.1 Relationship Classifications in Analogies
• Function / Control:
  - Brake : Vehicle :: Rudder : Ship (A brake controls/retards a vehicle; a rudder steers a ship).
  - Microphone : Loud :: Microscope : Magnify (A microphone intensifies acoustic amplitude; a microscope magnifies visual scale).
• Profession : Primary Operational Environment:
  - Doctor : Hospital :: Pilot : Cockpit :: Mechanic : Hangar.
• Tool : Material / Artifact:
  - Sculptor : Statue :: Architect : Building :: Carpenter : Airframe.
• Container : Commodity:
  - Cup : Coffee :: Bowl : Soup.
• Antonym Pairs:
  - Decrease : Increase :: Beauty : Ugliness :: Stagnant : Flowing.

4.2 Linguistic Hierarchy (Ascending Structural Scale)
Letters (Graphemes) → Words (Lexemes) → Phrases (Constituents) → Sentences (Clauses) → Paragraphs (Discourse).`
  },
  {
    id: "part5",
    number: 5,
    title: "Part 5: Master Mathematics Curriculum (Probability, Binary, Functions, Geometry & Fractions)",
    shortTitle: "Part 5: Mathematics 📐",
    icon: "percent",
    content: `5.1 Probability & Combinatorics
• Classical Definition:
  P(Event) = (Number of Favorable Outcomes) / (Total Number of Exhaustive Outcomes).
• The "At-Least-One" Complement Rule:
  Calculating "at least one" directly is computationally tedious. Always calculate the probability of the complement ("none") and subtract from 1:
  P(At least one) = 1 - P(None).
  Example: When tossing a fair coin 3 times, what is the probability of getting at least one head?
  P(No heads) = P(TTT) = (1/2) × (1/2) × (1/2) = 1/8.
  P(At least 1 Head) = 1 - 1/8 = 7/8.
• Independent vs. Dependent Events:
  - Independent (With Replacement): P(A and B) = P(A) × P(B).
  - Dependent (Without Replacement): P(A and B) = P(A) × P(B | A). Total sample space and target count both decrease by 1!
• Handshake & Pairing Combinations:
  For n distinct participants, the number of unique pairwise handshakes is given by:
  Combinations = C(n, 2) = n(n - 1) / 2.
  Example: 6 engineers meet for a shift briefing.
  Handshakes = 6 × 5 / 2 = 15.

5.2 Binary Number Systems (Base-2 Computation)
• Fundamental Architecture:
  The binary system uses only digits 0 and 1. Positional place values correspond to successive integer powers of 2 from right to left:
  2⁷=128 | 2⁶=64 | 2⁵=32 | 2⁴=16 | 2³=8 | 2²=4 | 2¹=2 | 2⁰=1.
• Binary to Decimal Conversion:
  Example: Convert binary 10110₂ to base-10:
  (1 × 16) + (0 × 8) + (1 × 4) + (1 × 2) + (0 × 1) = 16 + 0 + 4 + 2 + 0 = 22₁₀.
• Decimal to Binary Conversion (Successive Power Subtraction):
  Example: Convert decimal 25₁₀ to binary:
  25 - 16 = 9 (place bit 1 at 16)
  9 - 8 = 1   (place bit 1 at 8)
  4 > 1       (place bit 0 at 4)
  2 > 1       (place bit 0 at 2)
  1 - 1 = 0   (place bit 1 at 1)
  Result: 11001₂.
• High-Speed Parity Shortcut:
  Look at the Least Significant Bit (LSB / rightmost bit):
  - If LSB = 1, the number is always ODD.
  - If LSB = 0, the number is always EVEN.

5.3 Functions & Algebraic Systems
• Function Evaluation:
  To evaluate f(a), substitute the quantity 'a' everywhere variable 'x' appears.
  Example: If f(x) = 3x² - 5x + 2, evaluate f(-2):
  f(-2) = 3(-2)² - 5(-2) + 2 = 3(4) + 10 + 2 = 12 + 10 + 2 = 24.
  Watch Out: (-2)² = +4, but -2² = -4. Squaring a negative inside parentheses always yields a positive number!
• Domain Restrictions (Undefined Points):
  1. Denominators cannot equal zero: f(x) = 5 / (x - 4) → Domain: x ≠ 4.
  2. Values beneath an even radical cannot be negative: f(x) = √(x - 3) → Domain: x ≥ 3.
• Difference of Two Squares:
  x² - y² = (x - y)(x + y).
  If x² - y² = 96 and x - y = 8, then 8(x + y) = 96 → x + y = 12.
  Solving for y: (x + y) - (x - y) = 12 - 8 → 2y = 4 → y = 2.

5.4 Geometry & Planar Measurements
• Triangles:
  - Interior angle sum is always 180°.
  - Area = (1/2) × base × height.
  - Right Triangle Pythagorean Theorem: a² + b² = c².
  - Essential Pythagorean Triples: (3, 4, 5), (5, 12, 13), (7, 24, 25), (8, 15, 17).
• Circles & Semicircles:
  - Radius vs. Diameter Trap: Radius r = d / 2.
  - Circle Area = πr²; Circumference = 2πr = πd.
  - Semicircle Area = (1/2)πr².
  - Closed Semicircle Perimeter Trap: Perimeter = πr + 2r (arc length plus straight diameter base).
• Trapezoids:
  Area = ((Base₁ + Base₂) / 2) × height.

5.5 Decimals, Fractions & Wave Frequency / Time Period
• Fractions to Decimals:
  Scale denominator to 10, 100, or 1000: 7/25 = (7 × 4) / (25 × 4) = 28/100 = 0.28.
• Recurring Decimals:
  Single recurring digit: 0.333... = 1/3; 0.777... = 7/9.
  Double recurring digits: 0.2727... = 27/99 = 3/11.
• Wave Frequency (f) vs. Time Period (T):
  Frequency (Hertz, cycles per second) is the exact mathematical reciprocal of Time Period (seconds):
  f = 1 / T   and   T = 1 / f.
  Example 1: If an alternating waveform has a Period T = 0.02 seconds (decimal), find its frequency:
  f = 1 / 0.02 = 100 / 2 = 50 Hz.
  Example 2 (Aircraft 400 Hz Electrical Power):
  Standard commercial aircraft AC electrical systems operate at 400 Hz. What is the period?
  T = 1 / 400 = 0.0025 seconds = 2.5 milliseconds.`
  },
  {
    id: "part6",
    number: 6,
    title: "Part 6: Critical Reasoning & Deductive Logic",
    shortTitle: "Part 6: Logic",
    icon: "check-circle",
    content: `6.1 Argument Topology
• Premise: Factual evidence provided to establish grounds for belief.
• Conclusion: The core claim or position asserted by the author.
• Assumption: The unstated logical bridge connecting premise to conclusion.

6.2 Weakening Arguments
To weaken an argument, identify an option that introduces a new external fact breaking the causal link between premise and conclusion.
Example: Argument claims workplace meditation exercises enhance manufacturing throughput.
Strongest Weakener: "Technicians participating in exercises spend equivalent non-productive minutes, yielding identical gross daily output."

6.3 Categorical Syllogisms & Venn Logic
Premise 1: All engineers wear safety boots (Engineers ⊂ Safety Boot Wearers).
Premise 2: All safety boot wearers work in the hangar (Safety Boot Wearers ⊂ Hangar Workers).
Valid Deductions:
- All engineers work in the hangar (TRUE).
- All hangar workers are engineers (FALSE - other hangar personnel may exist).`
  },
  {
    id: "part7",
    number: 7,
    title: "Part 7: Mechanical Reasoning, Simple Machines & Levers",
    shortTitle: "Part 7: Levers & Machines ⚙️",
    icon: "tool",
    content: `7.1 Principle of Moments & Rotational Equilibrium
• Rotational Torque:
  Torque (τ) = Force × Perpendicular Distance from Fulcrum (τ = F × d).
• Static Equilibrium:
  Clockwise Moments = Counter-Clockwise Moments.
  F₁ × d₁ = F₂ × d₂.
  Example: A 20 lb weight sits 10 ft left of the fulcrum (20 × 10 = 200 ft-lb). What weight at 5 ft on the right balances it?
  F₂ × 5 = 200 → F₂ = 40 lb.

7.2 The Three Classes of Levers (The Unbreakable FLE Rule)
Remember the mnemonic "F - L - E (1 - 2 - 3)" to know what resides in the MIDDLE:
• Class 1 Lever (Fulcrum in the center):
  Order: Load — Fulcrum — Effort.
  Examples: Crowbar, seesaw, scissors, pliers.
  Mechanical Advantage (MA) can be greater than, equal to, or less than 1. Changes the direction of applied effort.
• Class 2 Lever (Load in the center):
  Order: Fulcrum — Load — Effort.
  Examples: Wheelbarrow, nutcracker, aircraft brake pedals.
  Effort arm is always longer than load arm → MA is always > 1. Multiplies input force.
• Class 3 Lever (Effort in the center):
  Order: Fulcrum — Effort — Load.
  Examples: Tweezers, tongs, human forearm, hydraulic cylinder retracting landing gear.
  Load arm is longer than effort arm → MA is always < 1. Multiplies displacement and speed, but requires greater input effort.

7.3 Pulley Systems
• Single Fixed Pulley:
  MA = 1. Changes force direction only. Input effort equals the weight lifted.
• Single Movable Pulley (Supported by 2 rope strands):
  MA = 2. Halves the required effort: Effort = Load / 2.
  To lift a 24 lb crate: Effort = 24 / 2 = 12 lbs.
• Mechanical Advantage of Complex Pulleys:
  MA equals the total number of rope strands directly supporting the movable load block.`
  },
  {
    id: "part8",
    number: 8,
    title: "Part 8: Spatial, Pattern & Diagrammatic Reasoning",
    shortTitle: "Part 8: Spatial",
    icon: "grid",
    content: `8.1 Diagrammatic Matrix Reasoning
• Latin Square Distribution:
  Each row and column must contain every geometric primitive (e.g., circle, square, triangle) exactly once.
• Incremental Rotations:
  Check for uniform clockwise or counter-clockwise angular increments (45°, 90°, 180°).
• Element Addition / Subtraction:
  Track the count of intersection vertices, internal hatching lines, and shaded vs. hollow fills.

8.2 3D Spatial Assembly & Block Stacking
• Cube Nets:
  In standard cross-shaped cube nets, faces separated by exactly one intervening square fold into opposite parallel faces.
• Surface Contact Verification:
  When counting block contacts, count only continuous facial contacts. Shared edges and point vertices do not count as contact surfaces.`
  },
  {
    id: "part9",
    number: 9,
    title: "Part 9: Aviation Physics, Thermodynamics, Circuits, Charges & Magnetism",
    shortTitle: "Part 9: Aviation Physics ⚡",
    icon: "activity",
    content: `9.1 Thermodynamics & The Three Heat Transfer Mechanisms
• Conduction:
  Heat transfer via direct microscopic collisions of electrons and atoms within solids. Metals (copper, aluminum) are excellent thermal conductors due to free electrons.
• Convection:
  Heat transfer by the macroscopic bulk displacement of a fluid (liquid or gas). Hot fluid expands, density decreases, and it rises; cooler, denser fluid descends.
• Radiation:
  Heat transfer through electromagnetic waves (infrared photons).
  CRITICAL EXAM TRAP: Radiation is the ONLY heat transfer mechanism that requires NO physical medium and can propagate across a complete vacuum (empty space)!
• Temperature vs. Heat:
  - Temperature: Physical measure of the average translational kinetic energy of molecules.
  - Heat: Total thermal energy transferred between systems due to a temperature gradient.
• Absolute Zero:
  0 Kelvin = -273.15°C. All classical molecular kinetic motion ceases.
• Aviation Gas Laws:
  - Boyle's Law: Pressure is inversely proportional to volume at constant temperature (P₁V₁ = P₂V₂).
  - Charles's Law: Volume is directly proportional to absolute temperature at constant pressure (V₁/T₁ = V₂/T₂).
  - Gay-Lussac's Law: Pressure is directly proportional to absolute temperature at constant volume (P₁/T₁ = P₂/T₂).
    Aviation Application: High-speed aircraft landing generates severe brake and tire friction. Heat transfers to the tire air chamber; because tire volume is constant, tire pressure spikes!

9.2 Force, Mass, Dynamics & Newton's Laws
• Newton's 1st Law (Inertia):
  A body remains at rest or moves at constant velocity unless acted upon by a net unbalanced external force.
• Newton's 2nd Law:
  F_net = m · a. Acceleration is directly proportional to net force and inversely proportional to mass.
• Newton's 3rd Law (Action-Reaction):
  For every action force, there is an equal and opposite reaction force.
  Examples: Jet exhaust rushing rearward exerts equal forward thrust on the turbine; high-pressure water blasting forward from a nozzle exerts an equal backward kick on the hose.
• Invariant Mass vs. Gravitational Weight:
  - Mass (m): Invariant scalar quantity representing the amount of matter and inertia in an object (measured in kilograms). Never changes regardless of altitude or planetary gravity!
  - Weight (W = mg): Downward gravitational vector force (measured in Newtons or pounds). Varies with local gravitational acceleration (g).
• Work & Power:
  - Work = F · d · cos(θ).
  - Zero-Work Condition: If force is applied perpendicular (90°) to motion, cos(90°) = 0, so Work = 0 Joules!
  - Power = Work / Time = Force × Velocity (measured in Watts or Horsepower; 1 hp = 746 Watts = 550 ft-lb/s).

9.3 Electricity: Series & Parallel Circuit Analysis
• Ohm's Law:
  V = I · R  (Voltage in Volts, Current in Amperes, Resistance in Ohms).
• Electrical Power:
  P = V · I = I²R = V² / R (Watts).
• Series Circuits:
  - Current is identical across all components: I_total = I₁ = I₂ = I₃.
  - Total Voltage is additive: V_total = V₁ + V₂ + V₃.
  - Total Resistance increases: R_total = R₁ + R₂ + R₃.
• Parallel Circuits:
  - Voltage is identical across all branches: V_total = V₁ = V₂ = V₃.
  - Total Current divides: I_total = I₁ + I₂ + I₃.
  - Total Resistance decreases: 1/R_total = 1/R₁ + 1/R₂.
  - Two-Resistor Product-Over-Sum Shortcut:
    R_eq = (R₁ × R₂) / (R₁ + R₂).
    Example: Resistors of 6Ω and 3Ω in parallel:
    R_eq = (6 × 3) / (6 + 3) = 18 / 9 = 2Ω.
  - Fast Multiple-Choice Rule: The equivalent resistance of a parallel circuit is always strictly LESS than the smallest single branch resistor!

9.4 Electric Charge Properties & Aviation Static Grounding
• Fundamental Law of Electrostatics:
  - Like charges repel (+ and +, - and -).
  - Opposite charges attract (+ and -).
• Quantization of Charge:
  Q = n · e, where elementary electron charge e = 1.602 × 10⁻¹⁹ Coulombs.
• Coulomb's Law:
  F = k · (|q₁ q₂| / r²).
  Inverse-Square Law: Doubling the separation distance reduces electrostatic force to one-fourth (1/4)!
• Aviation Static Grounding (Fuel Safety):
  When aircraft fuel flows through delivery hoses and filter systems, fluid friction strips electrons and generates dangerous electrostatic charges. A single discharge spark can ignite volatile fuel-air mixtures. Grounding the airframe to a certified earth point safely dissipates electrostatic potential before fuel caps are opened.

9.5 Magnetism & Electromagnetism Concepts
• Magnetic Poles:
  Every magnet has a North and a South pole. Like poles repel; unlike poles attract.
  No Magnetic Monopoles: Cutting a magnet in half yields two complete magnets, each with its own N and S poles.
• Magnetic Field Lines:
  Field lines form continuous closed loops: directed from North to South externally, and returning South to North internally.
• Magnetic Force on Moving Charges:
  F = q · v · B · sin(θ).
  CRITICAL TRAPS:
  - Stationary charges (v = 0) experience ZERO magnetic force!
  - Charges moving parallel to magnetic field lines (θ = 0°) experience ZERO magnetic force!
  - Maximum force occurs when moving perpendicular (θ = 90°) to field lines.
• Faraday's Law of Electromagnetic Induction:
  A changing magnetic field through a conductor induces an electromotive force (EMF / Voltage).
  This governs the operation of aircraft AC generators, alternators, transformers, and engine ignition magnetos.`
  },
  {
    id: "part10",
    number: 10,
    title: "Part 10: High-Yield Exam Traps & Rapid Recall Cheat Sheet",
    shortTitle: "Part 10: Exam Traps 🎯",
    icon: "award",
    content: `10.1 Quick Math Traps & Shortcuts
1. Radius vs. Diameter: If the problem provides Diameter (d = 12 cm), immediately divide by 2 to get Radius (r = 6 cm) before applying πr².
2. Semicircle Perimeter: Arc length is πr, but a closed semicircle also includes the straight base (+ 2r). Perimeter = πr + 2r.
3. Negative Signs in Functions: When evaluating f(-3) for x², (-3)² = +9. Parentheses make it positive.
4. "At Least One" Probability: Compute 1 - P(None). Never sum individual permutations.
5. Binary Parity Check: If the last digit of a binary number is 1, it is odd; if 0, it is even.
6. Handshakes Among n People: Use n(n - 1) / 2. (For 6 people: 6 × 5 / 2 = 15).

10.2 Quick Physics Traps & Shortcuts
1. Vacuum Heat Propagation: Only Radiation can transfer thermal energy through empty space without physical matter.
2. Invariant Mass: Mass (kg) never changes regardless of flight altitude or gravitational field. Weight (N) changes with gravity (W = mg).
3. Zero Mechanical Work: When applied force is perpendicular (90°) to displacement, Work done is strictly 0 Joules.
4. Parallel Circuit Resistance: Equivalent resistance in parallel is ALWAYS smaller than the smallest branch resistor.
5. Stationary Charges in Magnetic Fields: A stationary electric charge experiences zero magnetic force (F = qvB = 0 when v = 0).
6. Aircraft Tire Pressure Rise: Governed by Gay-Lussac's Law (P₁/T₁ = P₂/T₂) because tire air volume remains constant while friction generates heat.
7. Aircraft Fuel Grounding: Connected to an earth point to prevent electrostatic spark discharge from igniting fuel vapors.`
  }
];

// Write to public/data/notes-data.js
const jsContent = `// Ethiopian AMT Exam Master - Complete Official Notes & Formulas
window.AMT_NOTES_DATA = ${JSON.stringify(masterNotes, null, 2)};
`;

fs.writeFileSync('public/data/notes-data.js', jsContent);
console.log(`Successfully generated public/data/notes-data.js with ${masterNotes.length} detailed modules!`);
