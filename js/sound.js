/**
 * ==============================================================================
 * MA GIÁO AOV - HỆ THỐNG ÂM THANH GAME PROCEDURAL (WEB AUDIO API)
 * Tạo âm thanh tương tác kim loại, lootbox rương thách đấu, thành công & copy
 * Không phụ thuộc vào tệp mp3 ngoài, tốc độ phản hồi 0ms!
 * ==============================================================================
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = localStorage.getItem("mg_sound_muted") === "true";
    }

    initContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem("mg_sound_muted", this.isMuted);
        return this.isMuted;
    }

    // Tiếng Click nút kim loại Cyberpunk
    playClick() {
        if (this.isMuted) return;
        try {
            this.initContext();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = "sine";
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
            
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now);
            osc.stop(now + 0.04);
        } catch (e) {}
    }

    // Tiếng mở hòm Lootbox / Rương Thách Đấu Liên Quân huyền ảo
    playLootboxOpen() {
        if (this.isMuted) return;
        try {
            this.initContext();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            
            // Sweep tần số ma thuật
            const osc1 = this.ctx.createOscillator();
            const gain1 = this.ctx.createGain();
            osc1.type = "triangle";
            osc1.frequency.setValueAtTime(220, now);
            osc1.frequency.exponentialRampToValueAtTime(880, now + 0.35);
            gain1.gain.setValueAtTime(0.08, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc1.connect(gain1);
            gain1.connect(this.ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.4);

            // Shimmer lấp lánh C6 - E6 - G6
            [1046.5, 1318.5, 1567.98].forEach((freq, idx) => {
                const noteOsc = this.ctx.createOscillator();
                const noteGain = this.ctx.createGain();
                const noteStart = now + 0.15 + (idx * 0.08);
                
                noteOsc.type = "sine";
                noteOsc.frequency.setValueAtTime(freq, noteStart);
                noteGain.gain.setValueAtTime(0.06, noteStart);
                noteGain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.3);
                
                noteOsc.connect(noteGain);
                noteGain.connect(this.ctx.destination);
                
                noteOsc.start(noteStart);
                noteOsc.stop(noteStart + 0.3);
            });
        } catch (e) {}
    }

    // Tiếng Chiến Thắng / Nhận Acc Thành Công (Victory Fanfare Chime)
    playSuccess() {
        if (this.isMuted) return;
        try {
            this.initContext();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            
            // Hợp âm Đô Trưởng lộng lẫy (C5, E5, G5, C6)
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const start = now + (idx * 0.07);
                
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, start);
                
                gain.gain.setValueAtTime(0.1, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start(start);
                osc.stop(start + 0.45);
            });
        } catch (e) {}
    }

    // Tiếng Copy thông tin thành công
    playCopy() {
        if (this.isMuted) return;
        try {
            this.initContext();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.setValueAtTime(880, now + 0.05); // A5
            
            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now);
            osc.stop(now + 0.12);
        } catch (e) {}
    }

    // Tiếng cảnh báo / lỗi
    playError() {
        if (this.isMuted) return;
        try {
            this.initContext();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.linearRampToValueAtTime(110, now + 0.18);
            
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now);
            osc.stop(now + 0.18);
        } catch (e) {}
    }
}

// Khởi tạo đối tượng âm thanh toàn cục
const sounds = new SoundEngine();
