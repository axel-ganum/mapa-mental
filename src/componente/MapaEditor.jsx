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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import html2canvas from 'html2canvas';
import { useLocation} from 'react-router-dom';




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
  const [showModal, setShoeModal] = useState(false);
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false);
  const [mapId, setMapId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const reconectInter = useRef(null);
  const reactFlowWrapper = useRef(null)
  const ws = useRef(null);
  const location = useLocation();
 
 


  const queryParams = new URLSearchParams(location.search);
  const queryMapid = queryParams.get('id') 

  useEffect(() => {
 if(queryMapid){

  setLoading(true);
  setShoeModal(false)
 } else {
   setLoading(false);
   setShoeModal(true);
 }
  },[queryMapid])

  const connectWebSocket = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }
  
    if (ws.current) {
      ws.current.close()
    }

    ws.current = new WebSocket(`ws://localhost:3000?token=${token}`);
  
    // Evento cuando el WebSocket se conecta
    ws.current.onopen = async () => {
      console.log('WebSocket conectado');
      clearInterval(reconectInter.current);
      
      if (queryMapid) {

     
        await ws.current.send(JSON.stringify({ action: 'getMap', payload: { id: queryMapid } }));
      } 
    };
  
    // Evento cuando llega un mensaje del WebSocket
    ws.current.onmessage = async (event) => {
      const response = JSON.parse(event.data);
      console.log('Mensaje recibido:', response);
       
      await handleSuccessResponse(response)
    };
  
    // Evento cuando ocurre un error en el WebSocket
    ws.current.onerror = (error) => {
      console.error('Error del WebSocket', error.message);

      if(!reconectInter.current) {
        reconectInter.current = setTimeout(connectWebSocket, 5000);
      }
    };
  
    // Evento cuando el WebSocket se cierra
    ws.current.onclose = (event) => {
      console.log('WebSocket desconectado, reintentando conexión...', event.reason);
      if(!reconectInter.current) {
        reconectInter.current = setTimeout(connectWebSocket, 5000);
      }
    };
  }; 
    
  const handleSuccessResponse = async (response) => {
    console.log('Respuesta recibida desde webSocket:', response)
    if (response.type === 'success') {
    
   if(response.action ==='saveMap') {
     console.log('Mpa creado exitosamente:', response.map);
      setMapId(response.map._id);
      setIsSaving(false);
      toast.success('Mapa creado exitosamente')
      setShoeModal(false);
      setLoading(false)
   } else if (response.action === 'updateMap') {
     console.log('Mapa actualizado exitosamente');
     setIsSaving(false);
     toast.success('Mapa actualizado exitosamente');
     setShoeModal(false);
     setLoading(false)
   }else if(response.action === 'getMap' && response.map){
     console.log('Respuesta con el mapa mental:', response);
     
   setMapId(response.map._id);
   setTitle(response.map.title);
   setDescription(response.map.description);
   
   setNodes(restoreNodes(response.map.nodes)); 
   setEdges(restoreEdges(response.map.edges)); 
   setLoading(false);
   setShoeModal(false);
   } else if (response.action === 'deleteNode') {
    console.log('Elementos eliminados:', response);

   setNodes((prevNodes) => prevNodes.filter((node) => node.id !== response.nodeId));
   toast.success('Nodo eliminado exitosamente')
   
 } else if (response.type == 'error') {
   console.error('Error del WebSocket:', response.message);

   toast.error('Error del webSocket:'+ response.message);
   setIsSaving(false)
   setLoading(false)
 }
    
  }}
  const restoreNodes = (savedNodes) => {
    return savedNodes.map((node) => ({
      ...node,
      content: node.content || '',
      type: 'custom',
      data: {
        ...node.data,
        label: (
          <NodeContent
          text={node.content || ''}
          onChange={(value) => handleNodeChange(value, node.id)}
          onRemoveNode={() => removeNode(node.id)}
           />
        ),
      },
      style: node.style || { style: { borderRadius: '12px', padding: '10px' } },
      }))
  }
  
    


    

   



useEffect(() => {
  connectWebSocket(); 

  return () => {
    if (ws.current) {
      ws.current.close();
    }
    clearTimeout(reconectInter.current);
  };
}, []);

const restoreEdges = (savedEdges) => {
  return savedEdges.map((edge) => ({
    ...edge,
    style: { stroke: '#000', strokeWidth: 2},
  }))
}

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
    setIsSaving(true)
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

        const uniqueNodes = nodes.reduce((acc, current) => {
          const x = acc.find(node => node.id === current.id);
          if (!x) {
              return acc.concat(current); // Agregar directamente el objeto `current` al array
          } else {
              return acc;
          }
      }, []);
      

      const map = {
        id: mapId,
        title,
        description,
        nodes:uniqueNodes,
        edges,
        thumbnail: image
      };
      console.log('Mapa mental guardado:', map)

      const actionType = mapId? 'updateMap': 'saveMap'
      console.log(`Accón a realizar: ${actionType}`)
      ws.current.send(JSON.stringify({ action: actionType, payload: map})); 
   
      setHasChanges(false);

    } catch (error) {
      console.error('Error al capturar el mapa mental:', error);
      setIsSaving(false);
    } 
 // finally {
     //setIsSaving(false)
  //}
  }}


  const handleNodeChange = (newValue, nodeId)  =>{
    setNodes((nds) => 
      nds.map((node) =>
      node.id === nodeId
        ? {
          ...node,
          content: newValue,
          data: {
            ...node.data,
            label: (
              <NodeContent  
              text={ newValue}
              onChange={(value) => handleNodeChange(value, nodeId)}
              onRemoveNode={() => removeNode(nodeId)}
              />
            ),
          },
        }
        : node
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

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {

      const payload = {
        action:'deleteNode',
         nodeId:nodeId
      };
      ws.current.send(JSON.stringify(payload))
       console.log(`Enviando solicitud del nodo ID: ${nodeId} al backend`)
    }
   
  };

  // Función para manejar nuevas conexiones
  const onConnect = (params) =>
    setEdges((eds) => addEdge({ ...params, style: { stroke: '#000', strokeWidth: 2} }, eds));

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
      {loading? (
         <div className="flex items-center justify-center h-full">
         <span>Cargando mapa mental...</span>
       </div>
      ):
      showModal && (
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
              className={`p-2 m-2 text-white rounded shadow ${ isSaving? 'bg-gray-400 opacity-50 cursor-not-allowed': 'bg-green-500' }`}
              disabled={isSaving}
            >
            {isSaving ? 'Guardardando...' : 'Guardar' }
            </button>
          </div>
        </div>
        <button
          onClick={() => addNode({ x: Math.random() * 500, y: Math.random() * 300 })}
          className="p-2 m-2 text-white bg-blue-500 rounded shadow self-start"
        >
          Agregar Nodo
        </button>
        <ToastContainer/>
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





