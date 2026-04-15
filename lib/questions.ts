export interface Question {
  q: string
  options: string[]
  correct: number
  explanation: string
  refs: string[]
}

export interface QuestionResult {
  questionIndex: number
  question: string
  selectedAnswer: number
  correctAnswer: number
  isCorrect: boolean
}

export interface QuizAttempt {
  id: string
  timestamp: string
  totalQuestions: number
  correctCount: number
  score: number
  results: QuestionResult[]
}

export const questions: Question[] = [
  {
    q: "Despite advances with non-factor therapies, which unmet need remains most relevant in Hemophilia A management?",
    options: [
      "Oral administration",
      "Predictable hemostatic coverage in surgery/trauma",
      "Daily dosing convenience",
      "Lack of prophylaxis options",
    ],
    correct: 1,
    explanation:
      "Major bleeds, trauma, and perioperative settings still require reliable hemostatic control; this remains a key management challenge even in the era of non-factor prophylaxis.",
    refs: [
      "World Federation of Hemophilia. WFH Guidelines for the Management of Hemophilia, 3rd edition. 2020.",
      "Østergaard H, et al. Blood. 2021.",
    ],
  },
  {
    q: "What is the main mechanistic advantage of Mim8 compared to Emicizumab?",
    options: [
      "It targets the extrinsic pathway",
      "Higher binding affinity to FIXa and FX",
      "It directly inhibits antithrombin",
      "It directly activates platelets",
    ],
    correct: 1,
    explanation:
      "Preclinical work describes Mim8 as a next-generation FVIIIa mimetic engineered to drive stronger tenase-like activity by optimizing the FIXa–FX interaction.",
    refs: ["Østergaard H, et al. Blood. 2021.", "Persson P, et al. 2023."],
  },
  {
    q: "Which clinical scenario best highlights a potential differentiation of Mim8?",
    options: [
      "Long-term adherence in stable patients",
      "Breakthrough bleeding in trauma/surgery",
      "Oral dosing preference",
      "Storage convenience",
    ],
    correct: 1,
    explanation:
      "The differentiating narrative is usually built around sustained thrombin generation and robust hemostatic coverage in higher-demand situations.",
    refs: [
      "Østergaard H, et al. Blood. 2021.",
      "WFH Guidelines 3rd edition. 2020.",
    ],
  },
  {
    q: "What practical limitation of emicizumab is reported in higher-weight patients?",
    options: [
      "Reduced efficacy",
      "Multiple injections due to volume limits",
      "Increased neutralizing immunogenicity",
      "Need for daily dosing",
    ],
    correct: 1,
    explanation:
      "If the total emicizumab volume exceeds 2 mL, the dose must be split into multiple injections.",
    refs: ["Hemlibra (emicizumab) Prescribing Information."],
  },
  {
    q: "Which statement is best supported for the Mim8 pen device?",
    options: [
      "It requires reconstitution before use",
      "It is fixed dosing only",
      "Patients found it ready-to-use, small-volume injection",
      "It is administered intravenously",
    ],
    correct: 2,
    explanation:
      "FRONTIER5 patient-reported outcomes showed high ease-of-use and strong patient preference for the Mim8 pen-injector compared with the prior emicizumab injection system.",
    refs: [
      "Novo Nordisk. FRONTIER5 switching and patient-reported outcomes presented at ISTH 2025.",
    ],
  },
  {
    q: "Which outcome is most closely linked to better quality of life in hemophilia A?",
    options: [
      "Hemoglobin level",
      "Annualized bleeding rate reduction",
      "Platelet count",
      "Liver function tests",
    ],
    correct: 1,
    explanation:
      "Lower ABR usually means fewer disruptions, less pain, and better physical and social functioning.",
    refs: [
      "Kenet G, et al. Real-world bleeding and quality-of-life outcomes in hemophilia. 2021.",
    ],
  },
  {
    q: "Which patient-centered treatment feature is most consistently valued in preference studies?",
    options: [
      "Brand name",
      "Confidence in bleed protection with lower treatment burden",
      "Packaging color",
      "Storage temperature",
    ],
    correct: 1,
    explanation:
      "Patient and caregiver studies consistently prioritize fewer bleeds, lower administration burden, and convenient dosing over superficial device attributes.",
    refs: ["Tischer B, et al. 2018.", "Chiou SS, et al. 2025."],
  },
  {
    q: "In the phase 3 FRONTIER2 study, Mim8 prophylaxis showed what versus continued on-demand treatment in patients previously treated on demand?",
    options: [
      "Comparable ABR",
      "Clinically superior ABR reduction",
      "No effect on treated bleeds",
      "A requirement for daily dosing",
    ],
    correct: 1,
    explanation:
      "FRONTIER2 reported superiority versus on-demand treatment, with estimated mean treated-bleed ABR reductions of 97.1% for once-weekly and 98.7% for once-monthly Mim8.",
    refs: ["ISTH 2024. FRONTIER2 phase 3 presentation."],
  },
  {
    q: "What was the key efficacy endpoint used across FRONTIER efficacy presentations?",
    options: [
      "Hemoglobin level",
      "Annualized bleeding rate for treated bleeds",
      "Platelet aggregation",
      "Factor VIII level",
    ],
    correct: 1,
    explanation:
      "ABR for treated bleeds remains the standard efficacy endpoint in hemophilia prophylaxis trials.",
    refs: ["ISTH 2024. FRONTIER2 phase 3 presentation."],
  },
  {
    q: "Which pediatric phase 3 FRONTIER3 interim result is accurate for once-weekly Mim8?",
    options: [
      "<10% had zero treated bleeds",
      "About 30% had zero treated bleeds",
      "74.3% had zero treated bleeds",
      ">95% had zero treated bleeds",
    ],
    correct: 2,
    explanation:
      "In the FRONTIER3 interim analysis, 74.3% of children on once-weekly Mim8 prophylaxis had zero treated bleeds after 26 weeks.",
    refs: ["Novo Nordisk. FRONTIER3 interim analysis presented at EAHAD 2025."],
  },
  {
    q: "What did FRONTIER5 show about switching from emicizumab to Mim8?",
    options: [
      "A washout period was mandatory",
      "The switch was well tolerated without a washout period",
      "Thromboembolic events were common",
      "Most patients preferred the previous injection system",
    ],
    correct: 1,
    explanation:
      "FRONTIER5 showed a direct switch from emicizumab to Mim8 without washout was well tolerated, with strong preference for the Mim8 pen-injector.",
    refs: [
      "Novo Nordisk. FRONTIER5 switching and patient-reported outcomes presented at ISTH 2025.",
    ],
  },
]
