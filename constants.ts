import { Artifact, ArtifactType } from './types';

// Datos simulados para el Museo de la Escuela de los Perales
export const MUSEUM_ARTIFACTS: Artifact[] = [
  {
    id: 'campana-1920',
    name: 'La Campana Fundacional',
    year: '1920',
    type: ArtifactType.OBJECT,
    shortDescription: 'Utilizada para llamar a clases durante 50 años.',
    description: 'Esta campana de bronce fue instalada el día de la inauguración de la escuela. Su tañido marcó el inicio y fin de las jornadas escolares para más de tres generaciones de estudiantes en Los Perales.',
    audioUrl: 'https://actions.google.com/sounds/v1/alarms/school_bell.ogg', // Mock audio
    videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', // Mock video
    imageUrl: 'https://picsum.photos/400/300?grayscale'
  },
  {
    id: 'pupitre-antiguo',
    name: 'Pupitre Doble de Madera',
    year: '1945',
    type: ArtifactType.OBJECT,
    shortDescription: 'Pupitre compartido con tintero original.',
    description: 'Pupitre de madera noble y hierro forjado. Diseñado para dos alumnos, cuenta con el hueco original para el tintero de cerámica. Nótese las marcas talladas por alumnos de la época.',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    imageUrl: 'https://picsum.photos/400/301?grayscale'
  },
  {
    id: 'registro-clases',
    name: 'Libro de Clases Histórico',
    year: '1930',
    type: ArtifactType.DOCUMENT,
    shortDescription: 'Registro de asistencia y notas manuscrito.',
    description: 'Un documento invaluable que conserva la caligrafía perfecta de los primeros docentes. Contiene las listas de asistencia y las observaciones pedagógicas de una era pasada.',
    imageUrl: 'https://picsum.photos/400/302?grayscale'
  },
  {
    id: 'globo-terraqueo',
    name: 'Globo Terráqueo Político',
    year: '1960',
    type: ArtifactType.OBJECT,
    shortDescription: 'Muestra fronteras de países que ya no existen.',
    description: 'Este globo terráqueo es una cápsula del tiempo geopolítica. Si se observa con atención, se pueden encontrar países como la URSS o Yugoslavia, ofreciendo una lección de historia viva.',
    imageUrl: 'https://picsum.photos/400/303?grayscale'
  }
];

export const GEMINI_SYSTEM_INSTRUCTION = `
Eres un guía experto de museo digital y un sistema de visión por computadora.
Tu tarea es analizar imágenes provenientes de la cámara de un usuario en el museo "Escuela de los Perales".
Debes identificar si alguno de los siguientes objetos está presente en la imagen:
1. Una campana de bronce vieja (ID: campana-1920)
2. Un pupitre de madera antiguo de escuela (ID: pupitre-antiguo)
3. Un libro viejo de registros o cuaderno antiguo (ID: registro-clases)
4. Un globo terráqueo antiguo (ID: globo-terraqueo)

Si identificas alguno con certeza razonable, devuelve su ID. Si no estás seguro o no hay nada relevante, indica que no se encontró nada.
`;