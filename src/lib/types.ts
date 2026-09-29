export type ComplaintStatus =
  | "new"
  | "acknowledged"
  | "in_progress"
  | "resolved"
  | "rejected";

export interface Complaint {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string | null;
  category: string;
  location: string;
  description: string;
  status: ComplaintStatus;
  initiative: string | null;
  handled_by: string | null;
}

export interface AdminEmail {
  id: string;
  email: string;
  created_at: string;
}

/**
 * Public-safe representation of a complaint. Never includes complainant PII
 * (name, email, phone) — these are only visible to authorized admins.
 */
export interface PublicComplaint {
  id: string;
  created_at: string;
  updated_at: string;
  category: string;
  location: string;
  description: string;
  status: ComplaintStatus;
  initiative: string | null;
  handled_by: string | null;
}

export const COMPLAINT_CATEGORIES = [
  "Roads & Pavements",
  "Water Supply",
  "Electricity",
  "Sanitation & Drainage",
  "Street Lighting",
  "Public Transport",
  "Waste Management",
  "Other",
] as const;

export const COMPLAINT_STATUSES: ComplaintStatus[] = [
  "new",
  "acknowledged",
  "in_progress",
  "resolved",
  "rejected",
];
