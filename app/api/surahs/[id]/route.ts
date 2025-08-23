import { NextResponse } from 'next/server';
import { redis, db } from '@/lib/db';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
  ) {
    const { id } = await context.params;
    const cacheKey = `quran:surah-${id}`;

  try {
    const exists = await redis.exists(cacheKey);
    if (exists) {
      const cachedSurah = await redis.get(cacheKey);
      return NextResponse.json(JSON.parse(cachedSurah as string));
    }

    const surah = db.query('SELECT * FROM surahs WHERE id = ?').get(id);
    if (!surah) {
      return NextResponse.json(
        { error: 'Surah not found' },
        { status: 404 }
      );
    }

    const ayahs = db.query('SELECT * FROM ayahs WHERE surah_id = ? ORDER BY ayah_number').all(id);
    if (!ayahs || ayahs.length === 0) {
      return NextResponse.json({ ...surah, ayahs: [] });
    }

    const ayahIds = (ayahs as {id: number}[]).map(a => a.id);

    const translations = db.query(`SELECT * FROM translations WHERE ayah_id IN (${ayahIds.join(',')})`).all();
    const tafsirs = db.query(`SELECT * FROM tafsirs WHERE ayah_id IN (${ayahIds.join(',')})`).all();

    const translationsMap = (translations as any[]).reduce((acc, t) => {
        if (!acc[t.ayah_id]) acc[t.ayah_id] = [];
        acc[t.ayah_id].push({ language: t.language, text: t.text });
        return acc;
    }, {});

    const tafsirsMap = (tafsirs as any[]).reduce((acc, t) => {
        if (!acc[t.ayah_id]) acc[t.ayah_id] = [];
        acc[t.ayah_id].push({ source: t.source, text: t.text });
        return acc;
    }, {});

    const ayahsWithDetails = (ayahs as any[]).map(ayah => ({
        ...ayah,
        translations: translationsMap[ayah.id] || [],
        tafsirs: tafsirsMap[ayah.id] || [],
    }));

    const result = { ...surah, ayahs: ayahsWithDetails };

    await redis.set(cacheKey, JSON.stringify(result));

    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error fetching surah ${id}:`, error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}