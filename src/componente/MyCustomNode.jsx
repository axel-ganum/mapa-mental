import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import useMapStore from '../hooks/useMapStore';
import NodeContent from './NodeContent';

const MyCustomNode = ({ id, data }) => {
  const [hovered, setHovered] = useState(false);
  const updateNodeData = useMapStore((state) => state.updateNodeData);
  const removeNode = useMapStore((state) => state.removeNode);

  useEffect(() => {
    let timeoutRef;
    if (hovered) {
      timeoutRef = setTimeout(() => {
        setHovered(false);
      }, 3000);
    }
    return () => clearTimeout(timeoutRef);
  }, [hovered]);

  const handleTextChange = (val) => {
    updateNodeData(id, { content: val });
    if (data.onEdit) {
      data.onEdit(id, val);
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative z-10">
        <NodeContent
          text={data.content || ''}
          onChange={handleTextChange}
          onRemoveNode={() => removeNode(id)}
        />

        <Handle
          type="target"
          position={Position.Left}
          className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-500 transition-colors"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-500 transition-colors"
        />
        <Handle
          type="source"
          position={Position.Top}
          className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-500 transition-colors"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-slate-400 !w-3 !h-3 !border-2 !border-white hover:!bg-blue-500 transition-colors"
        />
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-xl pointer-events-none z-20"
          >
            Doble clic en un nodo para agregar uno nuevo conectado
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 -m-1 border-2 border-blue-400/0 group-hover:border-blue-400/30 rounded-2xl transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default MyCustomNode;
