import { NextResponse } from 'next/server';
import { redis, db } from '@/lib/db';

export async function GET() {
  const cacheKey = 'quran:all-surahs';
  try {
    const cachedSurahs = await redis.get(cacheKey);
    if (cachedSurahs) {
      return NextResponse.json(JSON.parse(cachedSurahs));
    }

    const { rows } = await db.execute({
        sql: 'SELECT * FROM surahs ORDER BY id',
    });
    // Set cache dengan expiry time, contoh: 1 hari (86400 detik)
    await redis.set(cacheKey, JSON.stringify(rows), {
        EX: 86400,
        NX: true,
    }); 

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching all surahs:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}