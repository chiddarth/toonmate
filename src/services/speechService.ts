class SpeechService {
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private speaking = false;

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const loadVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
      this.isInitialized = true;
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
    return this.voices;
  }

  isSpeaking(): boolean {
    return this.speaking;
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.speaking = false;
    }
  }

  speak(
    text: string,
    options: {
      voiceName?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
      enabled?: boolean;
      onStart?: () => void;
      onEnd?: () => void;
    } = {}
  ) {
    if (options.enabled === false) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    this.stop();

    // Strip emojis for smoother speech synthesis reading
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    const utterance = new SpeechSynthesisUtterance(cleanText.trim());
    this.currentUtterance = utterance;

    const voices = this.getVoices();
    if (options.voiceName && voices.length > 0) {
      const voice = voices.find(v => v.name === options.voiceName);
      if (voice) utterance.voice = voice;
    } else if (voices.length > 0) {
      // Default to an English voice if available
      const englishVoice = voices.find(v => v.lang.startsWith('en') && !v.name.includes('Google'));
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.05;
    utterance.volume = options.volume ?? 0.9;

    utterance.onstart = () => {
      this.speaking = true;
      options.onStart?.();
    };

    utterance.onend = () => {
      this.speaking = false;
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = () => {
      this.speaking = false;
      this.currentUtterance = null;
      options.onEnd?.();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
      options.onEnd?.();
    }
  }
}

export const speechService = new SpeechService();
