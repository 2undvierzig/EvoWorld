class World {
    constructor() {
        // Initialize PIXI Application
        this.app = new PIXI.Application({
            backgroundColor: 0xEEEEEE,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            antialias: true
        });

        // Attach the canvas to the DOM
        document.body.appendChild(this.app.view);

        // Initial resize
        this.resizeCanvas();

        // Listen for window resize events
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    // Function to resize the PIXI canvas
    resizeCanvas() {
        this.app.renderer.view.style.position = "absolute";
        this.app.renderer.view.style.display = "block";
        this.app.renderer.autoResize = true;
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    // Getter for the PIXI app
    get pixiApp() {
        return this.app;
    }
    
}

