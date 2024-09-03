import React, { useEffect, useState } from 'react';
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
import {useRef} from 'react';
import html2canvas from 'html2canvas';
import { useLocation, useNavigate, useParams} from 'react-router-dom';


const nodeType = {
  custom: MyCustomNode
}
// Componente principal del mapa mental
const MapaEditor = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useNodesState('')
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const [showModal, setShoeModal] = useState(true);
  const [mapId, setMapId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const reconectInter = useRef(null);
  const reactFlowWrapper = useRef(null)
  const ws = useRef(null);
  const location = useLocation();
 
 


  const queryParams = new URLSearchParams(location.search);
  const queryMapid = queryParams.get('id') 

  const connectWebSocket = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
  
    // Crear una nueva instancia del WebSocket
    ws.current = new WebSocket(`ws://localhost:3000?token=${token}`);
  
    // Evento cuando el WebSocket se conecta
    ws.current.onopen = () => {
      console.log('WebSocket conectado');
      clearInterval(reconectInter.current);
  
      if (queryMapid) {
        ws.current.send(JSON.stringify({ action: 'getMap', payload: { id: queryMapid } }));
      }
    };
  
    // Evento cuando llega un mensaje del WebSocket
    ws.current.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.success && response.map) {
        setMapId(response.map._id);
        setTitle(response.map.title);
        setDescription(response.map.description);
        setNodes(response.map.nodes); // Asegúrate de usar 'nodes' en lugar de 'edges'
        setEdges(response.map.edges); // Agrega esto para manejar también los edges
        setShoeModal(false);
      } else if (response.error) {
        console.error('Error del WebSocket:', response.error);
      }
    };
  
    // Evento cuando ocurre un error en el WebSocket
    ws.current.onerror = (error) => {
      console.error('Error del WebSocket', error.message);
    };
  
    // Evento cuando el WebSocket se cierra
    ws.current.onclose = (event) => {
      console.log('WebSocket desconectado, reintentando conexión...', event.reason);
      reconectInter.current = setInterval(connectWebSocket, 5000);
    };
  };
    


    
// envia la data a al backend
   



useEffect(() => {
  connectWebSocket(); 

  return () => {
    if (ws.current) {
      ws.current.close();
    }
    clearInterval(reconectInter.current);
  };
}, [queryMapid]);

  useEffect(() => {
    if(!showModal) {
      setHasChanges(true)
    }
  }, [nodes, edges])

  useEffect(() => {
    const handleBeforUnload = (event) => {
      if (hasChanges) {
        saveMap();

        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforUnload);

    return () => {
      window.removeEventListener('beforeunload' , handleBeforUnload)
    }
  }, [hasChanges])


  const saveMap =  async () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      try {

        const element = reactFlowWrapper.current;
        
        const scale = 3;
      

      const clone = element.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.transform = `scale(${scale})`; 
      clone.style.transform = '0 0';
      document.body.appendChild(clone);
     
      const boundingRect = element.getBoundingClientRect();
      const width = boundingRect.width * scale;
      const height = boundingRect.height * scale;


      
      //const scrollWidth = clone.scrollWidth * scale;
      //const scrollHeight = clone.scrollHeight * scale; 
      
      const canvas = await html2canvas(clone, {
        width: width,
        height:height,
        scale,
        useCORS: true,
        logging: true,
        allowTaint: true,
        backgroundColor: null
      });
      
      document.body.removeChild(clone)

        const image = canvas.toDataURL('image/png', 1.0);

      const map = {
        id: mapId,
        title,
        description,
        nodes,
        edges,
        thumbnail: image
      };
      console.log('Mapa mental guardado:', map)
      ws.current.send(JSON.stringify({ action: 'saveMap', payload: map})); 
      //console.log('Mensaje enviado:', message)
      setHasChanges(false);

    } catch (error) {
      console.error('Error al capturar el mapa mental:', error)
    }
  } else {
    console.warn('webSocket no esta en estado OPEN');
  }
  }


  const handleNodeChange = (newValue, nodeId)  =>{
    setNodes((nds) => 
      nds.map((node) =>
      node.id === nodeId ? {...node, data: {...node.data, label: <NodeContent text={newValue} onChange={(value) => handleNodeChange(value, nodeId)} onRemoveNode={() => removeNode(nodeId)} /> }} :node
    )
  );
  }
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
            onChange={(value) => handleNodeChange(value, newNodeId)}
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

  const handleSaveTitleDescription   = () => {
    if(title && description) {
      setShoeModal(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Crear nuevo mapa mental</h2>
          <input
            type="text"
            placeholder="Título del Mapa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 m-2 border rounded w-full"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 m-2 border rounded w-full"
          />
          <button
            onClick={handleSaveTitleDescription}
            className="p-2 m-2 text-white bg-green-500 rounded shadow"
          >
            Guardar
          </button>
        </div>
      </div>
    )}
    {!showModal && (
      <>
        <div className="p-4 bg-white shadow-md flex justify-between items-center">
          <div>
            <button
              onClick={saveMap}
              className="p-2 m-2 text-white bg-green-500 rounded shadow"
            >
              Guardar
            </button>
          </div>
        </div>
        <button
          onClick={() => addNode({ x: Math.random() * 500, y: Math.random() * 300 })}
          className="p-2 m-2 text-white bg-blue-500 rounded shadow self-start"
        >
          Agregar Nodo
        </button>
        <div className="flex-grow overflow-hidden">
          <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
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
            <Controls className="absolute top-1 left-0" />
            <Background />
          </ReactFlow>
          </div>
        </div>
      </>
    )}
  </div>
);
};
export default MapaEditor;





