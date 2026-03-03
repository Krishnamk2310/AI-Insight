import { NextResponse } from 'next/server';
import { isValidImdbId } from '@/lib/utils';
import * as cheerio from 'cheerio';

export const maxDuration = 30;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imdbId = searchParams.get('imdbId');

  if (!imdbId) {
    return NextResponse.json({ error: 'Missing imdbId parameter' }, { status: 400 });
  }

  if (!isValidImdbId(imdbId)) {
    return NextResponse.json({ error: 'Invalid IMDb ID format' }, { status: 400 });
  }

  try {
    const url = `https://www.imdb.com/title/${imdbId}/reviews?sort=helpfulnessScore&dir=desc&ratingFilter=0`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!res.ok) {
      console.error(`IMDb returned status ${res.status}`);
      return NextResponse.json({ error: 'Failed to fetch reviews from IMDb' }, { status: 502 });
    }

    const html = await res.text();
    let reviews: string[] = [];

    // Method 1: Try parsing the __NEXT_DATA__ JSON blob
    try {
      const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

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

    // Method 2: Fall back to Cheerio DOM parsing
    if (reviews.length === 0) {
      const $ = cheerio.load(html);
      $('.text.show-more__control').each((i, el) => {
        if (i < 15) {
          const text = $(el).text().trim();
          if (text) reviews.push(text);
        }
      });
    }

    // Method 3: Try alternative selectors
    if (reviews.length === 0) {
      const $ = cheerio.load(html);
      $('[data-testid="review-overflow"]').each((i, el) => {
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
  }
}

