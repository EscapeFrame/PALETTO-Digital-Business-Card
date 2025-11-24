import { TeamMember } from '@/lib/types';

const API_BASE = '/api';

export async function fetchMembers(): Promise<TeamMember[]> {
  const response = await fetch(`${API_BASE}/members`);
  if (!response.ok) {
    throw new Error('Failed to fetch members');
  }
  return response.json();
}

export async function fetchMember(id: string): Promise<TeamMember | null> {
  const response = await fetch(`${API_BASE}/members/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Failed to fetch member');
  }
  return response.json();
}

export async function createMember(member: Omit<TeamMember, 'id'> & { id?: string }): Promise<{ success: boolean; id: string }> {
  const response = await fetch(`${API_BASE}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member),
  });
  if (!response.ok) {
    throw new Error('Failed to create member');
  }
  return response.json();
}

export async function updateMember(id: string, member: TeamMember): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/members/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member),
  });
  if (!response.ok) {
    throw new Error('Failed to update member');
  }
  return response.json();
}

export async function deleteMember(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/members/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete member');
  }
  return response.json();
}

export async function login(password: string): Promise<{ success: boolean; token?: string }> {
  const response = await fetch(`${API_BASE}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (response.status === 401) {
    return { success: false };
  }
  if (!response.ok) {
    throw new Error('Authentication failed');
  }
  return response.json();
}
