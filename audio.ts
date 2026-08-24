// Centralized Audio Controller for Success Sound Effects (successs.mp3)

let cachedAudio: HTMLAudioElement | null = null;

export const playSuccessAudio = () => {
  if (typeof window === 'undefined') return;

  try {
    // Try primary successs.mp3
    const audio = new Audio('/successs.mp3');
    audio.volume = 1.0;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Playback started successfully
        })
        .catch((err) => {
          console.log('Primary success audio failed, trying fallback:', err);
          // Fallback to cashin.mp3
          const fallbackAudio = new Audio('/cashin.mp3');
          fallbackAudio.volume = 1.0;
          fallbackAudio.play().catch(() => {
            playSynthesizedChime();
          });
        });
    }
  } catch (error) {
    console.warn('Audio play exception:', error);
    playSynthesizedChime();
  }
};

export const playCashInAudio = playSuccessAudio;
export const playRewardAudio = playSuccessAudio;

// Synthesized chime as ultimate fallback if browser blocks file audio
function playSynthesizedChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;
    // Pleasant success arpeggio
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.4, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  } catch (e) {
    console.warn('WebAudio chime failed:', e);
  }
}
