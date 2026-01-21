import type { Track } from '@/features/mood-analysis/types/mood.types';

export type PlaybackMode = 'preview' | 'spotify';

export type PlayerState = {
    mode: PlaybackMode;
    isReady: boolean;
    isPlaying: boolean;
    currentIndex: number;
    error?: string;
  };
  
export interface PlayerEngine {
    mode: PlaybackMode;
    init(): Promise<void>;
    setQueue(tracks: Track[], startIndex?: number): Promise<void>;
    play(index?: number): Promise<void>;
    pause(): Promise<void>;
    next(): Promise<void>;
    previous(): Promise<void>;
    destroy(): Promise<void>;
    onState(cb: (s: Partial<PlayerState>) => void): () => void;
}