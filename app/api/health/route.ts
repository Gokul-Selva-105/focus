import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

/**
 * Health check endpoint for monitoring application status
 * GET /api/health
 */
export async function GET() {
  try {
    // Check database connection
    const dbStatus = await checkDatabaseConnection();
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Check database connection status
 */
async function checkDatabaseConnection() {
  try {
    // Try to connect to MongoDB
    await dbConnect();
    return { connected: true, message: 'Database connection successful' };
  } catch (error) {
    console.error('Database connection failed:', error);
    return {
      connected: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}