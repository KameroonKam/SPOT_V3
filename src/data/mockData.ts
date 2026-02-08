export interface Module {
  id: string;
  code: string;
  name: string;
  credits: number;
  progress: number;
  currentGrade: number | null;
  assessments: Assessment[];
  semester: 1 | 2;
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
}

export interface Deadline {
  id: string;
  moduleCode: string;
  moduleName: string;
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

export const studentProfile: StudentProfile = {
  name: "Alex Chen",
  studentId: "2024153892",
  degree: "BSc Computer Science",
  year: 2,
  academicYear: "2024/25",
  totalCredits: 120,
  earnedCredits: 75,
  currentAverage: 68.4,
  lastSync: "2 hours ago",
};

export const modules: Module[] = [
  {
    id: "1",
    code: "CS2001",
    name: "Data Structures & Algorithms",
    credits: 20,
    progress: 75,
    currentGrade: 72,
    semester: 1,
    assessments: [
      { id: "a1", name: "Coursework 1", type: "coursework", weight: 25, grade: 78, status: "completed", dueDate: null, isFormative: false },
      { id: "a2", name: "Coursework 2", type: "coursework", weight: 25, grade: 68, status: "completed", dueDate: null, isFormative: false },
      { id: "a3", name: "Final Exam", type: "exam", weight: 50, grade: null, status: "upcoming", dueDate: "2025-01-20", isFormative: false },
    ],
  },
  {
    id: "2",
    code: "CS2002",
    name: "Software Engineering",
    credits: 20,
    progress: 50,
    currentGrade: 65,
    semester: 1,
    assessments: [
      { id: "a4", name: "Group Project", type: "coursework", weight: 40, grade: 65, status: "completed", dueDate: null, isFormative: false },
      { id: "a5", name: "Individual Report", type: "coursework", weight: 30, grade: null, status: "in-progress", dueDate: "2025-02-14", isFormative: false },
      { id: "a6", name: "Presentation", type: "presentation", weight: 30, grade: null, status: "upcoming", dueDate: "2025-02-21", isFormative: false },
    ],
  },
  {
    id: "3",
    code: "CS2003",
    name: "Database Systems",
    credits: 15,
    progress: 100,
    currentGrade: 74,
    semester: 1,
    assessments: [
      { id: "a7", name: "Practical Lab", type: "lab", weight: 30, grade: 80, status: "completed", dueDate: null, isFormative: false },
      { id: "a8", name: "Final Exam", type: "exam", weight: 70, grade: 71, status: "completed", dueDate: null, isFormative: false },
    ],
  },
  {
    id: "4",
    code: "CS2004",
    name: "Web Technologies",
    credits: 15,
    progress: 40,
    currentGrade: 70,
    semester: 2,
    assessments: [
      { id: "a9", name: "Portfolio", type: "coursework", weight: 40, grade: 70, status: "completed", dueDate: null, isFormative: false },
      { id: "a10", name: "Final Project", type: "coursework", weight: 60, grade: null, status: "upcoming", dueDate: "2025-03-15", isFormative: false },
    ],
  },
  {
    id: "5",
    code: "CS2005",
    name: "Computer Networks",
    credits: 15,
    progress: 25,
    currentGrade: null,
    semester: 2,
    assessments: [
      { id: "a11", name: "Lab Exercises", type: "lab", weight: 20, grade: null, status: "in-progress", dueDate: "2025-02-28", isFormative: true },
      { id: "a12", name: "Midterm", type: "exam", weight: 30, grade: null, status: "upcoming", dueDate: "2025-03-10", isFormative: false },
      { id: "a13", name: "Final Exam", type: "exam", weight: 50, grade: null, status: "upcoming", dueDate: "2025-05-15", isFormative: false },
    ],
  },
  {
    id: "6",
    code: "CS2006",
    name: "Machine Learning Fundamentals",
    credits: 20,
    progress: 35,
    currentGrade: 62,
    semester: 2,
    assessments: [
      { id: "a14", name: "Practical 1", type: "lab", weight: 15, grade: 62, status: "completed", dueDate: null, isFormative: false },
      { id: "a15", name: "Practical 2", type: "lab", weight: 15, grade: null, status: "in-progress", dueDate: "2025-02-20", isFormative: false },
      { id: "a16", name: "Project", type: "coursework", weight: 40, grade: null, status: "upcoming", dueDate: "2025-04-01", isFormative: false },
      { id: "a17", name: "Exam", type: "exam", weight: 30, grade: null, status: "upcoming", dueDate: "2025-05-20", isFormative: false },
    ],
  },
];

export const upcomingDeadlines: Deadline[] = [
  {
    id: "d1",
    moduleCode: "CS2002",
    moduleName: "Software Engineering",
    assessmentName: "Individual Report",
    dueDate: "2025-02-14",
    weight: 30,
    urgency: "critical",
    type: "coursework",
  },
  {
    id: "d2",
    moduleCode: "CS2006",
    moduleName: "Machine Learning",
    assessmentName: "Practical 2",
    dueDate: "2025-02-20",
    weight: 15,
    urgency: "critical",
    type: "lab",
  },
  {
    id: "d3",
    moduleCode: "CS2002",
    moduleName: "Software Engineering",
    assessmentName: "Presentation",
    dueDate: "2025-02-21",
    weight: 30,
    urgency: "soon",
    type: "presentation",
  },
  {
    id: "d4",
    moduleCode: "CS2005",
    moduleName: "Computer Networks",
    assessmentName: "Lab Exercises",
    dueDate: "2025-02-28",
    weight: 20,
    urgency: "soon",
    type: "lab",
  },
  {
    id: "d5",
    moduleCode: "CS2005",
    moduleName: "Computer Networks",
    assessmentName: "Midterm",
    dueDate: "2025-03-10",
    weight: 30,
    urgency: "upcoming",
    type: "exam",
  },
  {
    id: "d6",
    moduleCode: "CS2004",
    moduleName: "Web Technologies",
    assessmentName: "Final Project",
    dueDate: "2025-03-15",
    weight: 60,
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
