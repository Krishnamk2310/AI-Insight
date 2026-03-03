import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { isValidImdbId } from '@/lib/utils';
import * as cheerio from 'cheerio';

export const maxDuration = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imdbId = searchParams.get('imdbId');

  if (!imdbId) {
    return NextResponse.json({ error: 'Missing imdbId parameter' }, { status: 400 });
  }

  if (!isValidImdbId(imdbId)) {
    return NextResponse.json({ error: 'Invalid IMDb ID format' }, { status: 400 });
  }

  let browser = null;

  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    let executablePath = '';
    if (isDevelopment) {
      executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    } else {
      executablePath = await chromium.executablePath();
    }

    browser = await puppeteer.launch({
      args: isDevelopment ? [] : chromium.args,
      defaultViewport: (chromium as any).defaultViewport || null,
      executablePath: executablePath,
      headless: isDevelopment ? true : (chromium as any).headless !== undefined ? (chromium as any).headless : true,
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    
    await page.goto(`https://www.imdb.com/title/${imdbId}/reviews?sort=helpfulnessScore&dir=desc&ratingFilter=0`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    const html = await page.content();
    let reviews: string[] = [];

    try {
      const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
      
      if (nextDataMatch && nextDataMatch[1]) {
        const nextData = JSON.parse(nextDataMatch[1]);
        const reviewItems = nextData?.props?.pageProps?.contentData?.reviews || [];
        
        reviewItems.forEach((item: any) => {
          const text = item?.review?.reviewText;
          if (text) {
            reviews.push(text.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&'));
          }
        });
      }
    } catch (parseError) {
      console.error('Error parsing __NEXT_DATA__:', parseError);
    }

    if (reviews.length === 0) {
      const $ = cheerio.load(html);
      $('.text.show-more__control').each((i, el) => {
        if (i < 15) {
          const text = $(el).text().trim();
          if (text) reviews.push(text);
        }
      });
    }

    if (reviews.length === 0) {
      return NextResponse.json({ 
        reviews: [], 
        message: 'No reviews found or unable to parse reviews.' 
      }, { status: 200 });
    }

    return NextResponse.json({
      count: reviews.length,
      reviews: reviews.slice(0, 15)
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}
