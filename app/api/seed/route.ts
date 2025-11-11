import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function POST() {
  try {
    const result = await seedDatabase();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Database seeded successfully',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to seed database',
          details: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed database',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
