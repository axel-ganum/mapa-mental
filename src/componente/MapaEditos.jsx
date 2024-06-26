import React, { useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import 'tailwindcss/tailwind.css';

const NodeContent = ({ text, onChange, onAddNode, onRemoveNode, selected }) => {
  return (
    <div className={`relative p-4 rounded-lg ${selected ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <textarea
        className={`w-full h-full p-2 text-center resize-none ${selected ? 'bg-white' : 'bg-transparent'} focus:outline-none`}
        placeholder="Escribe algo"
        defaultValue={text}
        onChange={onChange}
        disabled={!selected}
      />
      {selected && (
        <>
          <button
            onClick={onAddNode}
            className="absolute p-2 text-white bg-blue-500 rounded-full shadow bottom-2 -right-10"
          >
            +
          </button>
          <button
            onClick={onRemoveNode}
            className="absolute p-2 text-white bg-red-500 rounded-full shadow bottom-2 -left-10"
          >
            -
          </button>
        </>
      )}
    </div>
  );
};

const MapaEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const addNode = (position = { x: 0, y: 0 }, parentNodeId = null) => {
    const newNodeId = `${nodeIdCounter}`;
    const newNode = {
      id: newNodeId,
      type: 'default',
      data: {
        label: (
          <NodeContent
            text={newNodeId === '1' ? 'Idea principal' : ''}
            onAddNode={() => addNode({ x: position.x + 200, y: position.y }, newNodeId)}
            onRemoveNode={() => removeNode(newNodeId)}
            selected={selectedNodeId === newNodeId}
          />
        ),
      },
      position: position || { x: Math.random() * 500, y: Math.random() * 300 },
      style: {
        borderRadius: newNodeId === '1' ? '50px' : '0px',
        padding: '10px',
        backgroundColor: 'transparent',
        border: '2px solid transparent',
      },
    };

    setNodes((nds) => [...nds, newNode]);
    if (parentNodeId) {
      setEdges((eds) => addEdge({ id: `${parentNodeId}-${newNodeId}`, source: parentNodeId, target: newNodeId }, eds));
    }
    setNodeIdCounter((id) => id + 1);
  };

  const removeNode = (nodeId) => {
    if (nodeId === '1') return; // Prevent deletion of the main idea node
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const onConnect = (params) =>
    setEdges((eds) => addEdge({ ...params, type: 'smoothstep', style: { strokeWidth: 2, stroke: '#333' } }, eds));

  const onElementsRemove = (elementsToRemove) => {
    const nodesToRemove = elementsToRemove.filter((el) => el.id && el.type && el.id !== '1');
    const edgesToRemove = elementsToRemove.filter((el) => el.id && el.source && el.target);

    setNodes((nds) => nds.filter((node) => !nodesToRemove.includes(node)));
    setEdges((eds) => eds.filter((edge) => !edgesToRemove.includes(edge)));
  };

  const onNodeDoubleClick = (event, node) => {
    addNode({ x: node.position.x + 200, y: node.position.y }, node.id);
  };

  const onNodeClick = (event, node) => {
    setSelectedNodeId(node.id);
  };

  useEffect(() => {
    if (nodes.length === 0) {
      addNode({ x: 250, y: 150 });
      setTimeout(() => {
        addNode({ x: 100, y: 300 }, '1');
        addNode({ x: 250, y: 300 }, '1');
        addNode({ x: 400, y: 300 }, '1');
      }, 100);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodesDelete={onElementsRemove}
          onEdgesDelete={onElementsRemove}
          deleteKeyCode={46} /* 'Delete' key */
          onNodeDoubleClick={onNodeDoubleClick}
          snapToGrid={true}
          snapGrid={[15, 15]}
          style={{ width: '100%', height: '100%' }}
        >
          <Controls className="top-0" />
          <MiniMap className="top-0" />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default MapaEditor;




