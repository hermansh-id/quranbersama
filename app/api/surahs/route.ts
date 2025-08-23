import { NextResponse } from 'next/server';
import { redis, db } from '@/lib/db';

export async function GET() {
  const cacheKey = 'quran:all-surahs';
  try {
    const cachedSurahs = await redis.get(cacheKey);
    if (cachedSurahs) {
      return NextResponse.json(JSON.parse(cachedSurahs));
    }

    const surahs = db.query('SELECT * FROM surahs ORDER BY id').all();
    // Set cache dengan expiry time, contoh: 1 hari (86400 detik)
    await redis.set(cacheKey, JSON.stringify(surahs), 'EX', 86400); 

    return NextResponse.json(surahs);
  } catch (error) {
    console.error('Error fetching all surahs:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}