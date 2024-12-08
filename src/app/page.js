"use client"; // Ensure client-side rendering

import EmojiSelector from "@/components/EmojiSelector";
import QuoteDisplay from "@/components/QuoteDisplay";
import React, { useState } from "react";
export default function Home() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQuote = async (emoji) => {
    console.log("Generating quote for emoji:", emoji); // Explicit logging

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching quote from API"); // Logging before fetch

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emoji }),
      });

      console.log("Fetch response:", response); // Log entire response

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error Response:", errorBody);
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorBody}`
        );
      }

      const data = await response.json();
      console.log("Received data:", data); // Log received data

      // Ensure only the quote text is set
      setQuote(data.quote || "No quote generated");
    } catch (err) {
      console.error("FULL Quote generation error:", err);
      setError(err.message);
      setQuote("");
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

        {loading && (
          <div className="text-center text-gray-500">Generating quote...</div>
        )}

        {error && (
          <div className="text-red-500 text-center mb-4">Error: {error}</div>
        )}

        {quote && <QuoteDisplay quote={quote} onCopy={copyToClipboard} />}
      </div>
    </main>
  );
}
