import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { MemberRow, SkillRow, SocialRow, TeamMember } from '@/lib/types';

// GET all members
export async function GET() {
  try {
    const members = await query<MemberRow[]>(
      'SELECT * FROM members ORDER BY created_at ASC'
    );

    const skills = await query<SkillRow[]>('SELECT * FROM skills');
    const socials = await query<SocialRow[]>('SELECT * FROM social_links');

    const result: TeamMember[] = members.map((member) => ({
      id: member.id,
      name: member.name,
      nameEn: member.name_en,
      role: member.role,
      email: member.email,
      phone: member.phone,
      bio: member.bio,
      avatar: member.avatar,
      gradientFrom: member.gradient_from,
      gradientTo: member.gradient_to,
      skills: skills
        .filter((s) => s.member_id === member.id)
        .map((s) => s.skill_name),
      social: socials
        .filter((s) => s.member_id === member.id)
        .reduce((acc, s) => ({ ...acc, [s.platform]: s.url }), {}),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

// POST create new member
export async function POST(request: NextRequest) {
  try {
    const body: TeamMember = await request.json();

    // Generate ID if not provided
    const id = body.id || generateMemberId(body.name);

    // Insert member
    await query(
      `INSERT INTO members (id, name, name_en, role, email, phone, bio, avatar, gradient_from, gradient_to)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        body.name,
        body.nameEn,
        body.role,
        body.email,
        body.phone,
        body.bio,
        body.avatar,
        body.gradientFrom,
        body.gradientTo,
      ]
    );

    // Insert skills
    if (body.skills && body.skills.length > 0) {
      for (const skill of body.skills) {
        await query(
          'INSERT INTO skills (member_id, skill_name) VALUES (?, ?)',
          [id, skill]
        );
      }
    }

    // Insert social links
    if (body.social) {
      const platforms = ['github', 'linkedin', 'twitter', 'instagram'] as const;
      for (const platform of platforms) {
        if (body.social[platform]) {
          await query(
            'INSERT INTO social_links (member_id, platform, url) VALUES (?, ?, ?)',
            [id, platform, body.social[platform]]
          );
        }
      }
    }

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}

function generateMemberId(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-가-힣]/g, '');
  const timestamp = Date.now().toString(36);
  return `${base}-${timestamp}`;
}
