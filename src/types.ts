export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'citizen' | 'admin';
  created_at: string;
}

export interface Complaint {
  id: number;
  complaint_id: string;
  user_id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  image_path: string | null;
  status: 'Pending' | 'In Progress' | 'Resolved';
  remarks: string | null;
  created_at: string;
  citizen_name?: string;
}

export const CATEGORIES = [
  "Road Damage",
  "Drinking Water Problem",
  "Garbage Collection",
  "Street Light Issue",
  "Drainage Problem",
  "Other"
];
