import { NextResponse } from 'next/server';
import { isValidImdbId } from '@/lib/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imdbId = searchParams.get('imdbId');

  if (!imdbId) {
    return NextResponse.json({ error: 'Missing imdbId parameter' }, { status: 400 });
  }

  // Basic validation for IMDb ID (tt followed by 7 or 8 digits)
  if (!isValidImdbId(imdbId)) {
    return NextResponse.json({ error: 'Invalid IMDb ID format' }, { status: 400 });
  }

  const apiKey = process.env.OMDB_API_KEY;
  
  if (!apiKey) {
    console.error("OMDB_API_KEY is not configured.");
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const response = await fetch(`http://www.omdbapi.com/?i=${imdbId}&plot=short&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`OMDB API responded with status: ${response.status}`);
    }
    
    const data = await response.json();

    if (data.Response === 'False') {
      return NextResponse.json({ error: data.Error || 'Movie not found' }, { status: 404 });
    }

    // Return the needed properties
    return NextResponse.json({
      title: data.Title,
      year: data.Year,
      rated: data.Rated,
      released: data.Released,
      runtime: data.Runtime,
      genre: data.Genre,
      director: data.Director,
      actors: data.Actors,
      plot: data.Plot,
      poster: data.Poster !== 'N/A' ? data.Poster : null,
      imdbRating: data.imdbRating
    });

  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json({ error: 'Failed to fetch movie details' }, { status: 500 });
  }
}
