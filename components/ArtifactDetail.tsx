import React from 'react';
import { Artifact, ArtifactType } from '../types';
import { X, Play, Pause, BookOpen, Box, Image as ImageIcon } from 'lucide-react';

interface ArtifactDetailProps {
  artifact: Artifact;
  onClose: () => void;
}

const ArtifactDetail: React.FC<ArtifactDetailProps> = ({ artifact, onClose }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getIcon = (type: ArtifactType) => {
    switch (type) {
      case ArtifactType.DOCUMENT: return <BookOpen className="w-5 h-5 text-amber-400" />;
      case ArtifactType.OBJECT: return <Box className="w-5 h-5 text-emerald-400" />;
      case ArtifactType.PHOTO: return <ImageIcon className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 p-4 animate-[slideUp_0.3s_ease-out]">
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-white max-h-[85vh] flex flex-col">
        
        {/* Header Image */}
        <div className="relative h-48 shrink-0">
           {artifact.videoUrl ? (
             <video 
                src={artifact.videoUrl} 
                className="w-full h-full object-cover"
                poster={artifact.imageUrl}
                controls
                controlsList="nodownload"
             />
           ) : (
             <img 
                src={artifact.imageUrl} 
                alt={artifact.name} 
                className="w-full h-full object-cover"
             />
           )}
           <button 
             onClick={onClose}
             className="absolute top-2 right-2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
           >
             <X className="w-5 h-5 text-white" />
           </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            {getIcon(artifact.type)}
            <span className="text-xs font-bold tracking-wider uppercase text-white/60">{artifact.year}</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            {artifact.name}
          </h2>
          
          <p className="text-white/80 leading-relaxed mb-6 text-sm">
            {artifact.description}
          </p>

          {/* Audio Narration Control */}
          {artifact.audioUrl && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4">
              <button 
                onClick={toggleAudio}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-500 text-black hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)]"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
              </button>
              <div className="flex-1">
                <p className="text-sm font-medium text-cyan-400">Narración Histórica</p>
                <p className="text-xs text-white/50">Escuchar historia del objeto</p>
              </div>
              <audio 
                ref={audioRef} 
                src={artifact.audioUrl} 
                onEnded={() => setIsPlaying(false)}
              />
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ArtifactDetail;