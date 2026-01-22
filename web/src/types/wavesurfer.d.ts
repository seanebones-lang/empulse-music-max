declare module 'wavesurfer.js' {
  export interface WaveSurferOptions {
    container: string | HTMLElement;
    waveColor?: string;
    progressColor?: string;
    cursorColor?: string;
    height?: number;
    barWidth?: number;
    normalize?: boolean;
    backend?: 'WebAudio' | 'MediaElement';
    mediaControls?: boolean;
  }

  export default class WaveSurfer {
    constructor(options: WaveSurferOptions);
    static create(options: WaveSurferOptions): WaveSurfer;
    load(url: string): void;
    play(): void;
    pause(): void;
    stop(): void;
    seekTo(progress: number): void;
    destroy(): void;
    on(event: 'seek', callback: (progress: number) => void): void;
    on(event: 'ready', callback: () => void): void;
    on(event: string, callback: (...args: unknown[]) => void): void;
    off(event: string, callback: (...args: unknown[]) => void): void;
  }
}
