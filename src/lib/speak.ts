/**
 * Speak function for backend integration
 * This function is exposed globally via the Hero3DCharacter component
 * 
 * @param text - The text to display in the speech bubble
 * @param audioUrl - Optional URL to an audio file to play (TTS from backend)
 * 
 * Usage from backend:
 * window.speak("Hello! How can I help you today?", "https://your-backend.com/audio/greeting.mp3");
 */

export interface SpeakFunction {
  (text: string, audioUrl?: string): void;
}

// Type definition for window.speak
declare global {
  interface Window {
    speak?: SpeakFunction;
  }
}

// This is just for type safety - the actual implementation is in Hero3DCharacter component
export const initSpeakFunction = () => {
  if (typeof window !== 'undefined' && !window.speak) {
    console.warn('Speak function not initialized. Make sure Hero3DCharacter is mounted.');
  }
};
