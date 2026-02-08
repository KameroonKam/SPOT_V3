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
      { id: "a1", name: "Coursework 1", type: "coursework", weight: 25, grade: 78, status: "completed", dueDate: null, isFormative: false, gitlabUrl: "https://gitlab.com/student/cs2001-cw1", feedback: "Good understanding of tree traversal algorithms. Your implementation of the AVL tree was efficient, though consider edge cases for deletion. Code style is clean and well-documented." },
      { id: "a2", name: "Coursework 2", type: "coursework", weight: 25, grade: 68, status: "completed", dueDate: null, isFormative: false, gitlabUrl: "https://gitlab.com/student/cs2001-cw2", feedback: "Solid graph implementation but the Dijkstra's algorithm could be optimised. The time complexity analysis was accurate. Consider using a priority queue for better performance." },
      { id: "a3", name: "Final Exam", type: "exam", weight: 50, grade: null, status: "upcoming", dueDate: "2025-01-20T14:00", isFormative: false },
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
      { id: "a4", name: "Group Project", type: "coursework", weight: 40, grade: 65, status: "completed", dueDate: null, isFormative: false, gitlabUrl: "https://gitlab.com/student/cs2002-group", feedback: "The project demonstrated good teamwork and version control practices. The architecture was sound but testing coverage was below expectations. Documentation could be more thorough." },
      { id: "a5", name: "Individual Report", type: "coursework", weight: 30, grade: null, status: "in-progress", dueDate: "2025-02-14T23:59", isFormative: false, gitlabUrl: "https://gitlab.com/student/cs2002-report" },
      { id: "a6", name: "Presentation", type: "presentation", weight: 30, grade: null, status: "upcoming", dueDate: "2025-02-21T10:00", isFormative: false },
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
      { id: "a7", name: "Practical Lab", type: "lab", weight: 30, grade: 80, status: "completed", dueDate: null, isFormative: false, feedback: "Excellent SQL query optimisation. Your normalisation work was thorough and the ER diagram was well-structured. Consider indexing strategies for larger datasets." },
      { id: "a8", name: "Final Exam", type: "exam", weight: 70, grade: 71, status: "completed", dueDate: null, isFormative: false, feedback: "Good coverage of relational algebra and transaction management. The concurrency control section could have been stronger. Overall a solid performance." },
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
      { id: "a9", name: "Portfolio", type: "coursework", weight: 40, grade: 70, status: "completed", dueDate: null, isFormative: false, gitlabUrl: "https://gitlab.com/student/cs2004-portfolio", feedback: "Good use of modern web technologies. The responsive design was well-implemented. Consider accessibility improvements and performance optimisation for image loading." },
      { id: "a10", name: "Final Project", type: "coursework", weight: 60, grade: null, status: "upcoming", dueDate: "2025-03-15T23:59", isFormative: false },
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
      { id: "a11", name: "Lab Exercises", type: "lab", weight: 20, grade: null, status: "in-progress", dueDate: "2025-02-28T17:00", isFormative: true },
      { id: "a12", name: "Midterm", type: "exam", weight: 30, grade: null, status: "upcoming", dueDate: "2025-03-10T09:30", isFormative: false },
      { id: "a13", name: "Final Exam", type: "exam", weight: 50, grade: null, status: "upcoming", dueDate: "2025-05-15T14:00", isFormative: false },
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
      { id: "a14", name: "Practical 1", type: "lab", weight: 15, grade: 62, status: "completed", dueDate: null, isFormative: false, gitlabUrl: "https://gitlab.com/student/cs2006-p1", feedback: "The implementation of linear regression was correct but the feature engineering could be improved. Consider cross-validation for model evaluation. Report was well-written." },
      { id: "a15", name: "Practical 2", type: "lab", weight: 15, grade: null, status: "in-progress", dueDate: "2025-02-20T23:59", isFormative: false, gitlabUrl: "https://gitlab.com/student/cs2006-p2" },
      { id: "a16", name: "Project", type: "coursework", weight: 40, grade: null, status: "upcoming", dueDate: "2025-04-01T23:59", isFormative: false },
      { id: "a17", name: "Exam", type: "exam", weight: 30, grade: null, status: "upcoming", dueDate: "2025-05-20T09:00", isFormative: false },
    ],
  },
];

export const upcomingDeadlines: Deadline[] = [
  {
    id: "d1",
    moduleCode: "CS2002",
    moduleName: "Software Engineering",
    moduleId: "2",
    assessmentName: "Individual Report",
    dueDate: "2025-02-14T23:59",
    weight: 30,
    urgency: "critical",
    type: "coursework",
  },
  {
    id: "d2",
    moduleCode: "CS2006",
    moduleName: "Machine Learning",
    moduleId: "6",
    assessmentName: "Practical 2",
    dueDate: "2025-02-20T23:59",
    weight: 15,
    urgency: "critical",
    type: "lab",
  },
  {
    id: "d3",
    moduleCode: "CS2002",
    moduleName: "Software Engineering",
    moduleId: "2",
    assessmentName: "Presentation",
    dueDate: "2025-02-21T10:00",
    weight: 30,
    urgency: "soon",
    type: "presentation",
  },
  {
    id: "d4",
    moduleCode: "CS2005",
    moduleName: "Computer Networks",
    moduleId: "5",
    assessmentName: "Lab Exercises",
    dueDate: "2025-02-28T17:00",
    weight: 20,
    urgency: "soon",
    type: "lab",
  },
  {
    id: "d5",
    moduleCode: "CS2005",
    moduleName: "Computer Networks",
    moduleId: "5",
    assessmentName: "Midterm",
    dueDate: "2025-03-10T09:30",
    weight: 30,
    urgency: "upcoming",
    type: "exam",
  },
  {
    id: "d6",
    moduleCode: "CS2004",
    moduleName: "Web Technologies",
    moduleId: "4",
    assessmentName: "Final Project",
    dueDate: "2025-03-15T23:59",
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
};
