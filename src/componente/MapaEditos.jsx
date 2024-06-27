import React, { useState } from 'react';
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import 'tailwindcss/tailwind.css';
import NodeContent from './NodeContent';
import MyCustomNode from './MyCustomNode';

const nodeType = {
  custom: MyCustomNode
}
// Componente principal del mapa mental
const MapaEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  // Función para agregar un nuevo nodo
  const addNode = (position = { x: 0, y: 0 }) => {
    const newNodeId = `${nodeIdCounter}`;
    const newNode = {
      id: newNodeId,
      type: 'custom',
      data: {
        label: (
          <NodeContent
            text={`Nuevo Nodo ${nodeIdCounter}`}
            onRemoveNode={() => removeNode(newNodeId)}
          />
        ),
      },
      position: position || { x: Math.random() * 500, y: Math.random() * 300 },
      style: { borderRadius: '12px', padding: '10px' },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((id) => id + 1);
  };

  // Función para eliminar un nodo
  const removeNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  // Función para manejar nuevas conexiones
  const onConnect = (params) =>
    setEdges((eds) => addEdge({ ...params, style: { strokeWidth: 2 } }, eds));

  // Función para eliminar nodos y bordes
  const onElementsRemove = (elementsToRemove) => {
    const nodesToRemove = elementsToRemove.filter((el) => el.id && el.type);
    const edgesToRemove = elementsToRemove.filter((el) => el.id && el.source && el.target);

    setNodes((nds) => nds.filter((node) => !nodesToRemove.includes(node)));
    setEdges((eds) => eds.filter((edge) => !edgesToRemove.includes(edge)));
  };

  // Función para manejar doble clic en un nodo
  const onNodeDoubleClick = (event, node) => {
    addNode({ x: node.position.x + 200, y: node.position.y });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <button
        onClick={() => addNode({ x: Math.random() * 500, y: Math.random() * 300 })}
        className="p-2 m-2 text-white bg-blue-500 rounded shadow self-start"
      >
        Agregar Nodo
      </button>
      <div className="flex-grow overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onElementsRemove}
          onEdgesDelete={onElementsRemove}
          deleteKeyCode={46} /* 'Delete' key */
          onNodeDoubleClick={onNodeDoubleClick}
          snapToGrid={true}
          snapGrid={[15, 15]}
          nodeTypes={nodeType}
          style={{ width: '100%', height: '100%' }}
        >
          <Controls className="top-0" />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default MapaEditor;





