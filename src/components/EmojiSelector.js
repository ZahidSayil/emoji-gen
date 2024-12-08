import React from "react";

const EmojiSelector = ({ onEmojiSelect }) => {
  const emojiMap = {
    "😊": "happy",
    "😢": "sad",
    "😡": "angry",
    "😍": "love",
    "🤔": "thinking",
    "😱": "scream",
  };

  return (
    <div className="flex justify-center space-x-4 mb-6">
      {Object.keys(emojiMap).map((emoji) => (
        <button
          key={emoji}
          onClick={() => onEmojiSelect(emojiMap[emoji])}
          className="text-4xl hover:scale-110 transition-transform"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiSelector;
