// Shared AudioContext service to prevent multiple context creation
class AudioContextService {
  private static instance: AudioContextService;
  private audioContext: AudioContext | null = null;

  private constructor() {}

  static getInstance(): AudioContextService {
    if (!AudioContextService.instance) {
      AudioContextService.instance = new AudioContextService();
    }
    return AudioContextService.instance;
  }

  async getAudioContext(): Promise<AudioContext> {
    if (typeof window === 'undefined') {
      throw new Error('AudioContext not available in server-side environment');
    }

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Resume context if suspended (helps with autoplay policies)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    return this.audioContext;
  }

  closeAudioContext(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const audioContextService = AudioContextService.getInstance();