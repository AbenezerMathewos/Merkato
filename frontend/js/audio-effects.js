// ============================================================================
// MERKATO - Web Audio UI Micro-Sounds (Synthesized, No External MP3s Needed)
// ============================================================================

(function(window) {
    'use strict';

    const MUTE_STORAGE_KEY = 'merkato_audio_muted';

    class AudioEffects {
        constructor() {
            this.muted = localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
            this.ctx = null;
        }

        _getAudioContext() {
            if (!this.ctx && typeof window.AudioContext !== 'undefined') {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            return this.ctx;
        }

        playAddToCart() {
            if (this.muted) return;
            const ctx = this._getAudioContext();
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12); // G5

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.18);
        }

        playSuccess() {
            if (this.muted) return;
            const ctx = this._getAudioContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.value = freq;

                const start = now + (i * 0.06);
                gain.gain.setValueAtTime(0.06, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(start);
                osc.stop(start + 0.15);
            });
        }

        playPop() {
            if (this.muted) return;
            const ctx = this._getAudioContext();
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        }

        toggleMute() {
            this.muted = !this.muted;
            localStorage.setItem(MUTE_STORAGE_KEY, this.muted);
            return this.muted;
        }

        isMuted() {
            return this.muted;
        }
    }

    window.MerkatoAudio = new AudioEffects();

})(window);
