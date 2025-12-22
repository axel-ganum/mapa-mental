import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2canvas from 'html2canvas';
import { useLocation } from 'react-router-dom';
import useMapStore from '../hooks/useMapStore';
import NodeContent from './NodeContent';
import MyCustomNode from './MyCustomNode';
import CompartirMapa from './CompartirMapa';

const nodeTypes = {
  custom: MyCustomNode,
};

const MapaEditor = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    removeNode,
    setNodes,
    setEdges,
    updateNodeData,
    undo,
    redo,
    autoLayout,
  } = useMapStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mapId, setMapId] = useState(null);
  const [showShare, setShowShare] = useState(false);

  const ws = useRef(null);
  const reconectInter = useRef(null);
  const reactFlowWrapper = useRef(null);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const queryMapid = queryParams.get('id');

  // WebSocket handlers
  const handleSuccessResponse = useCallback(async (response) => {
    if (response.type === 'error') {
      toast.error(`Error: ${response.message || 'Error desconocido'}`);
      setIsSaving(false);
      setLoading(false);
      return;
    }

    if (response.type === 'success') {
      if (response.action === 'saveMap' || response.action === 'updateMap') {
        setMapId(response.map?._id || mapId);
        setIsSaving(false);
        toast.success(response.action === 'saveMap' ? 'Mapa creado' : 'Mapa actualizado');
        setShowModal(false);
        setLoading(false);
      } else if (response.action === 'mapUpdated' || response.action === 'nodeDeleted') {
        toast.info(response.action === 'mapUpdated' ? 'Mapa actualizado por otro usuario' : 'Nodo eliminado por otro usuario');
        ws.current.send(JSON.stringify({ action: 'getMap', payload: { id: response.map._id } }));
      } else if (response.action === 'getMap' && response.map) {
        setMapId(response.map._id);
        setTitle(response.map.title);
        setDescription(response.map.description);

        const restoredNodes = response.map.nodes.map(node => ({
          ...node,
          type: 'custom',
          data: {
            ...node.data,
            content: node.content || '', // Use raw content
          }
        }));

        setNodes(restoredNodes);
        setEdges(response.map.edges);
        setLoading(false);
        setShowModal(false);
      }
    }
  }, [mapId, setNodes, setEdges]);

  const connectWebSocket = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (ws.current) ws.current.close();

    ws.current = new WebSocket(`wss://api-mapa-mental.onrender.com?token=${token}`);

    ws.current.onopen = () => {
      clearInterval(reconectInter.current);
      if (queryMapid) {
        ws.current.send(JSON.stringify({ action: 'getMap', payload: { id: queryMapid } }));
      }
    };

    ws.current.onmessage = (event) => {
      handleSuccessResponse(JSON.parse(event.data));
    };

    ws.current.onclose = () => {
      if (!reconectInter.current) {
        reconectInter.current = setTimeout(connectWebSocket, 5000);
      }
    };
  }, [queryMapid, handleSuccessResponse]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current) ws.current.close();
      clearTimeout(reconectInter.current);
    };
  }, [connectWebSocket]);

  useEffect(() => {
    if (queryMapid) {
      setLoading(true);
      setShowModal(false);
    } else {
      setLoading(false);
      setShowModal(true);
    }
  }, [queryMapid]);

  const handleAddNode = useCallback(() => {
    const id = `${Date.now()}`;
    const newNode = {
      id,
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { content: '' },
    };
    addNode(newNode);
  }, [addNode]);

  const saveMap = async () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      toast.error('No hay conexión con el servidor. Reintentando...');
      connectWebSocket();
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Generando imagen del mapa...');

    try {
      if (!reactFlowWrapper.current) throw new Error('Contenedor del mapa no encontrado');

      const canvas = await html2canvas(reactFlowWrapper.current, {
        useCORS: true,
        scale: 2,
        logging: false,
        backgroundColor: '#f8fafc'
      });

      const image = canvas.toDataURL('image/png');

      toast.update(toastId, { render: 'Enviando al servidor...', type: 'info', isLoading: true });

      const payload = {
        id: mapId,
        title,
        description,
        nodes: nodes.map(n => ({
          id: n.id,
          type: n.type,
          position: n.position,
          content: n.data?.content || '',
          data: { content: n.data?.content || '' }
        })),
        edges,
        thumbnail: image
      };

      ws.current.send(JSON.stringify({
        action: mapId ? 'updateMap' : 'saveMap',
        payload
      }));

      // The actual success/error toast will be triggered by handleSuccessResponse
      // but we'll dismiss this one after a timeout if no response comes
      setTimeout(() => {
        toast.dismiss(toastId);
        if (isSaving) {
          setIsSaving(false);
          toast.error('Tiempo de espera agotado al guardar');
        }
      }, 10000);

    } catch (error) {
      console.error('Error saving map:', error);
      toast.update(toastId, {
        render: `Error: ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
      setIsSaving(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden pt-20">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 font-medium text-slate-600">Cargando mapa...</span>
        </div>
      ) : showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Crear nuevo mapa</h2>
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <textarea
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 mb-6 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 resize-none"
            />
            <button
              onClick={() => title && description && setShowModal(false)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
            >
              Comenzar
            </button>
          </div>
        </div>
      )}

      {showShare && <CompartirMapa ws={ws.current} mapId={mapId} onClose={() => setShowShare(false)} />}

      <ToastContainer position="bottom-right" theme="light" />

      <div className="flex-grow relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
        >
          <Panel position="top-center" className="z-[60]">
            <div className="glass-panel px-4 py-2 rounded-2xl flex items-center gap-3 shadow-2xl">
              <button onClick={saveMap} disabled={isSaving} className={`premium-button ${isSaving ? 'bg-slate-200' : 'premium-button-green'}`}>
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1" />
              <button onClick={handleAddNode} className="premium-button premium-button-blue">
                + Nuevo Nodo
              </button>
              <button onClick={autoLayout} className="premium-button premium-button-purple">
                Reorganizar
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1" />
              <button onClick={() => setShowShare(true)} className="px-4 py-2 hover:bg-slate-100 rounded-xl transition-colors font-medium text-slate-600">
                Compartir
              </button>
            </div>
          </Panel>
          <Controls position="bottom-left" />
          <Background color="#cbd5e1" gap={20} />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
        </ReactFlow>
      </div>
    </div>
  );
};

export default MapaEditor;





