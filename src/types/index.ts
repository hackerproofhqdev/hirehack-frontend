export interface ParsedResume {
  name: string;
  summary: string;
  email: string;
  phone_no: string;
  address: string;
  linkedin_profile: string;
  github_profile: string;
  website: string;
  experiences: {
    company_name: string;
    role: string;
    bulletin: string[];
  }[];
  projects: {
    name: string;
    roles: string[];
  }[];
  education: string[];
  certifications: string[];
  awards: string[];
  skills: string[];
} 