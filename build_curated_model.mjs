import fs from 'fs';

function makeOptions(a, b, c, d) {
  return [
    { key: 'A', text: String(a).trim() },
    { key: 'B', text: String(b).trim() },
    { key: 'C', text: String(c).trim() },
    { key: 'D', text: String(d).trim() }
  ];
}

export const modelQuestions = [
  {
    id: "model_q1",
    category: "Aviation Mathematics",
    question: "The quotient and remainder of the division problem 4235 ÷ 85 respectively is:",
    options: makeOptions("48 and 75", "49 and 70", "50 and 10", "49 and 60"),
    correctAnswer: "B",
    explanation: "85 × 49 = 4165. The remainder is 4235 - 4165 = 70. Therefore, the quotient is 49 and the remainder is 70.",
    cardImage: "public/cards/model/page_001.png"
  },
  {
    id: "model_q2",
    category: "Aviation Mathematics",
    question: "What is the value of the fraction sum 3/16 + 10/16 + 4/16?",
    options: makeOptions("17/16 (or 1 1/16)", "13/16", "15/16", "19/16"),
    correctAnswer: "A",
    explanation: "Since the fractions share a common denominator of 16, add the numerators: 3 + 10 + 4 = 17. The sum is 17/16, which is 1 1/16.",
    cardImage: "public/cards/model/page_002.png"
  },
  {
    id: "model_q3",
    category: "Aviation Mathematics",
    question: "Find 35% of 780:",
    options: makeOptions("260.5", "273.0", "285.0", "290.0"),
    correctAnswer: "B",
    explanation: "Multiply the total by the decimal equivalent of 35%: 780 × 0.35 = 273.0.",
    cardImage: "public/cards/model/page_003.png"
  },
  {
    id: "model_q4",
    category: "Aviation Mathematics",
    question: "If 4x - 5 = 23, what is the value of x?",
    options: makeOptions("6", "7", "8", "5"),
    correctAnswer: "B",
    explanation: "Isolate x: 4x = 23 + 5 → 4x = 28 → x = 28 / 4 = 7.",
    cardImage: "public/cards/model/page_004.png"
  },
  {
    id: "model_q5",
    category: "Applied Financial Math",
    question: "What is the simple interest on $2,500 invested at an annual rate of 6% for 3 years?",
    options: makeOptions("$300", "$450", "$600", "$525"),
    correctAnswer: "B",
    explanation: "Simple Interest formula: I = P × r × t = 2500 × 0.06 × 3 = $450.",
    cardImage: "public/cards/model/page_005.png"
  },
  {
    id: "model_q6",
    category: "Aviation Mathematics",
    question: "If x² - y² = 96 and x - y = 8, what is the value of y?",
    options: makeOptions("2", "4", "6", "8"),
    correctAnswer: "A",
    explanation: "Factor using difference of squares: x² - y² = (x - y)(x + y) = 96. Since x - y = 8, then 8(x + y) = 96 → x + y = 12. Subtract the two equations: (x + y) - (x - y) = 12 - 8 → 2y = 4 → y = 2.",
    cardImage: "public/cards/model/page_006.png"
  },
  {
    id: "model_q7",
    category: "Applied Logic & Sets",
    question: "In a sports club with 40 members, 22 play badminton, 25 play tennis, and 3 do not play either. How many members play both sports?",
    options: makeOptions("8", "10", "12", "14"),
    correctAnswer: "B",
    explanation: "Total members playing at least one sport = 40 - 3 = 37. By the principle of inclusion-exclusion: Both = n(Badminton) + n(Tennis) - n(At least one) = 22 + 25 - 37 = 47 - 37 = 10 members.",
    cardImage: "public/cards/model/page_007.png"
  },
  {
    id: "model_q8",
    category: "Applied Logic & Combinatorics",
    question: "6 people meet for a meeting. Each person shakes hands once with every other person present. How many handshakes take place?",
    options: makeOptions("10", "12", "15", "18"),
    correctAnswer: "C",
    explanation: "Number of unique combinations: C(6, 2) = (6 × 5) / 2 = 15 handshakes.",
    cardImage: "public/cards/model/page_008.png"
  },
  {
    id: "model_q9",
    category: "Aviation Geometry",
    question: "The base of a triangle is 12 cm and its height is 7 cm. What is its area in cm²?",
    options: makeOptions("21 cm²", "42 cm²", "84 cm²", "49 cm²"),
    correctAnswer: "B",
    explanation: "Area of a triangle = (1/2) × base × height = (1/2) × 12 × 7 = 6 × 7 = 42 cm².",
    cardImage: "public/cards/model/page_009.png"
  },
  {
    id: "model_q10",
    category: "Aviation Geometry",
    question: "A square's perimeter is 32 cm. What is its area in square centimeters?",
    options: makeOptions("16 cm²", "64 cm²", "128 cm²", "32 cm²"),
    correctAnswer: "B",
    explanation: "Side length of the square = 32 / 4 = 8 cm. Area = side² = 8² = 64 cm².",
    cardImage: "public/cards/model/page_010.png"
  },
  {
    id: "model_q11",
    category: "Applied Computation & Mixtures",
    question: "Drink A is 60% water and Drink B is 30% water. If they are mixed to form a mixture that is 50% water, what percentage of the mixture is Drink B?",
    options: makeOptions("33.3%", "40.0%", "50.0%", "66.7%"),
    correctAnswer: "A",
    explanation: "Let fraction of Drink B be x, and Drink A be (1 - x). 0.60(1 - x) + 0.30x = 0.50 → 0.60 - 0.30x = 0.50 → 0.30x = 0.10 → x = 0.10 / 0.30 = 1/3 ≈ 33.3%.",
    cardImage: "public/cards/model/page_011.png"
  },
  {
    id: "model_q12",
    category: "Applied Algebra",
    question: "5 years ago, Tom was 3 times as old as Jerry. In 5 years, Tom will be twice as old as Jerry. How old is Jerry now?",
    options: makeOptions("12 years", "15 years", "20 years", "25 years"),
    correctAnswer: "B",
    explanation: "Let Jerry's current age be J, Tom's be T. Five years ago: T - 5 = 3(J - 5) → T = 3J - 10. Five years hence: T + 5 = 2(J + 5) → T = 2J + 5. Equating: 3J - 10 = 2J + 5 → J = 15 years old.",
    cardImage: "public/cards/model/page_012.png"
  },
  {
    id: "model_q13",
    category: "Applied Geometry & Angles",
    question: "It is now 3:00 PM. By how many degrees will the hour hand of a clock have rotated when the clock reaches 9:00 PM?",
    options: makeOptions("90 degrees", "180 degrees", "270 degrees", "360 degrees"),
    correctAnswer: "B",
    explanation: "From 3:00 PM to 9:00 PM is 6 hours. A clock dial represents 360° across 12 hours (30° per hour). Rotation = 6 × 30° = 180°.",
    cardImage: "public/cards/model/page_013.png"
  },
  {
    id: "model_q14",
    category: "Aviation Geometry",
    question: "A trapezoid has parallel bases of 10 cm and 16 cm and an altitude (height) of 6 cm. What is its area?",
    options: makeOptions("52 cm²", "78 cm²", "96 cm²", "156 cm²"),
    correctAnswer: "B",
    explanation: "Area of trapezoid = ((base₁ + base₂) / 2) × height = ((10 + 16) / 2) × 6 = 13 × 6 = 78 cm².",
    cardImage: "public/cards/model/page_014.png"
  },
  {
    id: "model_q15",
    category: "Aviation Mathematics",
    question: "If 3x + 2y = 18 and x - y = 1, what is the value of y?",
    options: makeOptions("2", "3", "4", "5"),
    correctAnswer: "B",
    explanation: "From x - y = 1, we get x = y + 1. Substitute into the first equation: 3(y + 1) + 2y = 18 → 3y + 3 + 2y = 18 → 5y = 15 → y = 3.",
    cardImage: "public/cards/model/page_015.png"
  },
  {
    id: "model_q16",
    category: "Technical English Vocabulary",
    question: "Choose the word that has the closest meaning to ARDUOUS:",
    options: makeOptions("Easy", "Strenuous", "Brief", "Superficial"),
    correctAnswer: "B",
    explanation: "'Arduous' means requiring strenuous effort, tiring, or difficult. 'Strenuous' is its direct synonym.",
    cardImage: "public/cards/model/page_016.png"
  },
  {
    id: "model_q17",
    category: "Technical English Vocabulary",
    question: "Choose the word that has the closest meaning to MITIGATE:",
    options: makeOptions("Intensify", "Alleviate", "Ignore", "Prolong"),
    correctAnswer: "B",
    explanation: "'Mitigate' means to make less severe, serious, or painful. 'Alleviate' is its exact technical synonym.",
    cardImage: "public/cards/model/page_017.png"
  },
  {
    id: "model_q18",
    category: "Technical English Vocabulary",
    question: "Choose the word that is opposite in meaning to AUGMENT:",
    options: makeOptions("Shrink", "Expand", "Magnify", "Accelerate"),
    correctAnswer: "A",
    explanation: "'Augment' means to increase, enlarge, or make greater. Its direct antonym is 'Shrink' (or decrease).",
    cardImage: "public/cards/model/page_018.png"
  },
  {
    id: "model_q19",
    category: "English Prepositions",
    question: "Choose the correct preposition: 'The mechanic walked _____ the entire length of the aircraft wing during inspection.'",
    options: makeOptions("across", "over", "in", "at"),
    correctAnswer: "A",
    explanation: "Moving from one boundary or end to another across a wide surface takes the preposition 'across'.",
    cardImage: "public/cards/model/page_019.png"
  },
  {
    id: "model_q20",
    category: "English Grammar & Conditionals",
    question: "If I _____ about the hydraulic leak earlier, I would have grounded the aircraft.",
    options: makeOptions("knew", "had known", "would know", "have known"),
    correctAnswer: "B",
    explanation: "This is a Third Conditional sentence expressing an unreal past condition. The 'if' clause requires the past perfect: 'had known'.",
    cardImage: "public/cards/model/page_020.png"
  },
  {
    id: "model_q21",
    category: "English Subject-Verb Concord",
    question: "Choose the grammatically correct sentence:",
    options: makeOptions(
      "Neither the supervisor nor the technicians was present.",
      "Neither the supervisor nor the technicians were present.",
      "Neither the technicians nor the supervisor were present.",
      "Neither the supervisor or the technicians was present."
    ),
    correctAnswer: "B",
    explanation: "With correlative conjunctions 'neither... nor', the verb agrees with the closer subject. 'Technicians' is plural, so 'were present' is correct.",
    cardImage: "public/cards/model/page_021.png"
  },
  {
    id: "model_q22",
    category: "English Modifiers & Adverbs",
    question: "The turbine engine _____.",
    options: makeOptions("smells good", "runs smoothly", "runs smooth", "operates slow"),
    correctAnswer: "B",
    explanation: "Action verbs like 'runs' must be modified by an adverb of manner ('smoothly'), not an adjective ('smooth').",
    cardImage: "public/cards/model/page_022.png"
  },
  {
    id: "model_q23",
    category: "English Tenses",
    question: "By next month, I _____ with Ethiopian Airlines for five years.",
    options: makeOptions("will work", "will have worked", "am working", "had worked"),
    correctAnswer: "B",
    explanation: "The future perfect tense ('will have worked') indicates an action that will be completed by a specific specified benchmark in the future ('By next month').",
    cardImage: "public/cards/model/page_023.png"
  },
  {
    id: "model_q24",
    category: "Aviation Reading Comprehension",
    question: "PASSAGE: 'Maintenance technicians are required to verify tool accountability before and after every shift to prevent Foreign Object Damage (FOD). Failure to log missing tools can lead to severe disciplinary action.'\nAccording to the passage, tool accountability checks are optional during minor shifts.",
    options: makeOptions("TRUE", "FALSE", "Cannot say", "Optional with approval"),
    correctAnswer: "B",
    explanation: "The passage explicitly stipulates checks are mandatory 'before and after every shift', making the statement 'optional' FALSE.",
    cardImage: "public/cards/model/page_024.png"
  },
  {
    id: "model_q25",
    category: "Aviation Reading Comprehension",
    question: "PASSAGE: 'Maintenance technicians are required to verify tool accountability before and after every shift to prevent Foreign Object Damage (FOD). Failure to log missing tools can lead to severe disciplinary action.'\nFrom the passage above, failing to log missing tools may result in disciplinary action.",
    options: makeOptions("TRUE", "FALSE", "Cannot say", "Only if FOD occurs"),
    correctAnswer: "A",
    explanation: "Directly supported by the text: 'Failure to log missing tools can lead to severe disciplinary action.' Therefore, the statement is TRUE.",
    cardImage: "public/cards/model/page_025.png"
  },
  {
    id: "model_q26",
    category: "Applied Deductive Logic",
    question: "All engineers wear safety boots. All people who wear safety boots work in the hangar. Which statement must be true?",
    options: makeOptions(
      "All hangar workers wear safety boots.",
      "All engineers work in the hangar.",
      "All people who work in the hangar are engineers.",
      "Some engineers do not wear safety boots."
    ),
    correctAnswer: "B",
    explanation: "By categorical syllogism: Engineers ⊂ Safety Boot Wearers ⊂ Hangar Workers. Therefore, every engineer must work in the hangar.",
    cardImage: "public/cards/model/page_026.png"
  },
  {
    id: "model_q27",
    category: "Analogies & Verbal Logic",
    question: "Choose the word pair that maintains the same logical relationship as: Brake : Vehicle",
    options: makeOptions("Door : House", "Rudder : Ship", "Engine : Car", "Runway : Tarmac"),
    correctAnswer: "B",
    explanation: "A brake governs/retards movement on a vehicle, just as a rudder governs and steers movement on a ship.",
    cardImage: "public/cards/model/page_027.png"
  },
  {
    id: "model_q28",
    category: "Analogies & Verbal Logic",
    question: "Choose the word pair that maintains the same logical relationship as: Doctor : Hospital",
    options: makeOptions("Teacher : School", "Pilot : Aircraft cabin", "Lawyer : Judge", "Engineer : Tool"),
    correctAnswer: "A",
    explanation: "A doctor's primary institutional workplace is a hospital, just as a teacher's primary institutional workplace is a school.",
    cardImage: "public/cards/model/page_028.png"
  },
  {
    id: "model_q29",
    category: "Analogies & Antonym Pairs",
    question: "Choose the word pair that maintains the same relationship as: Decrease : Increase",
    options: makeOptions("Stretch : Enlarge", "Beauty : Ugliness", "Walk : Run", "Climb : Ascend"),
    correctAnswer: "B",
    explanation: "Decrease and Increase are mutual antonyms. Beauty and Ugliness are also mutual antonyms.",
    cardImage: "public/cards/model/page_029.png"
  },
  {
    id: "model_q30",
    category: "Applied Logic & Kinship",
    question: "Dan is Joshua's son and Guy's brother. Margaret is Guy's mother and Judy's daughter. Which statement is true?",
    options: makeOptions(
      "Margaret is Dan's mother.",
      "Judy is Joshua's grandmother.",
      "Guy is Joshua's uncle.",
      "Dan is Judy's brother."
    ),
    correctAnswer: "A",
    explanation: "Since Dan and Guy are brothers sharing parents, and Margaret is Guy's mother, Margaret is also Dan's mother.",
    cardImage: "public/cards/model/page_030.png"
  },
  {
    id: "model_q31",
    category: "Technical Spelling",
    question: "Which word is correctly spelled?",
    options: makeOptions("Maintenence", "Maintenance", "Maintanance", "Maintenanse"),
    correctAnswer: "B",
    explanation: "The standard and universally accepted technical spelling is 'Maintenance' (m-a-i-n-t-e-n-a-n-c-e).",
    cardImage: "public/cards/model/page_031.png"
  },
  {
    id: "model_q32",
    category: "Technical Aviation Vocabulary",
    question: "Choose the correct word: 'The mechanic checked the _____ of the fluid reservoir.'",
    options: makeOptions("gage", "gauge", "gague", "guage"),
    correctAnswer: "B",
    explanation: "'Gauge' is the standard terminology for an instrument used for measuring fluid pressure or liquid volume.",
    cardImage: "public/cards/model/page_032.png"
  },
  {
    id: "model_q33",
    category: "General Physics",
    question: "Which of the following is true about the fundamental definition of mass?",
    options: makeOptions(
      "Mass is a measure of gravity.",
      "Mass is a measure of the quantity of matter in an object.",
      "Mass changes depending on flight altitude.",
      "Mass varies directly with ambient temperature."
    ),
    correctAnswer: "B",
    explanation: "Mass is an invariant intrinsic scalar property that measures the quantity of matter contained within a body.",
    cardImage: "public/cards/model/page_033.png"
  },
  {
    id: "model_q34",
    category: "General Physics & States of Matter",
    question: "Which of the following is true regarding liquids?",
    options: makeOptions(
      "Liquids have a definite shape and a definite volume.",
      "Liquids have no definite shape but have a definite volume.",
      "Liquids have no definite shape and no definite volume.",
      "Liquids easily expand to fill the entire container volume."
    ),
    correctAnswer: "B",
    explanation: "Liquids take the shape of their container (no definite shape) while maintaining an essentially fixed, incompressible volume (definite volume).",
    cardImage: "public/cards/model/page_034.png"
  },
  {
    id: "model_q35",
    category: "Thermodynamics & Heat Transfer",
    question: "Which of the following is NOT a recognized method of thermal heat transfer?",
    options: makeOptions("Conduction", "Convection", "Diffusion", "Radiation"),
    correctAnswer: "C",
    explanation: "The three standard physical mechanisms of heat transfer are conduction, convection, and radiation. Diffusion refers to particle concentration transport.",
    cardImage: "public/cards/model/page_035.png"
  },
  {
    id: "model_q36",
    category: "General Physics & Mechanics",
    question: "Stored energy or energy of an object at rest due to its position or state is called:",
    options: makeOptions("Potential Energy", "Kinetic Energy", "Thermal Energy", "Dynamic Energy"),
    correctAnswer: "A",
    explanation: "Potential energy represents stored energy possessed by a body by virtue of its position, deformation, or mechanical state.",
    cardImage: "public/cards/model/page_036.png"
  },
  {
    id: "model_q37",
    category: "Applied Mechanics & Work",
    question: "How much work is accomplished when an aircraft weighing 120,000 lb is towed 75 ft with a constant horizontal towing force of 4,000 lb?",
    options: makeOptions("300,000 ft-lb", "9,000,000 ft-lb", "300,000,000 ft-lb", "45,000 ft-lb"),
    correctAnswer: "A",
    explanation: "Work = Force × Displacement in direction of force = 4,000 lb × 75 ft = 300,000 ft-lb. (Aircraft gross weight acts vertically, not along the towing axis).",
    cardImage: "public/cards/model/page_037.png"
  },
  {
    id: "model_q38",
    category: "Aircraft Hydraulics",
    question: "A hydraulic piston with an area of 25 sq in, when moved through a stroke of 18 in, will force how much fluid from the cylinder?",
    options: makeOptions("350 cubic inches", "450 cubic inches", "43 cubic inches", "500 cubic inches"),
    correctAnswer: "B",
    explanation: "Volumetric displacement = Area × Stroke Distance = 25 in² × 18 in = 450 cubic inches.",
    cardImage: "public/cards/model/page_038.png"
  },
  {
    id: "model_q39",
    category: "General Physics & Fluids",
    question: "The amount of perpendicular force acting on a specific unit of surface area is called:",
    options: makeOptions("Work", "Pressure", "Density", "Power"),
    correctAnswer: "B",
    explanation: "Pressure is defined as force per unit area: P = F / A (measured in Pascals or PSI).",
    cardImage: "public/cards/model/page_039.png"
  },
  {
    id: "model_q40",
    category: "General Physics & Mechanics",
    question: "In physics, which factors are necessary to determine power? (1. Force exerted, 2. Distance moved, 3. Time required)",
    options: makeOptions("1 and 2 only", "2 and 3 only", "1, 2, and 3", "1 and 3 only"),
    correctAnswer: "C",
    explanation: "Power is defined as Work / Time = (Force × Distance) / Time. Thus, Force, Distance, and Time are all three required.",
    cardImage: "public/cards/model/page_040.png"
  },
  {
    id: "model_q41",
    category: "General Physics & Materials",
    question: "The measure of the mass contained within a given unit volume of a material is called:",
    options: makeOptions("Specific Gravity", "Density", "Viscosity", "Surface Tension"),
    correctAnswer: "B",
    explanation: "Density is defined as mass per unit volume (ρ = m / V), typically expressed in kg/m³ or lb/ft³.",
    cardImage: "public/cards/model/page_041.png"
  },
  {
    id: "model_q42",
    category: "Thermodynamics",
    question: "Temperature of a substance is a physical measure of the:",
    options: makeOptions(
      "Total potential energy of molecules.",
      "Average kinetic energy of molecules in a substance.",
      "Total thermal heat content of a body.",
      "Latent heat of vaporization."
    ),
    correctAnswer: "B",
    explanation: "Temperature reflects the average translational kinetic energy of the molecules composing a substance.",
    cardImage: "public/cards/model/page_042.png"
  },
  {
    id: "model_q43",
    category: "Aircraft Hydraulics & Physics",
    question: "What law states that pressure applied to an enclosed, confined fluid is transmitted undiminished in all directions?",
    options: makeOptions("Pascal's Law", "Bernoulli's Principle", "Boyle's Law", "Charles's Law"),
    correctAnswer: "A",
    explanation: "Pascal's Law governs fluid power transmission: pressure exerted anywhere in a confined incompressible fluid is transmitted equally in all directions.",
    cardImage: "public/cards/model/page_043.png"
  },
  {
    id: "model_q44",
    category: "Aviation Regulations",
    question: "In aviation maintenance and operations, what does the acronym MEL stand for?",
    options: makeOptions("Maximum Engine Limit", "Minimum Equipment List", "Maintenance Emergency Log", "Mandatory Engineering License"),
    correctAnswer: "B",
    explanation: "MEL stands for Minimum Equipment List, an authority-approved document specifying instruments and equipment that may be inoperative under specific flight conditions.",
    cardImage: "public/cards/model/page_044.png"
  },
  {
    id: "model_q45",
    category: "Aviation Regulations",
    question: "What does an Airworthiness Directive (AD) represent?",
    options: makeOptions(
      "Optional manufacturer maintenance recommendations.",
      "Legally enforceable safety mandates issued by aviation authorities.",
      "Standard airline commercial cleaning procedures.",
      "Pre-flight passenger briefing scripts."
    ),
    correctAnswer: "B",
    explanation: "An Airworthiness Directive (AD) is a legally enforceable rule issued by a civil aviation regulatory authority to correct an unsafe condition in an aircraft.",
    cardImage: "public/cards/model/page_045.png"
  },
  {
    id: "model_q46",
    category: "Aviation Safety Management",
    question: "What is the primary objective of a Safety Management System (SMS) in aviation?",
    options: makeOptions(
      "To punish technicians for honest human errors.",
      "To proactively identify hazards, manage safety risks, and prevent incidents.",
      "To advertise airline flight schedules.",
      "To reduce technical documentation standards."
    ),
    correctAnswer: "B",
    explanation: "An SMS is an organized approach to managing safety, including necessary organizational structures, accountabilities, policies, and procedures to proactively mitigate risks.",
    cardImage: "public/cards/model/page_046.png"
  },
  {
    id: "model_q47",
    category: "General Physics & Dynamics",
    question: "Newton's First Law of Motion states that an object will remain at rest or continue in uniform straight-line motion unless acted upon by:",
    options: makeOptions("Gravity alone", "An unbalanced external net force", "Internal friction forces", "Atmospheric pressure"),
    correctAnswer: "B",
    explanation: "The Law of Inertia (Newton's First Law) establishes that a net external unbalanced force is required to alter a body's state of motion.",
    cardImage: "public/cards/model/page_047.png"
  },
  {
    id: "model_q48",
    category: "Thermodynamics & Gas Laws",
    question: "Which gas law explains why aircraft tire pressure increases noticeably after landing following a high-speed flight?",
    options: makeOptions("Boyle's Law", "Gay-Lussac's Law", "Charles's Law", "Dalton's Law"),
    correctAnswer: "B",
    explanation: "Gay-Lussac's Law states that for a gas held at constant volume, pressure is directly proportional to absolute temperature (P₁/T₁ = P₂/T₂). Heat from friction and braking elevates tire pressure.",
    cardImage: "public/cards/model/page_048.png"
  },
  {
    id: "model_q49",
    category: "Aviation Instruments",
    question: "What instrument measures atmospheric ambient pressure and serves as the operating principle for barometric altimeters?",
    options: makeOptions("Barometer", "Tachometer", "Hydrometer", "Pyrometer"),
    correctAnswer: "A",
    explanation: "A barometer measures ambient atmospheric static pressure, which decreases predictably with height and enables altimeter calibration.",
    cardImage: "public/cards/model/page_049.png"
  },
  {
    id: "model_q50",
    category: "Aviation Ground Safety",
    question: "When performing maintenance on aircraft fuel systems, what is the primary purpose of grounding the airframe to a static earth point?",
    options: makeOptions(
      "To recharge the onboard avionics emergency batteries.",
      "To prevent electrostatic spark discharge that could ignite flammable fuel vapors.",
      "To test VHF radio communications clarity.",
      "To synchronize electrical generator frequencies."
    ),
    correctAnswer: "B",
    explanation: "Static grounding safely dissipates accumulated electrostatic potential, eliminating spark discharge that could ignite volatile fuel-air mixtures.",
    cardImage: "public/cards/model/page_050.png"
  }
];

fs.writeFileSync('curated_model.json', JSON.stringify(modelQuestions, null, 2));
console.log(`Successfully generated curated_model.json with ${modelQuestions.length} unique questions!`);
