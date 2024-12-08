emoji-inspiration-generator/
│
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ └── generate/
│ │ │ └── route.js # API route to handle quote generation
│ │ ├── page.js # Main UI page where users interact
│ │ └── globals.css # Tailwind CSS imports
│ │
│ └── components/
EmojiSelector.js
│ └── QuoteDisplay.js # Component for displaying the quote and copy button
│
├── .env.local # API key for Google Gemini API
├── package.json # Project dependencies
└── tailwind.config.js # Tailwind CSS configuration

import React from 'react';

const EmojiSelector = ({ onEmojiSelect }) => {
const emojiMap = {
'😊': 'happy',
'😢': 'sad',
'😡': 'angry',
'😍': 'love',
'🤔': 'thinking',
'😱': 'scream',
};

return (

<div className="flex justify-center space-x-4 mb-6">
{Object.keys(emojiMap).map((emoji) => (
<button
key={emoji}
onClick={() => onEmojiSelect(emojiMap[emoji])}
className="text-4xl hover:scale-110 transition-transform" >
{emoji}
</button>
))}
</div>
);
};

export default EmojiSelector;

##end of EmojiSelector##

import React from 'react';
import { Copy } from 'lucide-react';

const QuoteDisplay = ({ quote, onCopy }) => {
return (

<div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg mx-auto">
<p className="text-lg font-semibold text-gray-900 italic text-center">{quote}</p>
<button 
        onClick={onCopy}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors"
        aria-label="Copy quote"
      >
<Copy size={20} />
</button>
</div>
);
};

export default QuoteDisplay;

##code display

'use client'; // Ensure client-side rendering

import EmojiSelector from '@/components/EmojiSelector';
import QuoteDisplay from '@/components/QuoteDisplay';
import React, { useState } from 'react';
export default function Home() {
const [quote, setQuote] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const generateQuote = async (emoji) => {
console.log('Generating quote for emoji:', emoji); // Explicit logging

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching quote from API'); // Logging before fetch

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emoji })
      });

      console.log('Fetch response:', response); // Log entire response

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('API Error Response:', errorBody);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }

      const data = await response.json();
      console.log('Received data:', data); // Log received data

      // Ensure only the quote text is set
      setQuote(data.quote || 'No quote generated');
    } catch (err) {
      console.error('FULL Quote generation error:', err);
      setError(err.message);
      setQuote('');
    } finally {
      setLoading(false);
    }

};

const copyToClipboard = () => {
navigator.clipboard.writeText(quote);
};

return (

<main className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center p-4">
<div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
<h1 className="text-2xl font-bold mb-6 text-center">
Emoji Quote Generator
</h1>

        <EmojiSelector onEmojiSelect={generateQuote} />

        {loading && <div className="text-center text-gray-500">Generating quote...</div>}

        {error && (
          <div className="text-red-500 text-center mb-4">
            Error: {error}
          </div>
        )}

        {quote && (
          <QuoteDisplay quote={quote} onCopy={copyToClipboard} />
        )}
      </div>
    </main>

);
}

##end of page.js ##

import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the API key from your environment variables
const GEMINI_API_KEY = process.env.GEMINI_KEY;
console.log("Gemini API Key:", GEMINI_API_KEY);

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
