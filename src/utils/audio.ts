import { AmbientSoundType } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private binauralOsc1: OscillatorNode | null = null;
  private binauralOsc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume * 0.12, this.ctx.currentTime);
    }
  }

  public toggleMute(muted: boolean) {
    this.isMuted = muted;
    if (this.isMuted) {
      this.stopAmbient();
    }
  }

  // Play high-quality chime on timer finish
  public playCompletionChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Chord: C5, E5, G5, B5, C6 (Major 7th uplifting chime)
      const frequencies = [523.25, 659.25, 783.99, 987.77, 1046.5];
      
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime((0.25 * this.volume) / frequencies.length, now + idx * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 2.0);
      });
    } catch {}
  }

  // Microstep completed cheerful soft ding
  public playMicroStepChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.12); // E6

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.15 * this.volume, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {}
  }

  // Gentle transition chime for break start
  public playBreakStartChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25]; // A major

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.01, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.12 * this.volume, now + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.4);
      });
    } catch {}
  }

  // Respiration cycle inhale tone
  public playBreathInhaleCue() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(330, now + 3.8);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06 * this.volume, now + 1.5);
      gain.gain.linearRampToValueAtTime(0.001, now + 3.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 4.0);
    } catch {}
  }

  // Respiration cycle exhale tone
  public playBreathExhaleCue() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.linearRampToValueAtTime(220, now + 3.8);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06 * this.volume, now + 1.5);
      gain.gain.linearRampToValueAtTime(0.001, now + 3.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 4.0);
    } catch {}
  }

  // Log distraction click feedback
  public playDistractionFeedback() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);

      gain.gain.setValueAtTime(0.1 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  // Start ambient soundscape
  public startAmbient(type: AmbientSoundType) {
    if (this.isMuted || type === 'off') return;
    this.stopAmbient();

    try {
      const ctx = this.getAudioContext();
      this.gainNode = ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(this.volume * 0.12, ctx.currentTime + 1.5);
      this.gainNode.connect(ctx.destination);

      if (type === 'binaural') {
        // 40Hz Gamma frequency binaural carrier: 200Hz left, 240Hz right (or dual stereo simulation)
        this.binauralOsc1 = ctx.createOscillator();
        this.binauralOsc2 = ctx.createOscillator();

        this.binauralOsc1.type = 'sine';
        this.binauralOsc1.frequency.setValueAtTime(210, ctx.currentTime);

        this.binauralOsc2.type = 'sine';
        this.binauralOsc2.frequency.setValueAtTime(250, ctx.currentTime);

        const subGain1 = ctx.createGain();
        const subGain2 = ctx.createGain();
        subGain1.gain.value = 0.5;
        subGain2.gain.value = 0.5;

        this.binauralOsc1.connect(subGain1);
        this.binauralOsc2.connect(subGain2);

        subGain1.connect(this.gainNode);
        subGain2.connect(this.gainNode);

        this.binauralOsc1.start();
        this.binauralOsc2.start();
      } else if (type === 'alpha-flow') {
        // 10Hz Alpha calm waves (200Hz + 210Hz)
        this.binauralOsc1 = ctx.createOscillator();
        this.binauralOsc2 = ctx.createOscillator();

        this.binauralOsc1.type = 'sine';
        this.binauralOsc1.frequency.setValueAtTime(190, ctx.currentTime);

        this.binauralOsc2.type = 'sine';
        this.binauralOsc2.frequency.setValueAtTime(200, ctx.currentTime);

        const subGain1 = ctx.createGain();
        const subGain2 = ctx.createGain();
        subGain1.gain.value = 0.45;
        subGain2.gain.value = 0.45;

        this.binauralOsc1.connect(subGain1);
        this.binauralOsc2.connect(subGain2);

        subGain1.connect(this.gainNode);
        subGain2.connect(this.gainNode);

        this.binauralOsc1.start();
        this.binauralOsc2.start();
      } else if (type === 'brown-noise') {
        // Deep Brown (Red) Noise: Integrates white noise for rich waterfall mask
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // Gain compensation
        }

        const brownNoiseSource = ctx.createBufferSource();
        brownNoiseSource.buffer = noiseBuffer;
        brownNoiseSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        brownNoiseSource.connect(filter);
        filter.connect(this.gainNode);
        brownNoiseSource.start();
        this.noiseNode = brownNoiseSource;
      } else if (type === 'pink-noise') {
        // Soft pink noise buffer generator
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(this.gainNode);
        whiteNoise.start();
        this.noiseNode = whiteNoise;
      }
    } catch {}
  }

  public stopAmbient() {
    try {
      if (this.binauralOsc1) {
        this.binauralOsc1.stop();
        this.binauralOsc1.disconnect();
        this.binauralOsc1 = null;
      }
      if (this.binauralOsc2) {
        this.binauralOsc2.stop();
        this.binauralOsc2.disconnect();
        this.binauralOsc2 = null;
      }
      if (this.noiseNode) {
        (this.noiseNode as AudioBufferSourceNode).stop();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
    } catch {}
  }
}

export const soundEngine = new SoundEngine();

