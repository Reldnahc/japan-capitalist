export class AudioManager {
    static audioElements: Record<string, HTMLAudioElement> = {};
    private static volume: number = 1; // Default volume (1 is 100%)
    private static isMuted: boolean = true;

    // Load sound files
    static loadSounds(sounds: Record<string, string>): void {
        Object.keys(sounds).forEach((key) => {
            const audio = new Audio(sounds[key]);
            audio.volume = this.isMuted ? 0 : this.volume;
            this.audioElements[key] = audio;
        });
    }

    // Play a sound by key
    static play(soundKey: string): void {
        const sound = this.audioElements[soundKey];
        if (!sound) return;

        if (!this.isMuted) {
            //if (sound.paused) {
                sound.currentTime = 0; // Only reset if the sound is paused
           //I  }
            sound.play();
        }
    }

    // Pause a sound by key
    static pause(soundKey: string): void {
        const sound = this.audioElements[soundKey];
        if (sound) {
            sound.pause();
        }
    }

    // Set volume (0 to 1)
    static setVolume(newVolume: number): void {
        this.volume = newVolume;
        Object.values(this.audioElements).forEach((audio) => {
            audio.volume = this.isMuted ? 0 : this.volume; // Update all audio elements with new volume
        });
    }

    // Mute or unmute explicitly
    static mute(): void {
        this.isMuted = true;
        Object.values(this.audioElements).forEach((audio) => {
            audio.volume = 0;
        });
    }

    static unmute(): void {
        this.isMuted = false;
        Object.values(this.audioElements).forEach((audio) => {
            audio.volume = this.volume;
        });
    }

    // Check if muted
    static getMuted(): boolean {
        return this.isMuted;
    }
}