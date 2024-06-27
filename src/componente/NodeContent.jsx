import React from 'react';

const NodeContent = ({ text, onChange, onRemoveNode }) => {
  return (
    <div className="relative p-4 bg-white border border-gray-300 rounded-lg shadow-md min-w-full min-h-full">
      <textarea
        className="w-full h-full p-2 border-none resize-none focus:outline-none"
        defaultValue={text}
        onChange={onChange}
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


