import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { MemberRow, SkillRow, SocialRow, TeamMember } from '@/lib/types';

// GET single member
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const members = await query<MemberRow[]>(
      'SELECT * FROM members WHERE id = ?',
      [params.id]
    );

    if (members.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const member = members[0];
    const skills = await query<SkillRow[]>(
      'SELECT * FROM skills WHERE member_id = ?',
      [params.id]
    );
    const socials = await query<SocialRow[]>(
      'SELECT * FROM social_links WHERE member_id = ?',
      [params.id]
    );

    const result: TeamMember = {
      id: member.id,
      name: member.name,
      nameEn: member.name_en,
      role: member.role,
      department: member.department,
      email: member.email,
      phone: member.phone,
      bio: member.bio,
      avatar: member.avatar,
      gradientFrom: member.gradient_from,
      gradientTo: member.gradient_to,
      skills: skills.map((s) => s.skill_name),
      social: socials.reduce(
        (acc, s) => ({ ...acc, [s.platform]: s.url }),
        {}
      ),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    );
  }
}

// PUT update member
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: TeamMember = await request.json();

    // Update member
    await query(
      `UPDATE members
       SET name = ?, name_en = ?, role = ?, department = ?, email = ?, phone = ?, bio = ?, avatar = ?, gradient_from = ?, gradient_to = ?
       WHERE id = ?`,
      [
        body.name,
        body.nameEn,
        body.role,
        body.department,
        body.email,
        body.phone,
        body.bio,
        body.avatar,
        body.gradientFrom,
        body.gradientTo,
        params.id,
      ]
    );

    // Delete and re-insert skills
    await query('DELETE FROM skills WHERE member_id = ?', [params.id]);
    if (body.skills && body.skills.length > 0) {
      for (const skill of body.skills) {
        await query(
          'INSERT INTO skills (member_id, skill_name) VALUES (?, ?)',
          [params.id, skill]
        );
      }
    }

    // Delete and re-insert social links
    await query('DELETE FROM social_links WHERE member_id = ?', [params.id]);
    if (body.social) {
      const platforms = ['github', 'linkedin', 'twitter', 'instagram'] as const;
      for (const platform of platforms) {
        if (body.social[platform]) {
          await query(
            'INSERT INTO social_links (member_id, platform, url) VALUES (?, ?, ?)',
            [params.id, platform, body.social[platform]]
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
}

// DELETE member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM members WHERE id = ?', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
