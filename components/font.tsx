import { Amiri_Quran } from 'next/font/google';
import localFont from 'next/font/local';

export const amiriQuran = Amiri_Quran({
    weight: '400',
    subsets: ['arabic'],
});

export const font_ayat = localFont({
    src: '../public/font/4.woff2',
    display: 'swap',
    weight: '400',
});

export const font1 = localFont({
    src: '../public/font/1.woff2',
    display: 'swap',
    weight: '400',
});

export const font2 = localFont({
    src: '../public/font/2.woff2',
    display: 'swap',
    weight: '400',
});

export const font3 = localFont({
    src: '../public/font/3.woff2',
    display: 'swap',
    weight: '400',
});



export const font5 = localFont({
    src: '../public/font/1.woff2',
    display: 'swap',
    weight: '400',
});

export const fontsurah = localFont({
    src: '../public/font/surah.woff2',
    display: 'swap',
    weight: '400',
});