export interface TeamMember {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
  skills: string[];
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  avatar: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface MemberRow {
  id: string;
  name: string;
  name_en: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  gradient_from: string;
  gradient_to: string;
}

export interface SkillRow {
  member_id: string;
  skill_name: string;
}

export interface SocialRow {
  member_id: string;
  platform: 'github' | 'linkedin' | 'twitter' | 'instagram';
  url: string;
}
