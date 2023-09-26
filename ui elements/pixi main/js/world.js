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
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Create a container to hold your world content
        this.worldContainer = new PIXI.Container();
        this.app.stage.addChild(this.worldContainer);
        
        
        
        // Add event listeners for zoom and pan
        this.app.view.addEventListener('wheel', (e) => this.onZoom(e));
        this.app.view.addEventListener('mousedown', (e) => this.onStartPan(e));
        this.app.view.addEventListener('mousemove', (e) => this.onPan(e));
        this.app.view.addEventListener('mouseup', (e) => this.onEndPan(e));
        this.app.view.addEventListener('mouseleave', (e) => this.onEndPan(e));

        // Pan properties
        this.isPanning = false;
        this.lastPosition = { x: 0, y: 0 };
        
        // Create background pattern
        this.createTerrain();
        
        //Create shadow Container
        this.shadowContainer = new PIXI.Container();
        this.worldContainer.addChildAt(this.shadowContainer, 1);
        this.bodyContainer = new PIXI.Container();
        this.worldContainer.addChildAt(this.bodyContainer, 2);
        
        // Initialize Creature Map
        const creaturesMap = new Map();
        
    }
    
    createTerrain() {
        const graphics = new PIXI.Graphics();

        // Draw background pattern
        for (let x = 0; x < 5000; x += 50) {
            for (let y = 0; y < 5000; y += 50) {
                graphics.beginFill((x + y) % 100 === 0 ? 0xFFDDDD : 0xDDFFDD);
                graphics.drawRect(x, y, 50, 50);
                graphics.endFill();
            }
        }

        // Add pattern to world container
        this.worldContainer.addChildAt(graphics, 0);
    }

    resizeCanvas() {
        this.app.renderer.view.style.position = "absolute";
        this.app.renderer.view.style.display = "block";
        this.app.renderer.autoResize = true;
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    onZoom(event) {
        const zoomFactor = 1.1;
        const direction = event.deltaY > 0 ? 1 / zoomFactor : zoomFactor;

        this.worldContainer.scale.x *= direction;
        this.worldContainer.scale.y *= direction;
    }

    onStartPan(event) {
        this.isPanning = true;
        this.lastPosition = { x: event.clientX, y: event.clientY };
    }

    onPan(event) {
        if (!this.isPanning) return;

        const dx = event.clientX - this.lastPosition.x;
        const dy = event.clientY - this.lastPosition.y;

        this.worldContainer.position.x += dx;
        this.worldContainer.position.y += dy;

        this.lastPosition = { x: event.clientX, y: event.clientY };
    }

    onEndPan(event) {
        this.isPanning = false;
    }

    // Getter for the PIXI app
    get pixiApp() {
        return this.app;
    }
    
    createCreature(x,y,color){
        // Funktion, um eine zufällige Zahl zwischen min und max zu generieren
        /**function getRandom(min, max) {
            return Math.random() * (max - min) + min;
        }
        const x = getRandom(50, 750);
        const y = getRandom(50, 750);**/
        
        const creature = new Creature(app, 0xFF0000, x, y, 25, this.shadowContainer, this.bodyContainer);
        
        return creature
        
    }
    
    updateWorld(){
    
    }
    
}

