import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Info, ChevronRight } from 'lucide-react';
import Loader from './components/Loader';
import ArtifactDetail from './components/ArtifactDetail';
import WelcomeScreen from './components/WelcomeScreen';
import { identifyArtifact } from './services/geminiService';
import { MUSEUM_ARTIFACTS } from './constants';
import { AppState, Artifact } from './types';

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [currentArtifact, setCurrentArtifact] = useState<Artifact | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize Camera only when leaving WELCOME state
  useEffect(() => {
    if (appState === AppState.WELCOME) return;

    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' }, // Use back camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setErrorMsg("No se pudo acceder a la cámara. Por favor permite el acceso para usar la experiencia AR.");
        setAppState(AppState.ERROR);
      }
    };

    startCamera();

    return () => {
      // Cleanup stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [appState]);

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setAppState(AppState.SCANNING);
    
    // Draw video frame to canvas
    const context = canvasRef.current.getContext('2d');
    if (context) {
        const { videoWidth, videoHeight } = videoRef.current;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
        
        // Get base64
        // Use lower quality for faster transmission
        const base64Image = canvasRef.current.toDataURL('image/jpeg', 0.6);
        
        // Call Gemini
        const result = await identifyArtifact(base64Image);
        
        if (result.found && result.artifactId) {
            const artifact = MUSEUM_ARTIFACTS.find(a => a.id === result.artifactId);
            if (artifact) {
                setCurrentArtifact(artifact);
                setAppState(AppState.FOUND);
            } else {
                setErrorMsg("Objeto reconocido pero no encontrado en la base de datos.");
                setAppState(AppState.IDLE); // Reset to try again
            }
        } else {
            // Not found feedback
             setErrorMsg("No se identificó ningún objeto del museo. Intenta acercarte más o mejorar la luz.");
             setAppState(AppState.IDLE);
        }
    }
  }, []);

  const resetScanner = () => {
    setAppState(AppState.IDLE);
    setCurrentArtifact(null);
    setErrorMsg(null);
  };

  const handleStartTour = () => {
    setAppState(AppState.IDLE);
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      
      {/* Welcome Screen */}
      {appState === AppState.WELCOME && (
        <WelcomeScreen onStart={handleStartTour} />
      )}

      {/* Hidden Canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video Background - Only visible when not in Welcome or Error state */}
      {appState !== AppState.WELCOME && appState !== AppState.ERROR && (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${appState === AppState.FOUND ? 'opacity-30 blur-sm' : 'opacity-100'}`}
        />
      )}

      {/* Overlay UI Layer */}
      {appState !== AppState.WELCOME && (
        <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none">
          
          {/* Header */}
          <header className="p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
            <div>
              <h1 className="text-xl font-bold text-cyan-400 tracking-tight flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Museo AR Los Perales
              </h1>
              <p className="text-xs text-white/60">Apunta a un objeto histórico</p>
            </div>
            
            {/* Debug/Status Indicator */}
            <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${
                appState === AppState.SCANNING ? 'bg-yellow-400 text-yellow-400 animate-pulse' :
                appState === AppState.FOUND ? 'bg-green-400 text-green-400' :
                'bg-cyan-400 text-cyan-400'
            }`} />
          </header>

          {/* Error / Info Messages Toast */}
          {errorMsg && appState === AppState.IDLE && (
              <div className="mx-6 mb-4 p-4 bg-red-500/80 backdrop-blur-md rounded-xl border border-red-400/30 text-sm text-white animate-[fadeIn_0.3s_ease-out] pointer-events-auto flex justify-between items-center">
                  <span>{errorMsg}</span>
                  <button onClick={() => setErrorMsg(null)}><RefreshCw className="w-4 h-4" /></button>
              </div>
          )}

          {/* Controls Area (Bottom) */}
          <div className="p-8 flex justify-center items-end pb-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-auto">
            
            {appState === AppState.IDLE && (
              <button 
                onClick={captureAndAnalyze}
                className="group relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
              >
                  <div className="absolute inset-0 rounded-full border border-cyan-500/50 animate-ping opacity-20"></div>
                  <Camera className="w-8 h-8 text-white group-hover:text-cyan-400 transition-colors" />
              </button>
            )}

            {appState === AppState.SCANNING && (
               <div className="text-cyan-400 font-mono text-sm bg-black/60 px-4 py-2 rounded-full border border-cyan-500/30 backdrop-blur">
                  Analizando imagen...
               </div>
            )}

          </div>
        </div>
      )}

      {/* Scanning Visuals */}
      {appState === AppState.SCANNING && <Loader />}

      {/* Result Modal */}
      {appState === AppState.FOUND && currentArtifact && (
        <ArtifactDetail 
          artifact={currentArtifact} 
          onClose={resetScanner}
        />
      )}

      {/* Error State */}
      {appState === AppState.ERROR && (
          <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center p-8 text-center">
              <h2 className="text-2xl text-red-500 font-bold mb-2">Error de Acceso</h2>
              <p className="text-gray-400 mb-6">{errorMsg}</p>
              <button 
                onClick={() => {
                    setErrorMsg(null);
                    setAppState(AppState.WELCOME);
                }}
                className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200"
              >
                  Volver al Inicio
              </button>
          </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;