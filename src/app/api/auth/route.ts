import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

interface SettingRow {
  setting_value: string;
}

// POST login
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // First try to get password from database
    let isValid = false;

    try {
      const settings = await query<SettingRow[]>(
        'SELECT setting_value FROM admin_settings WHERE setting_key = ?',
        ['admin_password_hash']
      );

      if (settings.length > 0) {
        isValid = await bcrypt.compare(password, settings[0].setting_value);
      }
    } catch {
      // Database not available, fallback to env variable
      const envPassword = process.env.ADMIN_PASSWORD || 'paletto2024';
      isValid = password === envPassword;
    }

    // Fallback: check against default password
    if (!isValid) {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'paletto2024';
      isValid = password === defaultPassword;
    }

    if (isValid) {
      // Generate a simple token (in production, use JWT)
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// PUT update password
export async function PUT(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();

    // Verify current password first
    const defaultPassword = process.env.ADMIN_PASSWORD || 'paletto2024';

    let isValid = currentPassword === defaultPassword;

    if (!isValid) {
      try {
        const settings = await query<SettingRow[]>(
          'SELECT setting_value FROM admin_settings WHERE setting_key = ?',
          ['admin_password_hash']
        );

        if (settings.length > 0) {
          isValid = await bcrypt.compare(currentPassword, settings[0].setting_value);
        }
      } catch {
        // Database not available
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash and save new password
    const hash = await bcrypt.hash(newPassword, 10);

    try {
      await query(
        `INSERT INTO admin_settings (setting_key, setting_value)
         VALUES ('admin_password_hash', ?)
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [hash, hash]
      );
    } catch {
      return NextResponse.json(
        { error: 'Failed to update password in database' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}
