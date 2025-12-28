import { create } from 'zustand';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
} from 'reactflow';

const useMapStore = create((set, get) => ({
    nodes: [],
    edges: [],
    history: [],
    future: [],

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },

    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },

    onConnect: (connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
        get().takeSnapshot();
    },

    addNode: (node) => {
        set({
            nodes: [...get().nodes, node],
        });
        get().takeSnapshot();
    },

    removeNode: (nodeId) => {
        set({
            nodes: get().nodes.filter((node) => node.id !== nodeId),
            edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
        });
        get().takeSnapshot();
    },

    updateNodeData: (nodeId, data) => {
        set({
            nodes: get().nodes.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
            ),
        });
        get().takeSnapshot();
    },

    updateNodePositionSilent: (nodeId, position) => {
        set({
            nodes: get().nodes.map((node) =>
                node.id === nodeId ? { ...node, position } : node
            ),
        });
        // No snapshot for rapid real-time updates
    },

    updateNodeDataSilent: (nodeId, data) => {
        set({
            nodes: get().nodes.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
            ),
        });
        // No snapshot for rapid real-time updates
    },

    takeSnapshot: () => {
        const { nodes, edges, history } = get();
        set({
            history: [...history, { nodes, edges }],
            future: [],
        });
    },

    undo: () => {
        const { history, future, nodes, edges } = get();
        if (history.length === 0) return;

        const last = history[history.length - 1];
        const newHistory = history.slice(0, history.length - 1);

        set({
            nodes: last.nodes,
            edges: last.edges,
            history: newHistory,
            future: [{ nodes, edges }, ...future],
        });
    },

    redo: () => {
        const { history, future, nodes, edges } = get();
        if (future.length === 0) return;

        const next = future[0];
        const newFuture = future.slice(1);

        set({
            nodes: next.nodes,
            edges: next.edges,
            history: [...history, { nodes, edges }],
            future: newFuture,
        });
    },

    autoLayout: () => {
        const { nodes } = get();
        // Simple circular layout for now
        const radius = 200;
        const centerX = 400;
        const centerY = 300;

        const newNodes = nodes.map((node, index) => {
            const angle = (index / nodes.length) * 2 * Math.PI;
            return {
                ...node,
                position: {
                    x: centerX + radius * Math.cos(angle),
                    y: centerY + radius * Math.sin(angle),
                },
            };
        });

        set({ nodes: newNodes });
        get().takeSnapshot();
    },
}));

export default useMapStore;
