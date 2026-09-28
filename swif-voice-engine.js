/**
 * =====================================================================
 * SWIFT SUPER-APP - VOICE ENGINE & AUDIO NAVIGATION (v8.0)
 * =====================================================================
 * Mengatur interaksi suara, text-to-speech, dan navigasi audio untuk driver & user.
 */

class SwiftVoiceEngine {
    constructor() {
        this.synth = window.speechSynthesis;
        this.enabled = true;
    }

    speak(text, lang = 'id-ID') {
        if (!this.enabled || !this.synth) return;
        
        // Hentikan suara yang sedang berjalan agar tidak menumpuk
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        this.synth.speak(utterance);
    }

    announceNewOrder(orderId, serviceType) {
        const message = `Pesanan baru masuk untuk layanan \({serviceType}. Nomor order\){orderId}. Silakan periksa aplikasi.`;
        this.speak(message);
    }

    toggleVoice(status) {
        this.enabled = status !== undefined ? status : !this.enabled;
        return this.enabled;
    }
}

export const voiceEngine = new SwiftVoiceEngine();
