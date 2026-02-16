export interface Module {
  id: string;
  code: string;
  name: string;
  credits: number;
  progress: number;
  currentGrade: number | null;
  assessments: Assessment[];
  semester: 1 | 2 | "full";
}

export interface Assessment {
  id: string;
  name: string;
  type: 'coursework' | 'exam' | 'presentation' | 'lab';
  weight: number;
  grade: number | null;
  status: 'completed' | 'upcoming' | 'in-progress';
  dueDate: string | null;
  isFormative: boolean;
  gitlabUrl?: string;
  feedback?: string;
}

export interface Deadline {
  id: string;
  moduleCode: string;
  moduleName: string;
  moduleId: string;
  assessmentName: string;
  dueDate: string;
  weight: number;
  urgency: 'critical' | 'soon' | 'upcoming';
  type: 'coursework' | 'exam' | 'presentation' | 'lab';
}

export interface StudentProfile {
  name: string;
  studentId: string;
  degree: string;
  year: number;
  academicYear: string;
  totalCredits: number;
  earnedCredits: number;
  currentAverage: number;
  lastSync: string;
}

export const academicYears = ["2024/25", "2023/24", "2022/23"];

export const studentProfile: StudentProfile = {
  name: "Alex Chen",
  studentId: "2024153892",
  degree: "BSc Computer Science",
  year: 1,
  academicYear: "2024/25",
  totalCredits: 120,
  earnedCredits: 75,
  currentAverage: 68.4,
  lastSync: "2 hours ago",
};

export const modules: Module[] = [
  // Semester 1
  {
    id: "1",
    code: "COMP12111",
    name: "Computer Engineering",
    credits: 10,
    progress: 75,
    currentGrade: 72,
    semester: 1,
    assessments: [
      { id: "a1", name: "Coursework 1", type: "coursework", weight: 25, grade: 78, status: "completed", dueDate: null, isFormative: false, gitlabUrl: "https://gitlab.com/student/comp12111-cw1", feedback: "Good understanding of digital logic design. Your implementation of the circuit was efficient, though consider edge cases for timing analysis. Documentation is clean and thorough." },
      { id: "a2", name: "Coursework 2", type: "coursework", weight: 25, grade: 68, status: "completed", dueDate: null, isFormative: false, gitlabUrl: "https://gitlab.com/student/comp12111-cw2", feedback: "Solid implementation but the MIPS processor design could be optimised. The timing analysis was accurate. Consider pipelining for better performance." },
      { id: "a3", name: "Final Exam", type: "exam", weight: 50, grade: null, status: "upcoming", dueDate: "2025-01-20T14:00", isFormative: false },
    ],
  },
  {
    id: "2",
    code: "COMP15111",
    name: "Computer Architecture",
    credits: 10,
    progress: 50,
    currentGrade: 65,
    semester: 1,
    assessments: [
      { id: "a4", name: "Lab Exercises", type: "lab", weight: 40, grade: 65, status: "completed", dueDate: null, isFormative: false, feedback: "Good assembly programming skills demonstrated. The ARM processor exercises showed solid understanding of instruction sets and memory addressing modes." },
      { id: "a5", name: "Coursework", type: "coursework", weight: 30, grade: null, status: "in-progress", dueDate: "2025-02-14T23:59", isFormative: false, gitlabUrl: "https://gitlab.com/student/comp15111-cw" },
      { id: "a6", name: "Final Exam", type: "exam", weight: 30, grade: null, status: "upcoming", dueDate: "2025-01-22T10:00", isFormative: false },
    ],
  },
  {
    id: "3",
    code: "COMP16321",
    name: "Programming 1",
    credits: 10,
    progress: 100,
    currentGrade: 74,
    semester: 1,
    assessments: [
      { id: "a7", name: "Practical Lab", type: "lab", weight: 30, grade: 80, status: "completed", dueDate: null, isFormative: false, feedback: "Excellent Java programming. Your OOP design was well-structured and the test coverage was thorough. Consider design patterns for larger projects." },
      { id: "a8", name: "Final Exam", type: "exam", weight: 70, grade: 71, status: "completed", dueDate: null, isFormative: false, feedback: "Good coverage of object-oriented principles and data structures. The recursion section could have been stronger. Overall a solid performance." },
    ],
  },
  // Semester 2
  {
    id: "4",
    code: "COMP11212",
    name: "Foundations of Computation",
    credits: 10,
    progress: 40,
    currentGrade: 70,
    semester: 2,
    assessments: [
      { id: "a9", name: "Coursework 1", type: "coursework", weight: 40, grade: 70, status: "completed", dueDate: null, isFormative: false, feedback: "Good understanding of formal languages and automata theory. The regex to NFA conversion was well-executed. Consider edge cases in your proofs." },
      { id: "a10", name: "Final Exam", type: "exam", weight: 60, grade: null, status: "upcoming", dueDate: "2025-05-15T14:00", isFormative: false },
    ],
  },
  {
    id: "5",
    code: "COMP13212",
    name: "Data Science",
    credits: 10,
    progress: 25,
    currentGrade: null,
    semester: 2,
    assessments: [
      { id: "a11", name: "Lab Exercises", type: "lab", weight: 20, grade: null, status: "in-progress", dueDate: "2025-02-28T17:00", isFormative: true },
      { id: "a12", name: "Coursework", type: "coursework", weight: 30, grade: null, status: "upcoming", dueDate: "2025-03-10T09:30", isFormative: false },
      { id: "a13", name: "Final Exam", type: "exam", weight: 50, grade: null, status: "upcoming", dueDate: "2025-05-20T14:00", isFormative: false },
    ],
  },
  {
    id: "6",
    code: "COMP15212",
    name: "Operating Systems",
    credits: 10,
    progress: 35,
    currentGrade: 62,
    semester: 2,
    assessments: [
      { id: "a14", name: "Practical 1", type: "lab", weight: 15, grade: 62, status: "completed", dueDate: null, isFormative: false, gitlabUrl: "https://gitlab.com/student/comp15212-p1", feedback: "The implementation of process scheduling was correct but memory management could be improved. Consider virtual memory strategies. Report was well-written." },
      { id: "a15", name: "Practical 2", type: "lab", weight: 15, grade: null, status: "in-progress", dueDate: "2025-02-20T23:59", isFormative: false, gitlabUrl: "https://gitlab.com/student/comp15212-p2" },
      { id: "a16", name: "Coursework", type: "coursework", weight: 40, grade: null, status: "upcoming", dueDate: "2025-04-01T23:59", isFormative: false },
      { id: "a17", name: "Exam", type: "exam", weight: 30, grade: null, status: "upcoming", dueDate: "2025-05-22T09:00", isFormative: false },
    ],
  },
  {
    id: "7",
    code: "COMP16412",
    name: "Programming 2",
    credits: 10,
    progress: 20,
    currentGrade: null,
    semester: 2,
    assessments: [
      { id: "a18", name: "Lab Portfolio", type: "lab", weight: 30, grade: null, status: "in-progress", dueDate: "2025-03-28T23:59", isFormative: false, gitlabUrl: "https://gitlab.com/student/comp16412-labs" },
      { id: "a19", name: "Final Exam", type: "exam", weight: 70, grade: null, status: "upcoming", dueDate: "2025-05-18T09:00", isFormative: false },
    ],
  },
  // Full Year
  {
    id: "8",
    code: "COMP10120",
    name: "Team Project",
    credits: 20,
    progress: 45,
    currentGrade: 68,
    semester: "full",
    assessments: [
      { id: "a20", name: "Sprint 1 Deliverable", type: "coursework", weight: 15, grade: 72, status: "completed", dueDate: null, isFormative: false, gitlabUrl: "https://gitlab.com/student/comp10120-sprint1", feedback: "The team demonstrated good agile practices and version control. Architecture decisions were sound. Testing coverage was adequate but could be improved." },
      { id: "a21", name: "Sprint 2 Deliverable", type: "coursework", weight: 15, grade: 64, status: "completed", dueDate: null, isFormative: false, gitlabUrl: "https://gitlab.com/student/comp10120-sprint2", feedback: "Good progress on feature implementation. The CI/CD pipeline was well-configured. Code review practices need improvement." },
      { id: "a22", name: "Final Deliverable", type: "coursework", weight: 40, grade: null, status: "in-progress", dueDate: "2025-04-25T23:59", isFormative: false, gitlabUrl: "https://gitlab.com/student/comp10120-final" },
      { id: "a23", name: "Presentation", type: "presentation", weight: 20, grade: null, status: "upcoming", dueDate: "2025-05-02T10:00", isFormative: false },
      { id: "a24", name: "Peer Review", type: "coursework", weight: 10, grade: null, status: "upcoming", dueDate: "2025-05-05T23:59", isFormative: true },
    ],
  },
  {
    id: "9",
    code: "COMP11120",
    name: "Mathematics for Computer Science",
    credits: 20,
    progress: 60,
    currentGrade: 66,
    semester: "full",
    assessments: [
      { id: "a25", name: "Worksheet Portfolio (Sem 1)", type: "coursework", weight: 20, grade: 70, status: "completed", dueDate: null, isFormative: false, feedback: "Good mathematical reasoning demonstrated in linear algebra and probability sections. Proofs were generally well-structured." },
      { id: "a26", name: "Worksheet Portfolio (Sem 2)", type: "coursework", weight: 20, grade: null, status: "in-progress", dueDate: "2025-04-15T23:59", isFormative: false },
      { id: "a27", name: "January Exam", type: "exam", weight: 30, grade: 63, status: "completed", dueDate: null, isFormative: false, feedback: "Adequate performance in calculus and discrete maths. The graph theory section was strong but the probability questions needed more rigour." },
      { id: "a28", name: "May Exam", type: "exam", weight: 30, grade: null, status: "upcoming", dueDate: "2025-05-25T09:00", isFormative: false },
    ],
  },
];

export const upcomingDeadlines: Deadline[] = [
  {
    id: "d1",
    moduleCode: "COMP15111",
    moduleName: "Computer Architecture",
    moduleId: "2",
    assessmentName: "Coursework",
    dueDate: "2025-02-14T23:59",
    weight: 30,
    urgency: "critical",
    type: "coursework",
  },
  {
    id: "d2",
    moduleCode: "COMP15212",
    moduleName: "Operating Systems",
    moduleId: "6",
    assessmentName: "Practical 2",
    dueDate: "2025-02-20T23:59",
    weight: 15,
    urgency: "critical",
    type: "lab",
  },
  {
    id: "d3",
    moduleCode: "COMP13212",
    moduleName: "Data Science",
    moduleId: "5",
    assessmentName: "Lab Exercises",
    dueDate: "2025-02-28T17:00",
    weight: 20,
    urgency: "soon",
    type: "lab",
  },
  {
    id: "d4",
    moduleCode: "COMP16412",
    moduleName: "Programming 2",
    moduleId: "7",
    assessmentName: "Lab Portfolio",
    dueDate: "2025-03-28T23:59",
    weight: 30,
    urgency: "upcoming",
    type: "lab",
  },
  {
    id: "d5",
    moduleCode: "COMP10120",
    moduleName: "Team Project",
    moduleId: "8",
    assessmentName: "Final Deliverable",
    dueDate: "2025-04-25T23:59",
    weight: 40,
    urgency: "upcoming",
    type: "coursework",
  },
  {
    id: "d6",
    moduleCode: "COMP11120",
    moduleName: "Maths for CS",
    moduleId: "9",
    assessmentName: "Worksheet Portfolio (Sem 2)",
    dueDate: "2025-04-15T23:59",
    weight: 20,
    urgency: "upcoming",
    type: "coursework",
  },
];

export const performanceData = [
  { month: "Sep", average: 65, target: 70 },
  { month: "Oct", average: 68, target: 70 },
  { month: "Nov", average: 66, target: 70 },
  { month: "Dec", average: 70, target: 70 },
  { month: "Jan", average: 68, target: 70 },
  { month: "Feb", average: 68.4, target: 70 },
];

export const modulePerformanceData: Record<string, { month: string; grade: number }[]> = {
  "1": [
    { month: "Sep", grade: 70 },
    { month: "Oct", grade: 74 },
    { month: "Nov", grade: 72 },
  ],
  "2": [
    { month: "Oct", grade: 60 },
    { month: "Nov", grade: 65 },
  ],
  "3": [
    { month: "Sep", grade: 76 },
    { month: "Oct", grade: 74 },
    { month: "Nov", grade: 80 },
    { month: "Dec", grade: 74 },
  ],
  "4": [
    { month: "Jan", grade: 70 },
  ],
  "6": [
    { month: "Jan", grade: 62 },
  ],
  "8": [
    { month: "Oct", grade: 72 },
    { month: "Dec", grade: 64 },
    { month: "Feb", grade: 68 },
  ],
  "9": [
    { month: "Oct", grade: 70 },
    { month: "Jan", grade: 63 },
    { month: "Feb", grade: 66 },
  ],
};
