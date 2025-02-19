export class AudioManager {
    private static audioElements: Record<string, HTMLAudioElement> = {};
    private static volume: number = 1; // Default volume (1 is 100%)
    private static isMuted: boolean = true;

    // Load sound files
    static loadSounds(sounds: Record<string, string>): void {
        Object.keys(sounds).forEach((key) => {
            const audio = new Audio(sounds[key]);
            audio.volume = this.volume;
            this.audioElements[key] = audio;
        });
    }

    // Play a sound by key
    static play(soundKey: string): void {
        const sound = this.audioElements[soundKey];
        if (sound && !this.isMuted) {
            // Reset time and play
            sound.currentTime = 0;
            sound.play();
        }
    }

    // Set volume (0 to 1)
    static setVolume(newVolume: number): void {
        this.volume = newVolume;
        Object.values(this.audioElements).forEach((audio) => {
            audio.volume = this.volume;
        });
    }

    // Mute/Unmute all sounds
    static toggleMute(): void {
        this.isMuted = !this.isMuted;
    }

    // Check if muted
    static getMuted(): boolean {
        return this.isMuted;
    }
}