import React from "react";
import { Copy } from "lucide-react";

const QuoteDisplay = ({ quote, onCopy }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg mx-auto">
      <p className="text-lg font-semibold text-gray-900 italic text-center">
        {quote}
      </p>
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
