import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { contactLogger } from '@/lib/contact-logger';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const submissions = contactLogger.getRecentSubmissions(limit);

    return NextResponse.json({
      success: true,
      submissions,
      count: submissions.length,
      message: 'Recent contact submissions from memory'
    });

  } catch (error) {
    console.error('Error fetching contact logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact logs' },
      { status: 500 }
    );
  }
}
