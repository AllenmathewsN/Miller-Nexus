import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { to } = await req.json();
    
    await sendEmail(
      to,
      'SMTP Test - Miller Nexus',
      '<h1>Success!</h1><p>SMTP is working correctly.</p>'
    );

    return NextResponse.json({ success: true, message: 'Email sent' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
