/** Admin lead / CRM domain types (BDALMS /api/admins/leads). */

/** Short level codes — distinct from the user-facing "O Level" / "A Level". */
export type LeadLevel = 'O' | 'A';
export type LeadSource = 'contact_form' | 'manual';
export type LeadStatus = 'lead' | 'applied' | 'enrolled' | 'active' | 'alumni';
export type LeadGender = 'male' | 'female' | 'other';

export interface LeadParent {
  name: string;
  phone: string;
  email: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: LeadLevel | null;
  source: LeadSource;
  status: LeadStatus;
  student_id: string | null;
  parent: LeadParent | null;
  goal: string | null;
  gender: LeadGender | null;
  dob: string | null;
  country: string | null;
  admission_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Global per-status breakdown — ignores search / status filters. */
export interface LeadAnalytics {
  total: number;
  lead: number;
  applied: number;
  enrolled: number;
  active: number;
  alumni: number;
}

/** Paginated list payload. Note: not the generic PaginatedResponse shape. */
export interface PaginatedLeadResponse {
  total: number;
  page: number;
  page_size: number;
  results: Lead[];
  analytics: LeadAnalytics;
}

export interface LeadCreateRequest {
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  level?: LeadLevel | null;
  parent?: LeadParent | null;
  goal?: string | null;
  gender?: LeadGender | null;
  dob?: string | null;
  country?: string | null;
  notes?: string | null;
}

/** PATCH body — all fields optional; only sent fields are written (exclude_none). */
export interface LeadUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  level?: LeadLevel;
  status?: LeadStatus;
  parent?: LeadParent;
  goal?: string;
  gender?: LeadGender;
  dob?: string;
  country?: string;
  admission_date?: string;
  notes?: string;
}

export interface LeadsQuery {
  page?: number;
  page_size?: number;
  search?: string;
  status?: LeadStatus;
}

/** UI filter selection — a specific stage or "all". */
export type LeadStatusFilter = 'all' | LeadStatus;

/** Pipeline-stage metadata for a lead status (label, copy, colour). */
export interface LeadStage {
  id: LeadStatus;
  label: string;
  desc: string;
  color: string;
}

/** Enroll response — generated_password is plaintext, shown once only. */
export interface LeadEnrollResponse {
  lead: Lead;
  generated_password: string;
}
