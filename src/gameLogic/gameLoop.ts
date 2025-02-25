export class GameLoop {
    private animationFrameId: number = 0;
    private updateInterval: number = 100; // ms

    constructor(private updateCallback: () => void) {}

    start() {
        let lastUpdate = Date.now();

        const frame = () => {
            const now = Date.now();
            if (now - lastUpdate >= this.updateInterval) {
                this.updateCallback();
                lastUpdate = now;
            }
            this.animationFrameId = requestAnimationFrame(frame);
        };

        this.animationFrameId = requestAnimationFrame(frame);
    }

    stop() {
        cancelAnimationFrame(this.animationFrameId);
    }
}