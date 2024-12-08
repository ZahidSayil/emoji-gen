import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the API key from your environment variables
const GEMINI_API_KEY = process.env.GEMINI_KEY;

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate a quote using Gemini
async function query(emoji) {
  try {
    const prompt = `Write a meaningful quote inspired by the emoji: ${emoji}`;

    // Generate content from the Gemini model
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return response;
  } catch (error) {
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

// API Route Handler
export async function POST(request) {
  console.log("API Route: Generate Quote Called");

  try {
    const requestBody = await request.json();
    console.log("Received Request Body:", requestBody);

    const { emoji } = requestBody;
    console.log("Generating quote for emoji:", emoji);

    // Get the quote from Gemini API
    const rawQuote = await query(emoji);
    console.log("Gemini Response:", rawQuote);

    return Response.json({ quote: rawQuote });
  } catch (error) {
    console.error("FULL API error:", error);
    return Response.json(
      { message: "Error generating quote", details: error.message },
      { status: 500 }
    );
  }
}
