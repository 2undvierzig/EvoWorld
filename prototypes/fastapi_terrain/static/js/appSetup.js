// Initialize the PIXI Application
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xFFFFFF
});

globalThis.__PIXI_APP__ = app;

// Initialize the loading screen
let loadingText = new PIXI.Text('Laden...', { fontSize: 36, fill: 0x000000 });
loadingText.x = app.renderer.width / 2 - loadingText.width / 2;
loadingText.y = app.renderer.height / 2 - loadingText.height / 2;
app.stage.addChild(loadingText);

// Declare the container for the terrain
window.terrainContainer = new PIXI.Container();
app.stage.addChild(window.terrainContainer);

// Wait for the DOM content to load before appending
document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(app.view);
});
