import { getSupabaseClient } from './supabase';
import {
  Student,
  AdmissionApplication,
  StaffMember,
  Course,
  FeeVoucher,
  FeeStructure,
  AttendanceRecord,
  StudentAttendanceEntry,
  PromotionalMediaItem,
  AdvertisementPlan,
  Notice,
  Facility,
} from '../types';

/**
 * Enterprise Supabase Backend Data Service
 * Jamia Salahuddin Ayubi - Educational Management Software
 * Founder & Director General: Muneeb ur Rehman
 *
 * Provides real async CRUD, schema mapping, batch sync, and storage uploads.
 */
export const SupabaseDataService = {
  // ---------------------------------------------------------------------------
  // 1. STUDENTS MODULE
  // ---------------------------------------------------------------------------
  async fetchStudents(): Promise<{ success: boolean; data?: Student[]; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client not initialized' };

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return { success: false, error: error.message };

      const mapped: Student[] = (data || []).map((r: any) => ({
        id: r.id,
        rollNumber: r.roll_number,
        admissionNumber: r.admission_number,
        fullName: r.full_name,
        urduName: r.urdu_name || '',
        fatherName: r.father_name,
        guardianPhone: r.guardian_phone,
        cnicOrBForm: r.cnic_or_b_form || '',
        dob: r.dob || '2006-01-01',
        gender: r.gender || 'male',
        bloodGroup: r.blood_group || 'B+',
        department: r.department,
        currentYear: r.current_year,
        boardingStatus: r.boarding_status || 'day_scholar',
        photoUrl: r.photo_url || '',
        address: r.address || '',
        admissionDate: r.admission_date || new Date().toISOString().split('T')[0],
        status: r.status || 'active',
        emergencyContact: r.emergency_contact || r.guardian_phone || '',
      }));

      return { success: true, data: mapped };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to fetch students' };
    }
  },

  async insertStudent(student: Omit<Student, 'id'>): Promise<{ success: boolean; data?: any; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client not initialized' };

    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          roll_number: student.rollNumber,
          admission_number: student.admissionNumber,
          full_name: student.fullName,
          urdu_name: student.urduName || null,
          father_name: student.fatherName,
          guardian_phone: student.guardianPhone,
          cnic_or_b_form: student.cnicOrBForm || null,
          dob: student.dob || null,
          gender: student.gender,
          blood_group: student.bloodGroup,
          department: student.department,
          current_year: student.currentYear,
          boarding_status: student.boardingStatus,
          photo_url: student.photoUrl || null,
          address: student.address,
          admission_date: student.admissionDate,
          status: student.status,
          emergency_contact: student.emergencyContact,
        }])
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || 'Insert student failed' };
    }
  },

  async updateStudent(idOrRoll: string, updates: Partial<Student>): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client not initialized' };

    try {
      const payload: Record<string, any> = { updated_at: new Date().toISOString() };
      if (updates.fullName !== undefined) payload.full_name = updates.fullName;
      if (updates.urduName !== undefined) payload.urdu_name = updates.urduName;
      if (updates.fatherName !== undefined) payload.father_name = updates.fatherName;
      if (updates.guardianPhone !== undefined) payload.guardian_phone = updates.guardianPhone;
      if (updates.cnicOrBForm !== undefined) payload.cnic_or_b_form = updates.cnicOrBForm;
      if (updates.gender !== undefined) payload.gender = updates.gender;
      if (updates.bloodGroup !== undefined) payload.blood_group = updates.bloodGroup;
      if (updates.department !== undefined) payload.department = updates.department;
      if (updates.currentYear !== undefined) payload.current_year = updates.currentYear;
      if (updates.boardingStatus !== undefined) payload.boarding_status = updates.boardingStatus;
      if (updates.photoUrl !== undefined) payload.photo_url = updates.photoUrl;
      if (updates.address !== undefined) payload.address = updates.address;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.emergencyContact !== undefined) payload.emergency_contact = updates.emergencyContact;

      const { error } = await supabase
        .from('students')
        .update(payload)
        .or(`id.eq.${idOrRoll},roll_number.eq.${idOrRoll}`);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Update student failed' };
    }
  },

  async deleteStudent(idOrRoll: string): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client not initialized' };

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .or(`id.eq.${idOrRoll},roll_number.eq.${idOrRoll}`);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Delete student failed' };
    }
  },

  // ---------------------------------------------------------------------------
  // 2. ADMISSION APPLICATIONS MODULE
  // ---------------------------------------------------------------------------
  async fetchAdmissions(): Promise<{ success: boolean; data?: AdmissionApplication[]; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client not initialized' };

    try {
      const { data, error } = await supabase
        .from('admission_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) return { success: false, error: error.message };

      const mapped: AdmissionApplication[] = (data || []).map((r: any) => ({
        id: r.id,
        applicationNumber: r.application_number,
        applicantName: r.applicant_name,
        urduName: r.urdu_name || '',
        fatherName: r.father_name,
        fatherCnic: r.father_cnic || '',
        applicantCnicOrBForm: r.applicant_cnic_or_b_form || '',
        bFormCnic: r.applicant_cnic_or_b_form || '',
        dob: r.dob || '',
        gender: r.gender || 'male',
        admissionCategory: r.gender || 'male',
        phone: r.phone || '',
        contactNumber: r.phone || '',
        guardianPhone: r.guardian_phone || '',
        guardianContact: r.guardian_phone || '',
        email: r.email || '',
        address: r.address || '',
        city: r.city || '',
        province: r.province || 'Punjab',
        program: r.program || '',
        preferredSection: r.preferred_section || '',
        boardingRequired: !!r.boarding_required,
        previousEducation: r.previous_education || '',
        previousInstitute: r.previous_institute || '',
        previousSchool: r.previous_institute || '',
        hafiz: !!r.hafiz,
        bloodGroup: r.blood_group || 'B+',
        photoUrl: r.photo_url || '',
        documentUrl: r.document_url || '',
        documentName: r.document_name || '',
        medicalNotes: r.medical_notes || '',
        status: r.status || 'pending',
        interviewDate: r.interview_date || undefined,
        adminNotes: r.admin_notes || '',
        assignedRollNumber: r.assigned_roll_number || undefined,
        assignedSection: r.assigned_section || undefined,
        submittedAt: r.submitted_at || new Date().toISOString(),
      }));

      return { success: true, data: mapped };
    } catch (err: any) {
      return { success: false, error: err.message || 'Fetch admissions failed' };
    }
  },

  async insertAdmission(app: Omit<AdmissionApplication, 'id' | 'submittedAt'>): Promise<{ success: boolean; data?: any; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client not initialized' };

    try {
      const { data, error } = await supabase
        .from('admission_applications')
        .insert([{
          application_number: app.applicationNumber,
          applicant_name: app.applicantName,
          urdu_name: app.urduName || null,
          father_name: app.fatherName,
          father_cnic: app.fatherCnic || null,
          applicant_cnic_or_b_form: app.bFormCnic || app.applicantCnicOrBForm || null,
          dob: app.dob || null,
          gender: app.gender || app.admissionCategory || 'male',
          phone: app.contactNumber || app.phone || '',
          guardian_phone: app.guardianContact || app.guardianPhone || '',
          email: app.email || null,
          address: app.address,
          city: app.city,
          province: app.province || 'Punjab',
          program: app.program,
          preferred_section: app.preferredSection || null,
          boarding_required: !!app.boardingRequired,
          previous_education: app.previousEducation || null,
          previous_institute: app.previousSchool || app.previousInstitute || null,
          hafiz: !!app.hafiz,
          blood_group: app.bloodGroup || 'B+',
          photo_url: app.photoUrl || null,
          document_url: app.documentUrl || null,
          document_name: app.documentName || null,
          medical_notes: app.medicalNotes || null,
          status: app.status || 'pending',
          assigned_roll_number: app.assignedRollNumber || null,
          assigned_section: app.assignedSection || null,
          admin_notes: app.adminNotes || null,
        }])
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || 'Insert admission application failed' };
    }
  },

  async updateAdmissionStatus(
    appNumberOrId: string,
    status: AdmissionApplication['status'],
    details?: { assignedRollNumber?: string; assignedSection?: string; adminNotes?: string; interviewDate?: string }
  ): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client not initialized' };

    try {
      const payload: Record<string, any> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (details?.assignedRollNumber) payload.assigned_roll_number = details.assignedRollNumber;
      if (details?.assignedSection) payload.assigned_section = details.assignedSection;
      if (details?.adminNotes) payload.admin_notes = details.adminNotes;
      if (details?.interviewDate) payload.interview_date = details.interviewDate;

      const { error } = await supabase
        .from('admission_applications')
        .update(payload)
        .or(`id.eq.${appNumberOrId},application_number.eq.${appNumberOrId}`);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Update admission status failed' };
    }
  },

  // ---------------------------------------------------------------------------
  // 3. STAFF & ASATIZA MODULE
  // ---------------------------------------------------------------------------
  async fetchStaff(): Promise<{ success: boolean; data?: StaffMember[]; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client not initialized' };

    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return { success: false, error: error.message };

      const mapped: StaffMember[] = (data || []).map((r: any) => ({
        id: r.id,
        fullName: r.full_name,
        urduName: r.urdu_name || '',
        fatherName: r.father_name || '',
        contact: r.contact || '',
        email: r.email || '',
        address: r.address || '',
        designation: r.designation,
        joiningDate: r.joining_date || new Date().toISOString().split('T')[0],
        assignedDepartment: r.assigned_department,
        salary: Number(r.salary || 0),
        salaryStatus: r.salary_status || 'paid',
        status: r.status || 'active',
        roleType: r.role_type || 'teacher',
        photoUrl: r.photo_url || '',
        qualification: r.qualification || '',
        experience: r.experience || '',
        assignedCourses: [],
        assignedClasses: [],
      }));

      return { success: true, data: mapped };
    } catch (err: any) {
      return { success: false, error: err.message || 'Fetch staff failed' };
    }
  },

  // ---------------------------------------------------------------------------
  // 4. ATTENDANCE MODULE
  // ---------------------------------------------------------------------------
  async recordAttendanceEntries(
    entries: {
      date: string;
      classId: string;
      course?: string;
      wing?: string;
      rollNumber: string;
      studentName: string;
      gender?: string;
      status: 'present' | 'absent' | 'leave';
      method?: 'manual' | 'qr_scan';
      notes?: string;
      markedBy?: string;
    }[]
  ): Promise<{ success: boolean; count: number; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, count: 0, error: 'Supabase client not initialized' };

    try {
      const rows = entries.map((e) => ({
        date: e.date,
        class_id: e.classId,
        course: e.course || null,
        wing: e.wing || null,
        roll_number: e.rollNumber,
        student_name: e.studentName,
        gender: e.gender || null,
        status: e.status,
        method: e.method || 'manual',
        notes: e.notes || null,
        marked_by: e.markedBy || 'Staff Proctor',
      }));

      const { data, error } = await supabase
        .from('attendance')
        .insert(rows)
        .select();

      if (error) return { success: false, count: 0, error: error.message };
      return { success: true, count: data?.length || rows.length };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message || 'Attendance sync failed' };
    }
  },

  // ---------------------------------------------------------------------------
  // 5. FINANCE & FEE MODULE
  // ---------------------------------------------------------------------------
  async fetchFeeVouchers(): Promise<{ success: boolean; data?: FeeVoucher[]; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client not initialized' };

    try {
      const { data, error } = await supabase
        .from('fee_vouchers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return { success: false, error: error.message };

      const mapped: FeeVoucher[] = (data || []).map((r: any) => ({
        id: r.id,
        voucherNumber: r.voucher_number,
        studentId: r.student_id || '',
        studentName: r.student_name,
        rollNumber: r.roll_number,
        gender: 'male',
        department: r.department || 'Classical Islamic Sciences',
        course: r.department || 'Dars-e-Nizami',
        monthYear: r.month_year,
        feeType: 'monthly',
        tuitionFee: Number(r.tuition_fee || 0),
        boardingFee: Number(r.boarding_fee || 0),
        examFee: Number(r.exam_fee || 0),
        otherDues: Number(r.other_dues || 0),
        discount: Number(r.discount || 0),
        totalAmount: Number(r.total_amount || 0),
        amountPaid: r.status === 'paid' ? Number(r.total_amount || 0) : 0,
        remainingDues: r.status === 'paid' ? 0 : Number(r.total_amount || 0),
        dueDate: r.due_date,
        status: r.status || 'unpaid',
        paidDate: r.paid_date || undefined,
        paymentMethod: r.payment_method || undefined,
      }));

      return { success: true, data: mapped };
    } catch (err: any) {
      return { success: false, error: err.message || 'Fetch fee vouchers failed' };
    }
  },

  // ---------------------------------------------------------------------------
  // 6. STORAGE BUCKET FILE UPLOADER
  // ---------------------------------------------------------------------------
  async uploadFile(
    bucket: 'student-photos' | 'staff-photos' | 'admission-documents' | 'promotional-media',
    file: File | Blob,
    path: string
  ): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Supabase client not initialized' };

    try {
      const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: true,
      });

      if (error) return { success: false, error: error.message };

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return { success: true, publicUrl: urlData.publicUrl };
    } catch (err: any) {
      return { success: false, error: err.message || 'File upload failed' };
    }
  },
};
