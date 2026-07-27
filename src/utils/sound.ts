// Web Audio API Synthesizer for Tasbeeh Feedback & Ambience

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playBeadClick(soundType: "bead" | "soft_click" | "tone" | "silent" = "bead", volume = 0.8) {
  if (soundType === "silent") return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (soundType === "bead") {
      // Wood/Stone bead tap simulation
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

      gain.gain.setValueAtTime(volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } else if (soundType === "soft_click") {
      // Gentle digital tap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

      gain.gain.setValueAtTime(volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } else if (soundType === "tone") {
      // Soft melodic pitch
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5 note

      gain.gain.setValueAtTime(volume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    }
  } catch (e) {
    console.warn("Audio Context playback error:", e);
  }
}

export function playMilestoneChime(volume = 0.8) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Harmonic oriental chime C5 -> G5 -> C6
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      const noteVolume = volume * 0.3;
      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(noteVolume, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.85);
    });
  } catch (e) {
    console.warn("Milestone chime error:", e);
  }
}

export function playTreePlantingSound(volume = 0.8) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Arpeggio celebrating planting a Jannah Tree!
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major 7th chord
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(volume * 0.25, now + idx * 0.06 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 1.25);
    });
  } catch (e) {
    console.warn("Tree sound error:", e);
  }
}

// Mobile Haptic Vibrations
export function triggerHapticFeedback(type: "light" | "medium" | "heavy" = "light") {
  if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
    try {
      if (type === "light") {
        navigator.vibrate(12);
      } else if (type === "medium") {
        navigator.vibrate([20, 10, 20]);
      } else if (type === "heavy") {
        navigator.vibrate([40, 30, 60]);
      }
    } catch {
      // Ignore vibration errors
    }
  }
}
