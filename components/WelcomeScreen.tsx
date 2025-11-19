import React from 'react';
import { Scan, Camera, Building2 } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full animate-[fadeIn_0.8s_ease-out]">
        
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full"></div>
          <div className="relative bg-gradient-to-br from-cyan-900 to-black p-6 rounded-2xl border border-cyan-500/30 shadow-2xl">
            <Building2 className="w-16 h-16 text-cyan-400" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-200 to-cyan-600 bg-clip-text text-transparent">
          Museo Los Perales
        </h1>
        
        <h2 className="text-lg text-cyan-100/70 font-light tracking-wider mb-8 uppercase text-sm">
          Tour Virtual con Realidad Aumentada
        </h2>

        <p className="text-gray-400 mb-10 leading-relaxed text-sm px-4">
          Descubre la historia oculta en cada objeto. Apunta tu cámara a los artefactos del museo para revelar sus secretos, escuchar sus historias y ver videos del pasado.
        </p>

        <button 
          onClick={onStart}
          className="group relative flex items-center gap-3 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          <Camera className="w-5 h-5" />
          <span>Comenzar Tour</span>
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </button>

        <div className="mt-12 flex gap-8 text-gray-500 text-xs">
          <div className="flex flex-col items-center gap-2">
            <Scan className="w-6 h-6 text-gray-600" />
            <span>Escanea</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 rounded border border-gray-600 flex items-center justify-center font-serif">T</div>
            <span>Lee</span>
          </div>
          <div className="flex flex-col items-center gap-2">
             <div className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center">▶</div>
            <span>Escucha</span>
          </div>
        </div>

      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;