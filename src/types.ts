export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  imgSeed: string;
  tags: string[];
  metrics?: string;
  details: string[];
  demoUrl?: string;
  githubUrl?: string;
  image?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: { name: string; proficiency: number }[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  detailedPoints: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarSeed: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface VisitorMessage {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  timestamp: string;
}
