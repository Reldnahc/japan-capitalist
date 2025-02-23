export class AudioManager {
    static audioElements: Record<string, HTMLAudioElement> = {};
    private static volumes: { music: number; soundEffects: number } = { music: 0.5, soundEffects: 1 }; // Default volumes
    private static isMuted: boolean = true;

    /**
     * Load sound files
     * @param sounds Record containing sound keys/paths
     * @param type 'music' or 'soundEffect' determines the audio category
     */
    static loadSounds(sounds: { [key: string]: { src: string; type: 'music' | 'soundEffects' } }): void {
        Object.keys(sounds).forEach((key) => {
            const { src, type } = sounds[key];
            const audio = new Audio(src);

            // Set initial volume based on type
            audio.volume = this.isMuted ? 0 : this.volumes[type];
            this.audioElements[key] = audio;
        });
    }

    /**
     * Play a sound by key
     * @param soundKey The key of the sound to play
     */
    static play(soundKey: string): void {
        const sound = this.audioElements[soundKey];
        if (!sound) return;

        if (!this.isMuted) {
            sound.currentTime = 0; // Reset to start
            sound.play();
        }
    }

    /**
     * Pause a sound by key
     * @param soundKey The key of the sound to pause
     */
    static pause(soundKey: string): void {
        const sound = this.audioElements[soundKey];
        if (sound) {
            sound.pause();
        }
    }

    /**
     * Set volume for a specific type of audio (music or soundEffects)
     * @param type 'music' or 'soundEffects'
     * @param newVolume Volume level between 0 and 1
     */
    static setVolume(type: 'music' | 'soundEffects', newVolume: number): void {
        this.volumes[type] = newVolume;

        // Update volumes for corresponding audio elements
        Object.entries(this.audioElements).forEach(([key, audio]) => {
            const soundType = this.getSoundType(key);
            if (soundType === type) {
                audio.volume = this.isMuted ? 0 : this.volumes[type];
            }
        });
    }

    /**
     * Mute or unmute all audio
     * @param mute Whether to mute or unmute
     */
    static setMuted(mute: boolean): void {
        this.isMuted = mute;

        // Update all audio elements based on mute state
        Object.entries(this.audioElements).forEach(([key, audio]) => {
            const soundType = this.getSoundType(key);
            audio.volume = this.isMuted ? 0 : this.volumes[soundType];
        });
    }

    /**
     * Get whether audio is muted
     * @returns True if muted
     */
    static getMuted(): boolean {
        return this.isMuted;
    }

    /**
     * Get the volume of a specific type
     * @param type 'music' or 'soundEffects'
     * @returns Current volume level
     */
    static getVolume(type: 'music' | 'soundEffects'): number {
        return this.volumes[type];
    }

    /**
     * Helper function to retrieve the type of a sound
     * @param soundKey The key of the sound
     * @returns 'music' or 'soundEffects'
     */
    private static getSoundType(soundKey: string): 'music' | 'soundEffects' {
        // Assuming sound keys for music contain "music" and sound effects contain "effect"
        return soundKey.includes('background') || soundKey.includes('music') ? 'music' : 'soundEffects';
    }
}