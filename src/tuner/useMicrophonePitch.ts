import { requestRecordingPermissionsAsync, useAudioStream, type AudioStreamBuffer } from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { detectPitch } from './detectPitch';

export type MicStatus = 'starting' | 'listening' | 'denied' | 'error';

// Analysis runs at ~24 kHz: plenty for guitar fundamentals and a quarter of
// the work of 48 kHz.
const ANALYSIS_RATE = 24000;
const ANALYSIS_SIZE = 2048; // ~85 ms, enough for two periods of low E
const HOP_MS = 60;
const MIN_RMS = 0.004; // quieter than this is silence; a quiet room is ~0.002
const MIN_CLARITY = 0.85;
const HISTORY = 5; // median filter length, kills one-off octave jumps
const HOLD_MS = 350; // keep showing the note through brief dropouts
const RESTART_DELAY_MS = 250;
const STALL_MS = 1500;

let lastStopAt = 0;

/** Listens to the microphone and returns the detected frequency in Hz, or null when silent. */
export function useMicrophonePitch() {
  const [frequency, setFrequency] = useState<number | null>(null);
  const [status, setStatus] = useState<MicStatus>('starting');
  const analyzer = useRef<Analyzer | null>(null);
  const lastBufferAt = useRef(0);

  const { stream } = useAudioStream({
    channels: 1,
    encoding: 'float32',
    onBuffer: (buffer) => {
      lastBufferAt.current = Date.now();
      analyzer.current ??= new Analyzer(buffer.sampleRate);
      const result = analyzer.current.push(buffer);
      if (result !== undefined) setFrequency(result);
    },
  });

  useEffect(() => {
    let cancelled = false;
    let wanted = false; // whether we mean to be listening right now
    const start = async () => {
      const permission = await requestRecordingPermissionsAsync();
      if (cancelled) return;
      if (!permission.granted) {
        setStatus('denied');
        return;
      }
      // expo-audio deactivates the audio session 100 ms after stop(), even if
      // the stream has been started again since, which silently kills it.
      const wait = lastStopAt + RESTART_DELAY_MS - Date.now();
      if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
      if (cancelled || stream.isStreaming) return;
      wanted = true;
      lastBufferAt.current = Date.now();
      await stream.start();
      setStatus('listening');
    };
    const stop = () => {
      wanted = false;
      stream.stop();
      lastStopAt = Date.now();
      setFrequency(null);
    };
    const fail = () => !cancelled && setStatus('error');

    start().catch(fail);
    // Release the mic in the background; pick it back up on return.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') start().catch(fail);
      else if (state === 'background') stop();
    });
    // Interruptions (calls, Siri, route changes) can stop the stream without
    // telling us; restart it if audio stops arriving.
    const watchdog = setInterval(() => {
      if (!wanted || AppState.currentState !== 'active') return;
      if (Date.now() - lastBufferAt.current < STALL_MS) return;
      stop();
      start().catch(fail);
    }, STALL_MS);
    return () => {
      cancelled = true;
      subscription.remove();
      clearInterval(watchdog);
      stop();
    };
  }, [stream]);

  return { frequency, status };
}

/** Buffers incoming audio and returns a new reading every HOP_MS, or undefined between hops. */
class Analyzer {
  private readonly decimation: number;
  private readonly rate: number;
  private readonly ring = new Float32Array(ANALYSIS_SIZE);
  private readonly window = new Float32Array(ANALYSIS_SIZE);
  private readonly hop: number;
  private written = 0;
  private sinceLastHop = 0;
  private pending = 0;
  private pendingCount = 0;
  private history: number[] = [];
  private lastHeardAt = 0;

  constructor(sampleRate: number) {
    this.decimation = Math.max(1, Math.round(sampleRate / ANALYSIS_RATE));
    this.rate = sampleRate / this.decimation;
    this.hop = Math.round((this.rate * HOP_MS) / 1000);
  }

  push(buffer: AudioStreamBuffer): number | null | undefined {
    const samples = new Float32Array(buffer.data);
    // Average groups of samples down to the analysis rate (first channel only).
    for (let i = 0; i < samples.length; i += buffer.channels) {
      this.pending += samples[i];
      if (++this.pendingCount < this.decimation) continue;
      this.ring[this.written++ % ANALYSIS_SIZE] = this.pending / this.decimation;
      this.pending = 0;
      this.pendingCount = 0;
      this.sinceLastHop++;
    }
    if (this.written < ANALYSIS_SIZE || this.sinceLastHop < this.hop) return undefined;
    this.sinceLastHop = 0;
    return this.analyze();
  }

  private analyze(): number | null {
    const start = this.written % ANALYSIS_SIZE;
    let energy = 0;
    for (let i = 0; i < ANALYSIS_SIZE; i++) {
      const sample = this.ring[(start + i) % ANALYSIS_SIZE];
      this.window[i] = sample;
      energy += sample * sample;
    }
    const loud = Math.sqrt(energy / ANALYSIS_SIZE) >= MIN_RMS;
    const pitch = loud ? detectPitch(this.window, this.rate) : null;

    const now = Date.now();
    if (pitch && pitch.clarity >= MIN_CLARITY) {
      this.lastHeardAt = now;
      this.history.push(pitch.frequency);
      if (this.history.length > HISTORY) this.history.shift();
      return median(this.history);
    }
    if (now - this.lastHeardAt > HOLD_MS) {
      this.history = [];
      return null;
    }
    return this.history.length ? median(this.history) : null;
  }
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}
