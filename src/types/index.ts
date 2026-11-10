export type UserRole = 'public' | 'student' | 'teacher' | 'admin';

export type AdmissionStatus = 'pending' | 'approved' | 'rejected' | 'interview_scheduled';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Student {
  id: string;
  rollNumber: string; // e.g., JSA-2026-101
  admissionNumber: string;
  fullName: string;
  urduName?: string;
  fatherName: string;
  guardianPhone: string;
  cnicOrBForm: string;
  dob: string;
  gender: 'male' | 'female';
  bloodGroup: BloodGroup;
  department: string; // e.g. Dars-e-Nizami, Hifz-ul-Quran
  currentYear: string; // e.g. Year 1 (Ula), Year 2 (Saniyah), Hifz Stage 2
  boardingStatus: 'boarder' | 'day_scholar';
  photoUrl: string;
  address: string;
  admissionDate: string;
  status: 'active' | 'graduated' | 'suspended';
  emergencyContact: string;
  email?: string;
  previousSchool?: string;
  previousEducation?: string;
  admissionApplicationId?: string;
  admissionNotes?: string;
  academicSession?: string;
}

export interface AdmissionApplication {
  id: string;
  applicationNumber: string; // e.g., APP-M-2026-8402 or APP-F-2026-8403
  admissionCategory?: 'male' | 'female'; // Male (بنین) vs Female (بنات)
  applicantName: string;
  urduName?: string;
  fatherName: string;
  dob: string;
  gender: 'male' | 'female';
  photoUrl?: string;
  bFormCnic?: string;
  contactNumber?: string;
  whatsappNumber?: string;
  email?: string;
  address: string;
  city: string;
  province?: string;
  previousSchool?: string;
  previousEducation?: string;
  program: string; // Applying Course
  preferredSection?: string; // Preferred Class/Section
  guardianName?: string;
  guardianContact?: string;
  relationship?: string;
  medicalNotes?: string;
  documentUrl?: string;
  documentName?: string;
  status: AdmissionStatus;
  submittedAt: string;
  assignedSection?: string;
  interviewDate?: string;
  adminNotes?: string;
  assignedRollNumber?: string;
  // Backward compatibility aliases
  phone?: string;
  guardianPhone?: string;
  applicantCnicOrBForm?: string;
  fatherCnic?: string;
  boardingRequired?: boolean;
  previousInstitute?: string;
  hafiz?: boolean;
  bloodGroup?: BloodGroup;
}

export interface StaffMember {
  id: string;
  fullName: string;
  urduName?: string;
  fatherName: string;
  contact: string;
  address: string;
  designation: string;
  joiningDate: string;
  assignedDepartment: string;
  salary: number;
  salaryStatus?: 'paid' | 'pending';
  status: 'active' | 'inactive';
  roleType: 'teacher' | 'employee';
  photoUrl: string;
  assignedCourses?: string[];
  assignedClasses?: string[];
  qualification?: string;
  experience?: string;
  email?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  arabicTitle: string;
  category:
    | 'Hifz-ul-Quran'
    | 'Nazra Quran'
    | 'Tajweed-ul-Quran'
    | 'Shariyat Course'
    | 'Dars-e-Nizami'
    | 'Islamic Studies'
    | 'Arabic Language'
    | 'Quran Translation and Tafseer'
    | string;
  department: string;
  yearLevel?: string;
  instructor: string;
  creditHours?: number;
  description: string;
  objectives: string[];
  eligibility: string; // Configurable by authorized management
  duration: string; // Configurable by authorized management
  fees: string; // Configurable by authorized management
  certification: string; // Configurable by authorized management
  admissionInfo: string;
  books: string[];
  isConfiguredByManagement?: boolean;
  lastUpdated?: string;
  assignedTeachers?: string[];
  assignedClasses?: string[];
  genderArrangement?: {
    maleClasses?: string[];
    femaleClasses?: string[];
    hasSeparateWings?: boolean;
    maleTimings?: string;
    femaleTimings?: string;
  };
  status?: 'active' | 'inactive';
}

export interface Facility {
  id: string;
  name: string;
  arabicName: string;
  category: string;
  description: string;
  detailedSpecs: string[];
  imageUrl: string;
  isVerifiedByManagement: boolean;
  verifiedBy: string;
  verificationDate: string;
  capacity?: string;
  location?: string;
  equipment?: string[];
  status: 'operational' | 'upgrading' | 'planned';
}

export interface FeeStructure {
  id: string;
  courseId: string;
  courseName: string;
  department: string;
  academicYear: string;
  billingFrequency: 'monthly' | 'annual' | 'one_time';
  tuitionFee: number;
  boardingFee: number;
  admissionFee: number;
  examFee: number;
  otherDues: number;
  notes?: string;
  isScholarshipApplicable: boolean;
}

export interface FeePaymentEntry {
  id: string;
  receiptNumber: string;
  amount: number;
  date: string;
  paymentMethod: string;
  receivedBy: string;
  notes?: string;
}

export interface FeeVoucher {
  id: string;
  voucherNumber: string;
  receiptNumber?: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  gender?: 'male' | 'female';
  department: string;
  course?: string;
  monthYear: string; // e.g. "March 2026" or "Annual 2026-2027"
  feeType?: 'monthly' | 'annual' | 'admission' | 'exam';
  tuitionFee: number;
  boardingFee: number;
  examFee: number;
  otherDues: number;
  discount: number;
  totalAmount: number;
  amountPaid?: number;
  remainingDues?: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'partial' | 'overdue';
  paidDate?: string;
  paymentMethod?: string;
  collectedBy?: string;
  remarks?: string;
  paymentHistory?: FeePaymentEntry[];
}

export interface StudentAttendanceEntry {
  studentId: string;
  rollNumber: string;
  studentName: string;
  gender?: 'male' | 'female';
  course?: string;
  classSection?: string;
  status: 'present' | 'absent' | 'leave';
  timestamp?: string;
  markedBy?: string;
  method?: 'qr_scan' | 'manual' | 'bulk';
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  classId: string; // e.g. "Dars-e-Nizami" or "Hifz-ul-Quran"
  course?: string;
  genderCategory?: 'all' | 'male' | 'female';
  sessionTime?: string;
  lastUpdated?: string;
  updatedBy?: string;
  isLocked?: boolean;
  records: StudentAttendanceEntry[];
}

export interface ExamGrade {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  examTerm: 'Mid-Term 2026' | 'Annual 2026' | 'Quarterly Test';
  department: string;
  subjects: {
    subjectName: string;
    totalMarks: number;
    obtainedMarks: number;
  }[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  remarks: string;
}

export interface Notice {
  id: string;
  title: string;
  urduTitle?: string;
  content: string;
  category: 'Admissions' | 'Academic' | 'Exams' | 'Events' | 'Administrative';
  publishDate: string;
  author: string;
  isImportant: boolean;
  attachmentName?: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  urduName?: string;
  title: string;
  role: string;
  contact?: string;
  bio?: string;
  photoUrl?: string;
}

export interface InstituteSettings {
  instituteName: string;
  arabicName: string;
  directorName: string;
  directorTitle: string;
  directorBio?: string;
  directorVision?: string;
  directorPhotoUrl?: string;
  directorPhone?: string;
  directorEmail?: string;
  officeHours?: string;
  establishedYear: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  customLogoUrl: string | null;
  leadershipMembers?: LeadershipMember[];
  supabaseConfig: {
    url: string;
    anonKey: string;
    isConnected: boolean;
  };
}

export type MediaItemType = 'video' | 'image' | 'banner' | 'logo' | 'footage';

export interface PromotionalMediaItem {
  id: string;
  title: string;
  urduTitle?: string;
  type: MediaItemType;
  category: 'institute_intro' | 'student_footage' | 'course_promo' | 'admission_ad' | 'event_highlight';
  url: string; // video mp4/webm/streaming URL or image URL
  thumbnailUrl?: string;
  duration?: string;
  description: string;
  courseId?: string;
  courseName?: string;
  publishedDate: string;
  author: string;
  viewsCount?: number;
  tags?: string[];
  consentObtained?: boolean; // Student learning footage consent compliance
  aspectRatio?: '16:9' | '9:16' | '1:1';
}

export interface AdvertisementPlan {
  id: string;
  title: string;
  coursePromoted: string;
  targetAudience: string;
  videoDescription: string;
  scriptUrdu: string;
  scriptEnglish: string;
  voiceoverText: string;
  captionText: string;
  thumbnailUrl: string;
  videoUrl?: string;
  status: 'draft' | 'in_production' | 'reviewed' | 'published';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

