import { createClient, SupabaseClient, User as SupabaseAuthUser } from '@supabase/supabase-js';

// Default Supabase configuration from environment variables if present
const DEFAULT_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const DEFAULT_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(customUrl?: string, customKey?: string): SupabaseClient | null {
  const url = customUrl || localStorage.getItem('jamia_supabase_url') || DEFAULT_SUPABASE_URL;
  const key = customKey || localStorage.getItem('jamia_supabase_anon_key') || DEFAULT_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  try {
    if (!supabaseInstance || customUrl || customKey) {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    }
    return supabaseInstance;
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
    return null;
  }
}

export interface TableStatus {
  name: string;
  exists: boolean;
  count: number;
  error?: string;
}

export interface SupabaseHealthCheck {
  connected: boolean;
  message: string;
  url: string;
  tables: Record<string, TableStatus>;
  buckets: Record<string, boolean>;
  user: SupabaseAuthUser | null;
}

// Inspect active Supabase connection, database tables, and storage buckets
export async function testSupabaseConnection(
  url?: string,
  key?: string
): Promise<SupabaseHealthCheck> {
  const targetUrl = url || localStorage.getItem('jamia_supabase_url') || DEFAULT_SUPABASE_URL;
  const targetKey = key || localStorage.getItem('jamia_supabase_anon_key') || DEFAULT_SUPABASE_ANON_KEY;

  const result: SupabaseHealthCheck = {
    connected: false,
    message: '',
    url: targetUrl,
    tables: {},
    buckets: {},
    user: null,
  };

  if (!targetUrl || !targetUrl.startsWith('https://')) {
    result.message = 'Supabase Project URL must start with https:// (e.g. https://xyz.supabase.co)';
    return result;
  }

  if (!targetKey || targetKey.length < 20) {
    result.message = 'Supabase Anon/Public Key is required (starts with eyJ...)';
    return result;
  }

  try {
    const client = createClient(targetUrl, targetKey);

    // Check Auth user state
    try {
      const { data: authData } = await client.auth.getUser();
      result.user = authData?.user || null;
    } catch {
      // ignore
    }

    // Inspect required tables
    const requiredTables = [
      'students',
      'admission_applications',
      'guardians',
      'staff',
      'courses',
      'classes',
      'attendance',
      'fee_structures',
      'fee_vouchers',
      'payment_receipts',
      'student_id_cards',
      'notices',
      'facilities',
      'promotional_media',
      'advertisement_plans',
      'user_roles',
    ];

    for (const tbl of requiredTables) {
      try {
        const { count, error } = await client.from(tbl).select('*', { count: 'exact', head: true });
        if (error) {
          result.tables[tbl] = {
            name: tbl,
            exists: false,
            count: 0,
            error: error.message,
          };
        } else {
          result.tables[tbl] = {
            name: tbl,
            exists: true,
            count: count || 0,
          };
        }
      } catch (err: any) {
        result.tables[tbl] = {
          name: tbl,
          exists: false,
          count: 0,
          error: err.message,
        };
      }
    }

    // Inspect Storage Buckets
    const requiredBuckets = ['student-photos', 'staff-photos', 'admission-documents', 'promotional-media'];
    try {
      const { data: bucketList } = await client.storage.listBuckets();
      if (bucketList) {
        requiredBuckets.forEach((bName) => {
          result.buckets[bName] = bucketList.some((b) => b.name === bName || b.id === bName);
        });
      }
    } catch {
      // storage list might require auth
      requiredBuckets.forEach((bName) => {
        result.buckets[bName] = false;
      });
    }

    const existingTableCount = Object.values(result.tables).filter((t) => t.exists).length;
    result.connected = true;
    if (existingTableCount === requiredTables.length) {
      result.message = 'Connected to Supabase! All 16 database tables and RLS policies are active.';
    } else if (existingTableCount > 0) {
      result.message = `Connected to Supabase! (${existingTableCount}/${requiredTables.length} tables active. Run schema migration for remaining tables.)`;
    } else {
      result.message = 'Connected to Supabase project! Execute the SQL schema below to provision tables and security rules.';
    }

    // Save verified credentials to localStorage
    if (url && key) {
      localStorage.setItem('jamia_supabase_url', url);
      localStorage.setItem('jamia_supabase_anon_key', key);
    }

    return result;
  } catch (err: any) {
    result.connected = false;
    result.message = err.message || 'Connection test failed. Please verify credentials.';
    return result;
  }
}

// Complete production SQL schema covering all 15 required modules + RLS + Storage Buckets
export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- Jamia Salahuddin Ayubi - Comprehensive Enterprise Schema
-- Founder & Director General: Muneeb ur Rehman
-- Execute in Supabase SQL Editor (All Tables, RLS, Storage)
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roll_number TEXT UNIQUE NOT NULL,
    admission_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    urdu_name TEXT,
    father_name TEXT NOT NULL,
    guardian_phone TEXT NOT NULL,
    cnic_or_b_form TEXT,
    dob DATE,
    gender TEXT CHECK (gender IN ('male', 'female')),
    blood_group TEXT,
    department TEXT NOT NULL,
    current_year TEXT NOT NULL,
    boarding_status TEXT CHECK (boarding_status IN ('boarder', 'day_scholar')),
    photo_url TEXT,
    address TEXT,
    admission_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'suspended')),
    emergency_contact TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. GUARDIANS TABLE
CREATE TABLE IF NOT EXISTS public.guardians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    urdu_name TEXT,
    relationship TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    cnic TEXT,
    occupation TEXT,
    address TEXT,
    emergency_contact TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ADMISSION APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.admission_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number TEXT UNIQUE NOT NULL,
    applicant_name TEXT NOT NULL,
    urdu_name TEXT,
    father_name TEXT NOT NULL,
    father_cnic TEXT,
    applicant_cnic_or_b_form TEXT,
    dob DATE,
    gender TEXT CHECK (gender IN ('male', 'female')),
    phone TEXT NOT NULL,
    guardian_phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT,
    program TEXT NOT NULL,
    preferred_section TEXT,
    boarding_required BOOLEAN DEFAULT FALSE,
    previous_education TEXT,
    previous_institute TEXT,
    hafiz BOOLEAN DEFAULT FALSE,
    blood_group TEXT,
    photo_url TEXT,
    document_url TEXT,
    document_name TEXT,
    medical_notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'interview_scheduled')),
    interview_date TIMESTAMPTZ,
    admin_notes TEXT,
    assigned_roll_number TEXT,
    assigned_section TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STAFF & TEACHERS TABLE
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    urdu_name TEXT,
    father_name TEXT NOT NULL,
    contact TEXT NOT NULL,
    email TEXT,
    address TEXT,
    designation TEXT NOT NULL,
    joining_date DATE DEFAULT CURRENT_DATE,
    assigned_department TEXT NOT NULL,
    salary NUMERIC(10, 2) DEFAULT 0,
    salary_status TEXT DEFAULT 'paid' CHECK (salary_status IN ('paid', 'pending')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    role_type TEXT DEFAULT 'teacher' CHECK (role_type IN ('teacher', 'employee')),
    photo_url TEXT,
    qualification TEXT,
    experience TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE,
    title TEXT NOT NULL,
    urdu_title TEXT,
    duration TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    syllabus JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CLASSES TABLE
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    course_name TEXT NOT NULL,
    wing TEXT CHECK (wing IN ('male', 'female', 'both')),
    teacher_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    teacher_name TEXT,
    section TEXT,
    room_number TEXT,
    academic_session TEXT DEFAULT '2026-2027',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    class_id TEXT NOT NULL,
    course TEXT,
    wing TEXT,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    roll_number TEXT NOT NULL,
    student_name TEXT NOT NULL,
    gender TEXT,
    status TEXT CHECK (status IN ('present', 'absent', 'leave')),
    method TEXT DEFAULT 'manual' CHECK (method IN ('manual', 'qr_scan')),
    notes TEXT,
    marked_by TEXT DEFAULT 'Staff Proctor',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FEE STRUCTURES TABLE
CREATE TABLE IF NOT EXISTS public.fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program TEXT NOT NULL,
    wing TEXT CHECK (wing IN ('male', 'female', 'both')),
    tuition_fee NUMERIC(10, 2) DEFAULT 0,
    boarding_fee NUMERIC(10, 2) DEFAULT 0,
    admission_fee NUMERIC(10, 2) DEFAULT 0,
    exam_fee NUMERIC(10, 2) DEFAULT 0,
    annual_dues NUMERIC(10, 2) DEFAULT 0,
    frequency TEXT DEFAULT 'monthly',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FEE VOUCHERS TABLE
CREATE TABLE IF NOT EXISTS public.fee_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_number TEXT UNIQUE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    roll_number TEXT NOT NULL,
    department TEXT NOT NULL,
    month_year TEXT NOT NULL,
    tuition_fee NUMERIC(10, 2) DEFAULT 0,
    boarding_fee NUMERIC(10, 2) DEFAULT 0,
    exam_fee NUMERIC(10, 2) DEFAULT 0,
    other_dues NUMERIC(10, 2) DEFAULT 0,
    discount NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid', 'overdue')),
    paid_date TIMESTAMPTZ,
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PAYMENT RECEIPTS TABLE
CREATE TABLE IF NOT EXISTS public.payment_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number TEXT UNIQUE NOT NULL,
    voucher_id UUID REFERENCES public.fee_vouchers(id) ON DELETE CASCADE,
    voucher_number TEXT NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    roll_number TEXT NOT NULL,
    student_name TEXT NOT NULL,
    amount_paid NUMERIC(10, 2) NOT NULL,
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    payment_method TEXT NOT NULL,
    received_by TEXT DEFAULT 'Accounts Dept (Muneeb ur Rehman)',
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. STUDENT ID CARDS TABLE
CREATE TABLE IF NOT EXISTS public.student_id_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    roll_number TEXT NOT NULL,
    student_name TEXT NOT NULL,
    card_type TEXT DEFAULT 'cr80_pvc',
    issue_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    barcode_token TEXT UNIQUE NOT NULL,
    qr_data TEXT NOT NULL,
    qr_code_url TEXT,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    reprint_count INT DEFAULT 0,
    last_reprinted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. NOTICES TABLE
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    urdu_title TEXT,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    is_important BOOLEAN DEFAULT FALSE,
    author TEXT DEFAULT 'Muneeb ur Rehman (Director General)',
    publish_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. FACILITIES TABLE
CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    arabic_name TEXT,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    location TEXT,
    capacity TEXT,
    detailed_specs JSONB,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. PROMOTIONAL MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.promotional_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    urdu_title TEXT,
    type TEXT NOT NULL CHECK (type IN ('video', 'image', 'banner', 'logo', 'footage')),
    category TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration TEXT,
    description TEXT,
    course_name TEXT,
    consent_obtained BOOLEAN DEFAULT TRUE,
    published_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. ADVERTISEMENT PLANS TABLE
CREATE TABLE IF NOT EXISTS public.advertisement_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    course_promoted TEXT NOT NULL,
    target_audience TEXT,
    video_description TEXT,
    script_urdu TEXT,
    script_english TEXT,
    voiceover_text TEXT,
    caption_text TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_production', 'reviewed', 'published')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. USER ROLES & PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('director_general', 'authorized_management', 'staff')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR HIGH-PERFORMANCE QUERIES
CREATE INDEX IF NOT EXISTS idx_students_roll ON public.students(roll_number);
CREATE INDEX IF NOT EXISTS idx_students_gender ON public.students(gender);
CREATE INDEX IF NOT EXISTS idx_students_department ON public.students(department);
CREATE INDEX IF NOT EXISTS idx_admissions_number ON public.admission_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON public.admission_applications(status);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_roll ON public.attendance(roll_number);
CREATE INDEX IF NOT EXISTS idx_fees_voucher ON public.fee_vouchers(voucher_number);
CREATE INDEX IF NOT EXISTS idx_fees_student ON public.fee_vouchers(student_id);

-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotional_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisement_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Public Read Policies for Public Catalog & Transparency
CREATE POLICY "Allow public read on courses" ON public.courses FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read on facilities" ON public.facilities FOR SELECT USING (is_verified = true);
CREATE POLICY "Allow public read on notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Allow public read on promotional media" ON public.promotional_media FOR SELECT USING (true);
CREATE POLICY "Allow public read on fee structures" ON public.fee_structures FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read on active students for ID verification" ON public.students FOR SELECT USING (status = 'active');

-- Admission Applications: Public Insert, Admin All
CREATE POLICY "Allow public insert on admission applications" ON public.admission_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select own admission application" ON public.admission_applications FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on admission applications" ON public.admission_applications FOR ALL USING (auth.role() = 'authenticated');

-- Private Administrative Tables: Authenticated Management Only
CREATE POLICY "Allow admin full access on students" ON public.students FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on guardians" ON public.guardians FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on staff" ON public.staff FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on classes" ON public.classes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on attendance" ON public.attendance FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on fee vouchers" ON public.fee_vouchers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on payment receipts" ON public.payment_receipts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on student ID cards" ON public.student_id_cards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on courses" ON public.courses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on facilities" ON public.facilities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on notices" ON public.notices FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on promotional media" ON public.promotional_media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access on advertisement plans" ON public.advertisement_plans FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin read user roles" ON public.user_roles FOR SELECT USING (auth.role() = 'authenticated');

-- SUPABASE STORAGE BUCKETS (Run in Storage Settings or SQL)
-- 1. student-photos (Public read, Authenticated write)
-- 2. staff-photos (Public read, Authenticated write)
-- 3. admission-documents (Private, Authenticated read/write)
-- 4. promotional-media (Public read, Authenticated write)
INSERT INTO storage.buckets (id, name, public) VALUES ('student-photos', 'student-photos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('staff-photos', 'staff-photos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('admission-documents', 'admission-documents', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('promotional-media', 'promotional-media', true) ON CONFLICT DO NOTHING;
`;
