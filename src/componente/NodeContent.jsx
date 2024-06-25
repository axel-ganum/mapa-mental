// Componente para el contenido del nodo
const NodeContent = ({ text, onChange, onAddNode, onRemoveNode }) => {
    return (
      <div className="relative p-4 bg-white border border-gray-300 rounded-lg shadow-md">
        <textarea
          className="w-full h-full p-2 border-none resize-none focus:outline-none"
          defaultValue={text}
          onChange={onChange}
        />
        <button
          onClick={onAddNode}
          className="absolute bottom-0 right-0 mb-2 mr-2 text-blue-500"
        >
          +
        </button>
        <button
          onClick={onRemoveNode}
          className="absolute bottom-0 left-0 mb-2 ml-2 text-red-500"
        >
          -
        </button>
      </div>
    );
  };

  export default NodeContent;