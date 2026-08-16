export type SubmissionStatus =
  | "new"
  | "reviewing"
  | "contacted"
  | "closed";

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdmissionApplication {
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  program: string;
  currentQualification: string;
  message: string;
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CareerApplication {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  linkedinUrl: string;
  portfolioUrl: string;
  resumeUrl: string;
  coverLetter: string;
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceLead {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}
