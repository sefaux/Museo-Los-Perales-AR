export enum ArtifactType {
  OBJECT = 'OBJECT',
  DOCUMENT = 'DOCUMENT',
  PHOTO = 'PHOTO'
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  shortDescription: string; // For the preview overlay
  year: string;
  type: ArtifactType;
  audioUrl?: string;
  videoUrl?: string;
  imageUrl?: string; // Fallback image
}

export interface ScanResult {
  found: boolean;
  artifactId?: string;
  confidence: number;
}

export enum AppState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  FOUND = 'FOUND',
  ERROR = 'ERROR'
}