import React from 'react';

const QuickReplies = ({ replies, onReplyClick }) => {
  if (!replies || replies.length === 0) return null;
  
  return (
    <div className="quick-replies">
      {replies.map((reply, index) => (
        <button
          key={index}
          className="quick-reply-btn"
          onClick={() => onReplyClick(reply)}
        >
          {reply}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;