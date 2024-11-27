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
 
  const clusterStyles = {
    grupoA: { backgroundColor: '#E1F5FE', borderColor: '#00A1E4' },
    grupoB: { backgroundColor: '#FFEBEE', borderColor: '#D32F2F' },
  };

  // Aplica el estilo correspondiente al grupo del nodo
  const groupStyle = clusterStyles[data.group] || { backgroundColor: '#f0f4f8', borderColor: '#e0e4e8' };
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
            ...groupStyle,
            padding: '6px 15px',
            borderRadius: '10px',
            backgroundColor: '#f0f4f8',
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            border: '1px solid #e0e4e8',
            position: 'relative',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px', // Tamaño de fuente más pequeño
            color: '#333',
            maxWidth: '180px', // Ancho aumentado del nodo
            textAlign: 'center',
            height: '25px', // Reduce la altura
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '8px 12px',
            borderRadius: '6px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            color: '#333',
            fontSize: '12px',
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









