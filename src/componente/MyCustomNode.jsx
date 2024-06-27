import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'react-flow-renderer';

const MyCustomNode = ({ data, onAddNode }) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let timeoutRef;

    if (hovered) {
      timeoutRef = setTimeout(() => {
        setHovered(false);
      }, 2000);
    }

    return () => clearTimeout(timeoutRef);
  }, [hovered]);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleDoubleClick = () => {
    setHovered(false); // Asegura que el mensaje se oculte al agregar un nodo
    onAddNode();
  };

  return (
    <>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            padding: '10px',
            borderRadius: '12px',
            backgroundColor: '#fff',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            position: 'relative',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onDoubleClick={handleDoubleClick}
        >
          {data.label}
          <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
          <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
        </div>
      </div>

      {hovered && (
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '8px',
            borderRadius: '4px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            zIndex: 10,
          }}
        >
          Doble clic para agregar un nodo
        </div>
      )}
    </>
  );
};

export default MyCustomNode;









