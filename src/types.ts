/**
 * Domain types for IEP and lesson data.
 *
 * These types model the pedagogically meaningful structure of IEP documents
 * and curriculum materials. The goal is to capture what a teacher actually
 * needs to differentiate instruction, not the full legal/administrative
 * content of these documents.
 */

// ── IEP Types ──────────────────────────────────────────────────────────

export interface StudentProfile {
  name: string;
  grade: string;
  age: number;
  school: string;
  disability: string;
  /** What the student does well and enjoys */
  strengths: string[];
  /** Observable patterns that impede learning */
  challenges: string[];
  /** What motivates this student */
  motivators: string[];
  /** Student's own words about what they want to achieve */
  studentVision: Record<string, string>;
}

export interface PresentLevel {
  domain: "academic" | "behavioral" | "communication" | "other";
  subject?: string;
  currentPerformance: string;
  /** Standardized assessment data (e.g., iReady grade levels) */
  assessmentData?: Record<string, string>;
  strengths: string;
  impactOfDisability: string;
}

export interface GoalBenchmark {
  description: string;
}

export interface IEPGoal {
  area: string;
  baseline: string;
  annualTarget: string;
  criteria: string;
  method: string;
  schedule: string;
  responsiblePerson: string;
  benchmarks: GoalBenchmark[];
}

export interface Accommodation {
  category: "presentation" | "response" | "timing" | "setting";
  description: string;
}

export interface Modification {
  category: "content" | "instruction" | "output";
  description: string;
}

export interface ServiceDelivery {
  goalNumbers: string;
  type: string;
  provider: string;
  location: string;
  frequency: string;
  duration: string;
}

export interface IEPData {
  profile: StudentProfile;
  presentLevels: PresentLevel[];
  goals: IEPGoal[];
  accommodations: Accommodation[];
  modifications: Modification[];
  services: ServiceDelivery[];
}

// ── Lesson Types ───────────────────────────────────────────────────────

export interface LessonMetadata {
  title: string;
  author: string;
  unit: string;
  gradeLevel: string;
  subject: string;
  /** Curriculum standards addressed (e.g., RI.7.2) */
  standards: string[];
  totalDuration: string;
  skillFocus: string;
  knowledgeFocus: string;
}

export interface LessonActivity {
  name: string;
  duration: string;
  description: string;
  readingModality: "whole-class" | "partner" | "independent" | "discussion";
  /** The actual content/questions for this activity */
  content: string;
}

export interface LessonVocabulary {
  word: string;
  pronunciation: string;
  definition?: string;
}

export interface LessonQuestion {
  id: string;
  type: "during-reading" | "multiple-choice" | "short-answer" | "discussion";
  /** Which paragraphs this question covers */
  paragraphRange?: string;
  /** e.g., "Think & Share", "Write", "Turn & Talk", "Find Evidence" */
  format: string;
  questionText: string;
  /** Expected answer (from teacher copy) */
  sampleAnswer?: string;
  /** Standards alignment */
  standard?: string;
}

export interface LessonData {
  metadata: LessonMetadata;
  textContent: string;
  activities: LessonActivity[];
  vocabulary: LessonVocabulary[];
  questions: LessonQuestion[];
  teacherNotes: string[];
  facilitationOptions: string[];
}
