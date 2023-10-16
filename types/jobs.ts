export interface Job {
  company: string;
  created_at: string;
  department: string;
  description: string;
  id: string;
  location: string;
  location_state: string;
  salary: string;
  salary_currency: string;
  title: string;
}

export interface Jobs {
  items: Job[];
  count: number;
  anyKey: string;
}
