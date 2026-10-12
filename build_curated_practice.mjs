import fs from 'fs';

function makeOptions(a, b, c, d) {
  return [
    { key: 'A', text: String(a).trim() },
    { key: 'B', text: String(b).trim() },
    { key: 'C', text: String(c).trim() },
    { key: 'D', text: String(d).trim() }
  ];
}

export const practiceQuestions = [
  {
    id: "practice_q1",
    category: "Technical English Prepositions",
    question: "Fill in the blank with the appropriate preposition: 'The mechanic placed the calibrated torque wrench _____ the tool chest.'",
    options: makeOptions("onto", "into", "at", "against"),
    correctAnswer: "B",
    explanation: "'Into' indicates movement to the interior of a container or space (the tool chest).",
    cardImage: "public/cards/practice/page_001.png"
  },
  {
    id: "practice_q2",
    category: "Technical English Conjunctions",
    question: "Choose the correct conjunction to complete the sentence: '_____ the weather was severe, the scheduled flight departed safely on time.'",
    options: makeOptions("Although", "Because", "Unless", "Since"),
    correctAnswer: "A",
    explanation: "'Although' is a concessive subordinating conjunction indicating a contrast between severe weather and on-time departure.",
    cardImage: "public/cards/practice/page_002.png"
  },
  {
    id: "practice_q3",
    category: "Technical English Conjunctions",
    question: "Choose the correct conjunction: 'Neither the pilot _____ the co-pilot noticed the sudden drop in fuel pressure.'",
    options: makeOptions("or", "nor", "and", "but"),
    correctAnswer: "B",
    explanation: "The correlative conjunction pairing with 'neither' is strictly 'nor' ('neither... nor').",
    cardImage: "public/cards/practice/page_003.png"
  },
  {
    id: "practice_q4",
    category: "Verbal Logic & Analogies",
    question: "Complete the analogy: Flow is to River as Stagnant is to _____",
    options: makeOptions("Rain", "Pool", "Stream", "Canal"),
    correctAnswer: "B",
    explanation: "A river exhibits dynamic flow, whereas a pool or pond contains still, stagnant water.",
    cardImage: "public/cards/practice/page_003.png"
  },
  {
    id: "practice_q5",
    category: "Verbal Logic & Analogies",
    question: "Complete the analogy: Microphone is to Loud as Microscope is to _____",
    options: makeOptions("Magnify", "Elongate", "Investigate", "Examine"),
    correctAnswer: "A",
    explanation: "A microphone makes auditory signals louder; a microscope magnifies visual size.",
    cardImage: "public/cards/practice/page_004.png"
  },
  {
    id: "practice_q6",
    category: "Verbal Classification",
    question: "Which of the following animals belongs to a different biological class from the rest (odd one out)?",
    options: makeOptions("Swan", "Chicken", "Snake", "Duck"),
    correctAnswer: "C",
    explanation: "Swan, Chicken, and Duck are birds (Aves), while Snake is a reptile (Squamata).",
    cardImage: "public/cards/practice/page_004.png"
  },
  {
    id: "practice_q7",
    category: "Numerical Series & Sequences",
    question: "Identify the missing number in the sequence: 11, 19, 29, 41, 55, ?",
    options: makeOptions("69", "71", "73", "75"),
    correctAnswer: "B",
    explanation: "Successive differences increase by 2: 19-11=8, 29-19=10, 41-29=12, 55-41=14. Next term: 55 + 16 = 71.",
    cardImage: "public/cards/practice/page_005.png"
  },
  {
    id: "practice_q8",
    category: "Applied Arithmetic",
    question: "If one ream of aviation log sheets costs $3.95, how much would 4 reams cost?",
    options: makeOptions("$14.75", "$15.70", "$15.80", "$16.20"),
    correctAnswer: "C",
    explanation: "Multiply quantity by unit price: 4 × $3.95 = $15.80.",
    cardImage: "public/cards/practice/page_005.png"
  },
  {
    id: "practice_q9",
    category: "Basic Arithmetic",
    question: "What is the value of the missing number: 567 = ? - 5",
    options: makeOptions("562", "572", "565", "570"),
    correctAnswer: "B",
    explanation: "Add 5 to both sides: ? = 567 + 5 = 572.",
    cardImage: "public/cards/practice/page_006.png"
  },
  {
    id: "practice_q10",
    category: "Applied Percentages",
    question: "How much in percent is 20 out of 40?",
    options: makeOptions("50%", "40%", "30%", "25%"),
    correctAnswer: "A",
    explanation: "(20 / 40) × 100% = 0.50 × 100% = 50%.",
    cardImage: "public/cards/practice/page_006.png"
  },
  {
    id: "practice_q11",
    category: "Aviation Mathematics & Logarithms",
    question: "Evaluate the logarithmic expression: log₁₀(10) =",
    options: makeOptions("0", "1", "10", "100"),
    correctAnswer: "B",
    explanation: "By definition of logarithms: log_b(b) = 1, because 10¹ = 10.",
    cardImage: "public/cards/practice/page_007.png"
  },
  {
    id: "practice_q12",
    category: "Applied Ratios & Proportions",
    question: "A sum of 48,000 Birr is divided among three aviation students in the ratio 3 : 5 : 8. How much does the student with the smallest share receive?",
    options: makeOptions("9,000 Birr", "15,000 Birr", "24,000 Birr", "12,000 Birr"),
    correctAnswer: "A",
    explanation: "Total parts = 3 + 5 + 8 = 16. Smallest share is 3 parts: (3 / 16) × 48,000 Birr = 3 × 3,000 = 9,000 Birr.",
    cardImage: "public/cards/practice/page_007.png"
  },
  {
    id: "practice_q13",
    category: "Applied Percentages",
    question: "A special discount of 2 cents off the normal price of 50 cents for a component wash packet is made. What percentage reduction does this represent?",
    options: makeOptions("2%", "4%", "5%", "8%"),
    correctAnswer: "B",
    explanation: "Percentage reduction = (2 / 50) × 100% = 4%.",
    cardImage: "public/cards/practice/page_008.png"
  },
  {
    id: "practice_q14",
    category: "Applied Fraction Computation",
    question: "Simplify the fraction expression: (12 / 7) ÷ 12 =",
    options: makeOptions("1/7", "7", "1", "12/84"),
    correctAnswer: "A",
    explanation: "(12 / 7) ÷ 12 = (12 / 7) × (1 / 12) = 1/7.",
    cardImage: "public/cards/practice/page_008.png"
  },
  {
    id: "practice_q15",
    category: "Aircraft Kinematics",
    question: "A jet aircraft starts from rest and accelerates uniformly down a runway at 4 m/s² through a distance of 200 m. How fast is it moving at the end of this distance?",
    options: makeOptions("20 m/s", "40 m/s", "50 m/s", "80 m/s"),
    correctAnswer: "B",
    explanation: "Using kinematics equation v² = u² + 2as: v² = 0 + 2(4)(200) = 1600 → v = √1600 = 40 m/s.",
    cardImage: "public/cards/practice/page_009.png"
  },
  {
    id: "practice_q16",
    category: "Applied Mechanics & Work",
    question: "In order for mechanical work to be performed by a force on an object, the direction of the component force and the displacement must be:",
    options: makeOptions(
      "In opposite directions only",
      "Non-orthogonal (having a non-zero component along the axis of displacement)",
      "Strictly perpendicular to each other",
      "Stationary at all times"
    ),
    correctAnswer: "B",
    explanation: "Work = F · d · cos(θ). If θ = 90° (perpendicular), work is zero. A non-zero force component must align along the displacement axis.",
    cardImage: "public/cards/practice/page_009.png"
  },
  {
    id: "practice_q17",
    category: "General Physics & Power",
    question: "Mechanical Power is physically defined as:",
    options: makeOptions(
      "The rate at which work is performed over time (Work / Time)",
      "The product of force and distance squared",
      "Total kinetic energy divided by displacement",
      "The capacity of an object to resist torque"
    ),
    correctAnswer: "A",
    explanation: "Power is defined as the time rate of doing work: P = W / t = dW/dt (measured in Watts or Horsepower).",
    cardImage: "public/cards/practice/page_010.png"
  },
  {
    id: "practice_q18",
    category: "Applied Dynamics & Friction",
    question: "How large a total horizontal force is needed to accelerate a 2,000 kg aircraft cargo container from rest to 16 m/s over a distance of 80 m against an average friction force of 500 N?",
    options: makeOptions("3,700 N", "3,200 N", "4,520 N", "2,700 N"),
    correctAnswer: "A",
    explanation: "Acceleration: v² = 2as → 16² = 2a(80) → 256 = 160a → a = 1.6 m/s². Net accelerating force: F_net = m · a = 2000 × 1.6 = 3,200 N. Applied force: F_applied = F_net + F_friction = 3,200 + 500 = 3,700 N.",
    cardImage: "public/cards/practice/page_011.png"
  },
  {
    id: "practice_q19",
    category: "Conservation of Energy",
    question: "A 0.2 kg maintenance tool is dropped from a hangar scaffolding structure 20 m high. What is its kinetic energy just before striking the ground? (Ignore air drag; g = 10 m/s²)",
    options: makeOptions("20 J", "40 J", "80 J", "100 J"),
    correctAnswer: "B",
    explanation: "By conservation of mechanical energy: Final KE = Initial PE = m · g · h = 0.2 kg × 10 m/s² × 20 m = 40 Joules.",
    cardImage: "public/cards/practice/page_011.png"
  },
  {
    id: "practice_q20",
    category: "Thermodynamics & Heat Transfer",
    question: "The transfer of thermal energy from one region to another via the macroscopic bulk motion of a heated fluid is called:",
    options: makeOptions("Conduction", "Convection", "Radiation", "Insulation"),
    correctAnswer: "B",
    explanation: "Convection involves the collective physical movement of molecules within fluids (liquids or gases).",
    cardImage: "public/cards/practice/page_012.png"
  },
  {
    id: "practice_q21",
    category: "Physical Units & SI Standards",
    question: "Which of the following is NOT classified as a basic (fundamental) physical SI unit?",
    options: makeOptions("Meter (length)", "Second (time)", "Newton (force)", "Kilogram (mass)"),
    correctAnswer: "C",
    explanation: "The Newton is a derived unit (1 N = 1 kg·m/s²). Meter, Second, and Kilogram are fundamental SI base units.",
    cardImage: "public/cards/practice/page_012.png"
  },
  {
    id: "practice_q22",
    category: "Applied Geometry & Angles",
    question: "One full coordinate geometric revolution (rotation) is NOT equivalent to:",
    options: makeOptions("360 degrees", "2π radians", "21,600 minutes of arc", "4π radians"),
    correctAnswer: "D",
    explanation: "One full rotation equals 360° = 2π radians = 21,600 arcminutes. 4π radians equals two full rotations.",
    cardImage: "public/cards/practice/page_013.png"
  },
  {
    id: "practice_q23",
    category: "Technical English Prepositions",
    question: "Fill in the blank with the appropriate preposition: 'He has no special liking _____ technical drawings.'",
    options: makeOptions("in", "for", "with", "about"),
    correctAnswer: "B",
    explanation: "The standard English collocation following the noun 'liking' is 'for' ('a liking for something').",
    cardImage: "public/cards/practice/page_013.png"
  },
  {
    id: "practice_q24",
    category: "Technical English Prepositions",
    question: "Fill in the blank with the appropriate preposition: 'The mechanic carefully unscrewed the inspection panel _____ a specialized screwdriver.'",
    options: makeOptions("on", "at", "with", "for"),
    correctAnswer: "C",
    explanation: "'With' designates the instrument or tool employed to accomplish an action.",
    cardImage: "public/cards/practice/page_014.png"
  },
  {
    id: "practice_q25",
    category: "Technical English Prepositions",
    question: "Fill in the blank with the appropriate preposition: 'She is remarkably good _____ tracking systemic electrical faults.'",
    options: makeOptions("into", "at", "for", "with"),
    correctAnswer: "B",
    explanation: "The adjective 'good' pairs with the preposition 'at' when expressing proficiency or skill ('good at something').",
    cardImage: "public/cards/practice/page_014.png"
  },
  {
    id: "practice_q26",
    category: "Technical English Conjunctions",
    question: "Choose the correct conjunction: 'The structural engineer tried to interpret the damaged blueprint, _____ it was too blurred to read.'",
    options: makeOptions("so", "and", "but", "since"),
    correctAnswer: "C",
    explanation: "'But' introduces a contrasting limitation to the engineer's effort.",
    cardImage: "public/cards/practice/page_015.png"
  },
  {
    id: "practice_q27",
    category: "Verbal Logic & Analogies",
    question: "Complete the analogy: Architect is to Building as Sculptor is to _____",
    options: makeOptions("Museum", "Chisel", "Stone", "Statue"),
    correctAnswer: "D",
    explanation: "An architect designs/creates a building; a sculptor carves/creates a statue.",
    cardImage: "public/cards/practice/page_016.png"
  },
  {
    id: "practice_q28",
    category: "Linguistic Hierarchy",
    question: "Arrange the structural units below in logically ascending sequence from smallest to largest:\n1. Word | 2. Letters | 3. Paragraph | 4. Phrase | 5. Sentence",
    options: makeOptions("1, 2, 3, 4, 5", "2, 1, 4, 5, 3", "2, 1, 5, 4, 3", "1, 3, 2, 4, 5"),
    correctAnswer: "B",
    explanation: "Smallest to largest: Letters (2) → Word (1) → Phrase (4) → Sentence (5) → Paragraph (3).",
    cardImage: "public/cards/practice/page_016.png"
  },
  {
    id: "practice_q29",
    category: "Verbal Classification",
    question: "Which of the following items of headwear is functionally distinct from the others (odd one out)?",
    options: makeOptions("Cap", "Turban", "Veil", "Helmet"),
    correctAnswer: "C",
    explanation: "Cap, Turban, and Helmet are head coverings worn as protective or structured headwear, whereas a veil is a lightweight face/drape covering.",
    cardImage: "public/cards/practice/page_017.png"
  },
  {
    id: "practice_q30",
    category: "Numerical Series & Sequences",
    question: "Identify the missing number at the end of the series: 3, 6, 11, 18, ?",
    options: makeOptions("25", "26", "27", "28"),
    correctAnswer: "C",
    explanation: "Differences increase by consecutive odd numbers: 6-3=3, 11-6=5, 18-11=7. Next increment is +9: 18 + 9 = 27.",
    cardImage: "public/cards/practice/page_017.png"
  },
  {
    id: "practice_q31",
    category: "Fraction Arithmetic",
    question: "Solve for the missing fraction: 1/4 + ? = 3/4",
    options: makeOptions("1/4", "1/2", "2/3", "1/8"),
    correctAnswer: "B",
    explanation: "Subtract: 3/4 - 1/4 = 2/4. Reducing 2/4 gives 1/2.",
    cardImage: "public/cards/practice/page_018.png"
  },
  {
    id: "practice_q32",
    category: "Decimal Computation",
    question: "Compute the decimal product: 0.32 × 0.32 =",
    options: makeOptions("1.024", "0.01024", "0.1024", "0.001024"),
    correctAnswer: "C",
    explanation: "32 × 32 = 1024. Counting 4 decimal places gives 0.1024.",
    cardImage: "public/cards/practice/page_018.png"
  },
  {
    id: "practice_q33",
    category: "Applied Algebra",
    question: "Simplify the algebraic expression for all values where a ≠ -1: (a² - 1) / (a + 1) =",
    options: makeOptions("a - 1", "a + 1", "1", "a² - 2"),
    correctAnswer: "A",
    explanation: "Factor numerator as a difference of squares: (a - 1)(a + 1) / (a + 1) = a - 1.",
    cardImage: "public/cards/practice/page_019.png"
  },
  {
    id: "practice_q34",
    category: "Applied Measurement & Time",
    question: "Calculate the exact sum of the times: 2 hrs 45 min 35 sec + 4 hrs 45 min 35 sec =",
    options: makeOptions(
      "6 hrs 45 min 35 sec",
      "7 hrs 30 min 10 sec",
      "7 hrs 31 min 10 sec",
      "7 hrs 41 min 20 sec"
    ),
    correctAnswer: "C",
    explanation: "Seconds: 35 + 35 = 70 sec = 1 min 10 sec. Minutes: 45 + 45 + 1 = 91 min = 1 hr 31 min. Hours: 2 + 4 + 1 = 7 hrs. Total = 7 hrs 31 min 10 sec.",
    cardImage: "public/cards/practice/page_019.png"
  },
  {
    id: "practice_q35",
    category: "Algebra & Quadratics",
    question: "Determine the real solution set for the quadratic equation: 3x² + 5x = 2x + 6",
    options: makeOptions("{-2, 1}", "{-1, 2}", "{2, 3}", "{-3, 1}"),
    correctAnswer: "A",
    explanation: "Rearrange to standard quadratic form: 3x² + 3x - 6 = 0 → x² + x - 2 = 0 → (x + 2)(x - 1) = 0 → x = -2 or x = 1.",
    cardImage: "public/cards/practice/page_020.png"
  },
  {
    id: "practice_q36",
    category: "Proportions & Algebra",
    question: "Identify the positive value that satisfies the proportion: x / 7 = 7 / x",
    options: makeOptions("1", "7", "14", "49"),
    correctAnswer: "B",
    explanation: "Cross-multiply: x² = 7 × 7 = 49 → x = √49 = 7.",
    cardImage: "public/cards/practice/page_020.png"
  },
  {
    id: "practice_q37",
    category: "Technical English Spelling",
    question: "Find the correctly spelled vocabulary word:",
    options: makeOptions("Foreign", "Foreine", "Fareign", "Forein"),
    correctAnswer: "A",
    explanation: "The correct spelling is 'Foreign' (F-o-r-e-i-g-n).",
    cardImage: "public/cards/practice/page_021.png"
  },
  {
    id: "practice_q38",
    category: "Applied Kinematics & Units",
    question: "Convert a linear speed of 10 km/hr directly into meters per second (m/s):",
    options: makeOptions("2.78 m/s", "3.60 m/s", "1.00 m/s", "5.55 m/s"),
    correctAnswer: "A",
    explanation: "Multiply by conversion factor: 10 × (1000 m / 3600 s) = 10 / 3.6 ≈ 2.78 m/s.",
    cardImage: "public/cards/practice/page_021.png"
  },
  {
    id: "practice_q39",
    category: "General Physics & Vectors",
    question: "Which of the following physical measurements can be fully represented as a vector quantity?",
    options: makeOptions(
      "The number of passengers in a terminal",
      "The gravitational force acting on an airframe",
      "The scalar mass of an engine cowl",
      "The ambient air temperature"
    ),
    correctAnswer: "B",
    explanation: "Force possesses both magnitude and direction, making it a true vector quantity. Mass, count, and temperature are scalar quantities.",
    cardImage: "public/cards/practice/page_022.png"
  },
  {
    id: "practice_q40",
    category: "Kinematics & Acceleration",
    question: "An automobile accelerates from rest at 2 m/s² until reaching 20 m/s, then continues at this constant speed. Find the total time to cover 800 m.",
    options: makeOptions("35 s", "45 s", "50 s", "55 s"),
    correctAnswer: "B",
    explanation: "Phase 1: Time t₁ = v/a = 20/2 = 10 s. Distance d₁ = 0.5 × a × t₁² = 0.5 × 2 × 100 = 100 m. Remaining distance = 800 - 100 = 700 m. Phase 2: Time t₂ = 700 / 20 = 35 s. Total time = 10 + 35 = 45 s.",
    cardImage: "public/cards/practice/page_022.png"
  },
  {
    id: "practice_q41",
    category: "Kinematics & Motion",
    question: "In classic rectilinear, uniformly accelerated motion, which variable remains constant throughout the displacement?",
    options: makeOptions("Velocity", "Acceleration", "Displacement", "Momentum"),
    correctAnswer: "B",
    explanation: "By definition, 'uniformly accelerated motion' means that acceleration is constant over time.",
    cardImage: "public/cards/practice/page_023.png"
  },
  {
    id: "practice_q42",
    category: "Applied Mechanics & Momentum",
    question: "The physical quantity defined as the mathematical product of an object's mass and its instantaneous velocity is called:",
    options: makeOptions("Acceleration", "Momentum", "Force", "Kinetic Energy"),
    correctAnswer: "B",
    explanation: "Linear momentum is defined as p = m · v (expressed in kg·m/s).",
    cardImage: "public/cards/practice/page_023.png"
  },
  {
    id: "practice_q43",
    category: "General Physics & Projectiles",
    question: "Ideal projectile motion near the Earth's surface can be analyzed as a simultaneous superposition of:",
    options: makeOptions(
      "Uniform horizontal velocity and uniformly accelerated vertical motion.",
      "Uniform vertical velocity and uniformly accelerated horizontal motion.",
      "Uniformly accelerated motion along both orthogonal axes.",
      "Constant non-accelerated velocity in all directions."
    ),
    correctAnswer: "A",
    explanation: "Gravity acts strictly vertically (constant downward acceleration g), while horizontal velocity remains constant in the absence of air drag.",
    cardImage: "public/cards/practice/page_024.png"
  },
  {
    id: "practice_q44",
    category: "General Physics & Dynamics",
    question: "Newton's Second Law of Motion mathematically and conceptually states that:",
    options: makeOptions(
      "Every body continues at rest unless acted upon by a net force.",
      "To every action force, there is an equal and opposite reaction force.",
      "The acceleration of a body is directly proportional to the net force acting on it and inversely proportional to its mass (F = ma).",
      "Total mechanical energy of an isolated system is always conserved."
    ),
    correctAnswer: "C",
    explanation: "Newton's Second Law states that F_net = m · a, so acceleration is directly proportional to net force and inversely proportional to mass.",
    cardImage: "public/cards/practice/page_024.png"
  },
  {
    id: "practice_q45",
    category: "Physical Units & Energy",
    question: "Which of the following is NOT a recognized unit of mechanical work or energy?",
    options: makeOptions("Newton (N)", "Joule (J)", "Foot-pound (ft-lb)", "Watt-hour (Wh)"),
    correctAnswer: "A",
    explanation: "The Newton (N) is a unit of force, whereas Joules, Foot-pounds, and Watt-hours are units of work/energy.",
    cardImage: "public/cards/practice/page_025.png"
  },
  {
    id: "practice_q46",
    category: "Applied Mechanics & Pulleys",
    question: "A heavy crate weighing 24 lbs is suspended from a single movable pulley system supported by two rope strands. How much tension force is required to lift the weight?",
    options: makeOptions("12 lbs", "24 lbs", "36 lbs", "48 lbs"),
    correctAnswer: "A",
    explanation: "A single movable pulley supported by two strands provides a mechanical advantage of 2: Ideal Effort Force = Load / 2 = 24 / 2 = 12 lbs.",
    cardImage: "public/cards/practice/page_025.png"
  },
  {
    id: "practice_q47",
    category: "Technical English Spelling",
    question: "Find the correctly spelled word:",
    options: makeOptions("Satelite", "Satellite", "Sattelite", "Satelitte"),
    correctAnswer: "B",
    explanation: "The correct spelling is 'Satellite' (with one 't' and double 'l': S-a-t-e-l-l-i-t-e).",
    cardImage: "public/cards/practice/page_026.png"
  },
  {
    id: "practice_q48",
    category: "Verbal Logic & Analogies",
    question: "Complete the analogy: Cup is to Coffee as Bowl is to _____",
    options: makeOptions("Dish", "Soup", "Spoon", "Fork"),
    correctAnswer: "B",
    explanation: "A cup is the standard container for drinking coffee; a bowl is the standard container for eating soup.",
    cardImage: "public/cards/practice/page_031.png"
  },
  {
    id: "practice_q49",
    category: "Applied Arithmetic",
    question: "Find the square root of the expression: (49 × 25) / 49 =",
    options: makeOptions("5", "7", "25", "35"),
    correctAnswer: "A",
    explanation: "Cancel 49 in numerator and denominator: √(25) = 5.",
    cardImage: "public/cards/practice/page_031.png"
  },
  {
    id: "practice_q50",
    category: "Applied Aerodynamics",
    question: "When an aircraft is in steady, unaccelerated level cruise flight, the aerodynamic lift force must exactly balance with:",
    options: makeOptions("Thrust", "Drag", "Aircraft Weight", "Inertia"),
    correctAnswer: "C",
    explanation: "In unaccelerated level flight, the vertical forces are balanced: Lift = Weight, and horizontal forces are balanced: Thrust = Drag.",
    cardImage: "public/cards/practice/page_038.png"
  },
  {
    id: "practice_q51",
    category: "Applied Aerodynamics & Fluid Dynamics",
    question: "According to Bernoulli's Principle, within a steady streamline flow of an ideal fluid, an increase in fluid velocity occurs simultaneously with a decrease in:",
    options: makeOptions("Total mass", "Fluid density", "Static pressure", "Temperature"),
    correctAnswer: "C",
    explanation: "Bernoulli's Principle states that as fluid velocity increases along a streamline, static pressure decreases.",
    cardImage: "public/cards/practice/page_039.png"
  },
  {
    id: "practice_q52",
    category: "General Physics & Acoustics",
    question: "Which physical wave parameter determines the fundamental pitch of a sound wave generated by an engine turbine?",
    options: makeOptions("Amplitude", "Phase", "Frequency", "Velocity"),
    correctAnswer: "C",
    explanation: "The pitch of a sound wave is directly determined by its frequency (cycles per second, measured in Hertz).",
    cardImage: "public/cards/practice/page_052.png"
  }
];

fs.writeFileSync('curated_practice.json', JSON.stringify(practiceQuestions, null, 2));
console.log(`Successfully generated curated_practice.json with ${practiceQuestions.length} unique questions!`);
