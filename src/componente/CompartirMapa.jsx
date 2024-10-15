import { useState, useEffect, useRef } from "react";
import userShareMap from '../hooks/userShareMap.js'



const CompartirMapa = ({ws ,mapId}) => {
  const [emailToShare, setEmailToShare] = useState('');
  const emailInputRef = useRef(null);

  const {shareMapWithEmail} = userShareMap(ws, mapId);

  useEffect(() => {
    if(emailInputRef.current) {
        emailInputRef.current.focus();
    }
  }, []);

  const handleShare = () => {
    if(emailToShare) {
      shareMapWithEmail(emailToShare);
      setEmailToShare('');
      }
    }


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-xl font-bold mb-4">
        <h2 className="text-xl font-bold mb-4">Compartir Mapa Mental</h2>
        <input 
         ref={emailInputRef}
         type="email"
         placeholder="Correo electronico"
         value={emailToShare}
         onChange={(e) => setEmailToShare(e.target.value)}
         className="p-2 m-2 border rounded w-full"
        
        />
        <button
          onClick={handleShare}
          className="p-2 m-2 text-white bg-green-500 rounded shadow"
        >
         Compartir
        </button>
         <button 
           onClick={() => window.history.back()}
           className="p-2 text-white bg-red-500 rounded shadow"
         >
            Cancelar
         </button>
         </div>
      
    </div>
  )
}

export default CompartirMapa
