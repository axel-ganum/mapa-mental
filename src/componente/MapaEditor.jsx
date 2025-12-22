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
import { useWebSocket } from './context/useWebSocket';

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

  // Global WebSocket context
  const { ws, lastMessage } = useWebSocket();
  const reconectInter = useRef(null);
  const reactFlowWrapper = useRef(null);
  const saveToastId = useRef(null);
  const isSavingRef = useRef(false);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const queryMapid = queryParams.get('id');

  // Stable ref for the handler to avoid reconnection loops
  const handleSuccessResponseRef = useRef(null);
  const handleSuccessResponse = useCallback(async (response) => {
    if (response.type === 'error') {
      isSavingRef.current = false;
      setIsSaving(false);
      if (saveToastId.current) {
        toast.update(saveToastId.current, { render: `Error: ${response.message || 'Error desconocido'}`, type: 'error', isLoading: false, autoClose: 3000 });
        saveToastId.current = null;
      } else {
        toast.error(`Error: ${response.message || 'Error desconocido'}`);
      }
      setIsSaving(false);
      setLoading(false);
      return;
    }

    if (response.type === 'success') {
      if (response.action === 'saveMap' || response.action === 'updateMap') {
        isSavingRef.current = false;
        setMapId(response.map?._id || mapId);
        setIsSaving(false);

        if (saveToastId.current) {
          toast.update(saveToastId.current, {
            render: response.action === 'saveMap' ? 'Mapa creado exitosamente' : 'Cambios guardados',
            type: 'success',
            isLoading: false,
            autoClose: 3000
          });
          saveToastId.current = null;
        } else {
          toast.success(response.action === 'saveMap' ? 'Mapa creado exitosamente' : 'Cambios guardados');
        }

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

  // React to global WebSocket messages
  useEffect(() => {
    if (lastMessage && handleSuccessResponseRef.current) {
      handleSuccessResponseRef.current(lastMessage);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (queryMapid && ws && ws.readyState === WebSocket.OPEN) {
      console.log('MapaEditor: Solicitando mapa inicial', queryMapid);
      ws.send(JSON.stringify({ action: 'getMap', payload: { id: queryMapid } }));
    }
  }, [queryMapid, ws]);

  // Update the ref whenever the handler changes
  useEffect(() => {
    handleSuccessResponseRef.current = handleSuccessResponse;
  }, [handleSuccessResponse]);

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
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      toast.error('No hay conexión con el servidor. Por favor, espera o reinicia sesión.');
      return;
    }

    setIsSaving(true);
    isSavingRef.current = true;
    saveToastId.current = toast.loading('Generando imagen del mapa...');

    try {
      if (!reactFlowWrapper.current) throw new Error('Contenedor del mapa no encontrado');

      const canvas = await html2canvas(reactFlowWrapper.current, {
        useCORS: true,
        scale: 2,
        logging: false,
        backgroundColor: '#f8fafc'
      });

      const image = canvas.toDataURL('image/png');

      toast.update(saveToastId.current, { render: 'Enviando al servidor...', type: 'info', isLoading: true });

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

      ws.send(JSON.stringify({
        action: mapId ? 'updateMap' : 'saveMap',
        payload
      }));

      // The actual success/error toast will be triggered by handleSuccessResponse
      // but we'll dismiss this one after a timeout if no response comes
      setTimeout(() => {
        if (saveToastId.current) {
          toast.dismiss(saveToastId.current);
          saveToastId.current = null;
        }
        if (isSavingRef.current) {
          isSavingRef.current = false;
          setIsSaving(false);
          toast.error('Tiempo de espera agotado al guardar. Revisa tu conexión.');
        }
      }, 10000);

    } catch (error) {
      console.error('Error saving map:', error);
      isSavingRef.current = false;
      if (saveToastId.current) {
        toast.update(saveToastId.current, {
          render: `Error: ${error.message}`,
          type: 'error',
          isLoading: false,
          autoClose: 3000
        });
        saveToastId.current = null;
      }
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
              disabled={!title || !description}
              className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${!title || !description ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}
            >
              <span>Comenzar</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
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
              <button
                onClick={saveMap}
                disabled={isSaving}
                className={`premium-button flex items-center gap-2 min-w-[120px] justify-center ${isSaving ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'premium-button-green'}`}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
                    <span>{mapId ? 'Guardando...' : 'Creando...'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>{mapId ? 'Guardar' : 'Crear Mapa'}</span>
                  </>
                )}
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





