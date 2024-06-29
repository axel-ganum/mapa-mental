import React, { useRef, useEffect } from 'react';

const NodeContent = ({ text, onChange, onRemoveNode }) => {
  const textareaRef = useRef(null);

  const handleTextareaChange = (e) => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    onChange(e);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [text]);

  return (
    <div className="relative p-4 bg-white border border-gray-300 rounded-lg shadow-md">
      <textarea
        ref={textareaRef}
        className="w-full p-2 border-none resize-none focus:outline-none overflow-hidden"
        defaultValue={text}
        onChange={handleTextareaChange}
        style={{ height: 'auto' }}
      />
      <button
        onClick={onRemoveNode}
        className="absolute top-0 right-0 mt-1 mr-1 text-2xl p-1 transform translate-x-1 -translate-y-1 text-gray-700 hover:text-red-500"
      >
        x
      </button>
    </div>
  );
};

export default NodeContent;



