 import React, { useState, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodes,
  useEdges,
  Controls,
  Background,
} from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import { v4 as uuidv4 } from 'uuid';

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Idea principal', onRemove: () => {}, onAdd: () => {}, onEdit: () => {} },
    position: { x: 250, y: 5 },
  },
];

const initialEdges = [];

const CustomNode = ({ id, data }) => {
  const [label, setLabel] = useState(data.label);

  const handleChange = (e) => {
    setLabel(e.target.value);
    data.onEdit(id, e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setLabel(label + '\n');
    }
  };

  return (
    <div className="p-4 bg-white rounded-full shadow-md">
      <textarea
        value={label}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-1 border rounded text-center resize-none"
        rows={label.split('\n').length}
      />
      <div className="flex justify-around mt-2">
        <button onClick={() => data.onAdd(id)} className="text-blue-500">
          +
        </button>
        <button onClick={() => data.onRemove(id)} className="text-red-500">
          x
        </button>
      </div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const MapaEditos = () => {
  const [nodes, setNodes] = useNodes(initialNodes);
  const [edges, setEdges] = useEdges(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onLoad = useCallback((instance) => setReactFlowInstance(instance), []);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onElementClick = (event, element) => {
    console.log('click', element);
  };

  const addNode = (event, parentId) => {
    event.stopPropagation();
    const newNodeId = uuidv4();
    const newNode = {
      id: newNodeId,
      type: 'custom',
      data: {
        label: `Nodo ${nodes.length + 1}`,
        onRemove: removeNode,
        onAdd: addNode,
        onEdit: editNode,
      },
      position: {
        x: Math.random() * 250,
        y: Math.random() * 250,
      },
    };

    const newEdge = {
      id: uuidv4(),
      source: parentId,
      target: newNodeId,
    };

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) => eds.concat(newEdge));
  };

  const removeNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const editNode = (nodeId, label) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, label } } : node))
    );
  };

  return (
    <div className="h-screen bg-gray-100">
      <ReactFlowProvider>
        <div className="flex justify-between p-4">
          <button
            onClick={(event) => addNode(event, '1')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Añadir Nodo
          </button>
        </div>
        <div className="h-full">
          <ReactFlow
            elements={nodes.concat(edges)}
            onElementsRemove={removeNode}
            onConnect={onConnect}
            onLoad={onLoad}
            onElementClick={onElementClick}
            nodeTypes={nodeTypes}
            snapToGrid={true}
            snapGrid={[15, 15]}
            defaultZoom={1.5}
            minZoom={0.2}
            maxZoom={4}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <Background color="#aaa" gap={16} />
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default MapaEditos;









