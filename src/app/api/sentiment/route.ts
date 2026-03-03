import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { reviews, title } = await request.json();
    
    if (!reviews || !Array.isArray(reviews)) {
      return NextResponse.json({ error: 'Missing or invalid reviews data' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from environment variables.");
      return NextResponse.json({ error: 'Sentiment analysis unavailable (missing server config)' }, { status: 500 });
    }

    if (reviews.length === 0) {
       return NextResponse.json({ 
         summary: 'Not enough audience reviews available to gauge sentiment.', 
         classification: 'Mixed' 
       });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Ensure we don't blow up the prompt size, limiting to ~15 reviews
    const truncatedReviews = reviews.slice(0, 15).join('\n---\n');

    const prompt = `Analyze the following audience reviews for the movie "${title || 'Unknown'}". 
1. Provide a concise, engaging 3-sentence summary of the overall audience sentiment. Do not just summarize the plot. Focus on what people liked or hated.
2. Classify the overall sentiment rigidly as exactly one of the following words: "Positive", "Mixed", or "Negative".

Return the response STRICTLY as a JSON object with the keys "summary" (string) and "classification" (string).

Reviews:
${truncatedReviews}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const result = JSON.parse(text);

    return NextResponse.json({
        summary: result.summary || 'Summary could not be generated.',
        classification: result.classification || 'Mixed',
    });

  } catch (error) {
    console.error('Gemini error:', error);
    return NextResponse.json({ error: 'Failed to process sentiment' }, { status: 500 });
  }
}
