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
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative p-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg min-w-[150px] group"
    >
      <textarea
        placeholder='Escribe aquí...'
        ref={textareaRef}
        className="w-full p-2 bg-transparent border-none resize-none focus:outline-none overflow-hidden text-slate-700 font-medium text-sm leading-tight placeholder:text-slate-400"
        defaultValue={text}
        onChange={handleTextareaChange}
        rows={1}
      />
      <button
        onClick={onRemoveNode}
        className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
        title="Eliminar nodo"
      >
        <span className="text-xs font-bold mt-[-2px]">×</span>
      </button>
    </motion.div>
  );
};

export default NodeContent;



