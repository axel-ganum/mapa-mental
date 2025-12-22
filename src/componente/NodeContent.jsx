import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const NodeContent = ({ text, onChange, onRemoveNode }) => {
  const textareaRef = useRef(null);

  const handleTextareaChange = (e) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    if (onChange) {
      onChange(e.target.value);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="relative p-0 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] min-w-[180px] group overflow-hidden transition-all duration-300"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity" />

      <div className="p-4">
        <textarea
          placeholder='Escribe algo brillante...'
          ref={textareaRef}
          className="w-full p-0 bg-transparent border-none resize-none focus:outline-none overflow-hidden text-slate-700 font-semibold text-base leading-relaxed placeholder:text-slate-300 placeholder:italic"
          defaultValue={text}
          onChange={handleTextareaChange}
          rows={1}
        />
      </div>

      <button
        onClick={onRemoveNode}
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-white/80 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full border border-slate-100 hover:border-rose-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 active:scale-95"
        title="Eliminar nodo"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Decorative subtle border for depth */}
      <div className="absolute inset-0 border border-white/40 rounded-2xl pointer-events-none" />
    </motion.div>
  );
};

export default NodeContent;



