import { TeamMember, teamMembers as defaultMembers } from '@/data/members';

const STORAGE_KEY = 'paletto_team_members';

export function getStoredMembers(): TeamMember[] {
  if (typeof window === 'undefined') {
    return defaultMembers;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultMembers;
    }
  }

  // Initialize with default members
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMembers));
  return defaultMembers;
}

export function saveMembers(members: TeamMember[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export function addMember(member: TeamMember): TeamMember[] {
  const members = getStoredMembers();
  const newMembers = [...members, member];
  saveMembers(newMembers);
  return newMembers;
}

export function updateMember(id: string, updatedMember: TeamMember): TeamMember[] {
  const members = getStoredMembers();
  const newMembers = members.map(m => m.id === id ? updatedMember : m);
  saveMembers(newMembers);
  return newMembers;
}

export function deleteMember(id: string): TeamMember[] {
  const members = getStoredMembers();
  const newMembers = members.filter(m => m.id !== id);
  saveMembers(newMembers);
  return newMembers;
}

export function getMemberById(id: string): TeamMember | undefined {
  const members = getStoredMembers();
  return members.find(m => m.id === id);
}

export function generateMemberId(name: string): string {
  const base = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const timestamp = Date.now().toString(36);
  return `${base}-${timestamp}`;
}
