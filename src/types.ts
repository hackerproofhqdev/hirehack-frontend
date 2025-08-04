export interface JobDescModel {
  job_title: string
  job_desc: string
}

export interface Skills {
  skill_name: string;
  description: string;
}

interface PastExperience {
  postion: string;
  performed_for?: string;
  roles?: string[];
  start_date: string;
  end_date: string;
}

export interface Contact {
  phone_number: string;
  email: string;
}

export interface Education {
  degree: string;
  completed_at: string;
  platform_name: string;
}

export interface Certification {
  name: string;
  date: string;
}

export interface Projects {
  project_name: string;
  description: string;
  company_name : string;
}

export interface Awards {
  title: string;
  date: string;
}

export interface Resume {
  name: string;
  role: string;
  about: string;
  skills: Skills[];
  past_experience?: PastExperience[];
  education_info?: Education[];
  contact_info: Contact;
  certifications?: Certification[];
  projects: Projects[];
  awards?: Awards[];
}


export interface ResumeAIModel {
  name: string
  role: string
  about: string
  job_analysis: string
  education_desc: string
  skills_desc: string
  pastexperience_desc: string
  contact: Contact
}






export interface QuizModel {
  job_title?: string;
  job_desc?: string;
  thread_id?: string;
  delete_session: boolean;
  num_quiz: number;
}


interface QuestionModel {
  question: string; 
  answer: string; 
  options: string[];
}


interface QuizResponseModel {
  questions: QuestionModel[]; // Quiz Questions
}




export interface IThread{
  id : number;
  name : string;
  thread_id : string;
  user_id:number;
  created_at : string;
}


export interface IUser {
  email: string;
  username: string;
  id: number;
  password: string;
  plain_period : string | null;
  subscription_status : string;
}







export interface Experience {
  company_name: string;
  role: string;
  bulletin: string[];
}

export interface ProjectItem {
  name: string;
  roles: string[];
}

export interface ParsedResume {
  name: string;
  email?: string;
  phone_no?: string;
  linkedin_profile? : string;
  github_profile? : string;
  address? : string;
  website? : string;
  summary: string;
  experiences?: Experience[];
  education?: string[];
  certifications?: string[];
  awards?: string[];
  projects?: ProjectItem[];
  skills?: string[];
}

