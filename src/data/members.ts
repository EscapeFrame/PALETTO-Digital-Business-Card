export interface TeamMember {
  id: string;
  name: string;
  nameEn: string;
  role: string;
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

export const teamMembers: TeamMember[] = [
  {
    id: 'kim-minjun',
    name: '김민준',
    nameEn: 'Minjun Kim',
    role: 'Team Lead & Full-Stack Developer',
    email: 'minjun@paletto.team',
    phone: '+82 10-1234-5678',
    bio: '사용자 경험을 최우선으로 생각하는 개발자입니다. 새로운 기술을 탐구하고 팀과 함께 성장하는 것을 좋아합니다.',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    avatar: '👨‍💻',
    gradientFrom: '#87CEEB',
    gradientTo: '#5DADE2',
  },
  {
    id: 'lee-suji',
    name: '이수지',
    nameEn: 'Suji Lee',
    role: 'UI/UX Designer',
    email: 'suji@paletto.team',
    phone: '+82 10-2345-6789',
    bio: '아름다움과 기능성의 조화를 추구하는 디자이너입니다. 사용자의 마음을 읽는 디자인을 만들어갑니다.',
    skills: ['Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'Prototyping'],
    social: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
    avatar: '👩‍🎨',
    gradientFrom: '#B0E0E6',
    gradientTo: '#87CEEB',
  },
  {
    id: 'park-jihoon',
    name: '박지훈',
    nameEn: 'Jihoon Park',
    role: 'Backend Developer',
    email: 'jihoon@paletto.team',
    phone: '+82 10-3456-7890',
    bio: '안정적이고 확장 가능한 시스템 구축을 목표로 합니다. 문제 해결에 열정을 가지고 있습니다.',
    skills: ['Python', 'Django', 'AWS', 'Docker', 'Kubernetes'],
    social: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
    },
    avatar: '👨‍🔧',
    gradientFrom: '#5DADE2',
    gradientTo: '#3498DB',
  },
  {
    id: 'choi-yuna',
    name: '최유나',
    nameEn: 'Yuna Choi',
    role: 'Frontend Developer',
    email: 'yuna@paletto.team',
    phone: '+82 10-4567-8901',
    bio: '인터랙티브하고 접근성 높은 웹 경험을 만드는 것을 좋아합니다. 디테일에 강합니다.',
    skills: ['Vue.js', 'React', 'CSS', 'Animation', 'Accessibility'],
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    avatar: '👩‍💻',
    gradientFrom: '#E0F4FF',
    gradientTo: '#B0E0E6',
  },
  {
    id: 'jung-dohyun',
    name: '정도현',
    nameEn: 'Dohyun Jung',
    role: 'Product Manager',
    email: 'dohyun@paletto.team',
    phone: '+82 10-5678-9012',
    bio: '사용자와 비즈니스 사이의 다리 역할을 합니다. 데이터 기반 의사결정을 지향합니다.',
    skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'Jira'],
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
    avatar: '👨‍💼',
    gradientFrom: '#87CEEB',
    gradientTo: '#B0E0E6',
  },
  {
    id: 'han-soyeon',
    name: '한소연',
    nameEn: 'Soyeon Han',
    role: 'DevOps Engineer',
    email: 'soyeon@paletto.team',
    phone: '+82 10-6789-0123',
    bio: '효율적인 개발 환경과 안정적인 서비스 운영을 위해 노력합니다. 자동화의 힘을 믿습니다.',
    skills: ['CI/CD', 'Terraform', 'Monitoring', 'Linux', 'Cloud Architecture'],
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    avatar: '👩‍🔬',
    gradientFrom: '#B0E0E6',
    gradientTo: '#5DADE2',
  },
];

export function getMemberById(id: string): TeamMember | undefined {
  return teamMembers.find(member => member.id === id);
}
