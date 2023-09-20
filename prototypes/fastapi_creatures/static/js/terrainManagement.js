// Ensure the terrain is visible within the bounds of the window
function ensureVisibility() {
    // Calculate the bounds for how far the terrain can be moved.
    const maxX = 0;
    const maxY = 0;
    const minX = app.renderer.width - terrainContainer.width * terrainContainer.scale.x;
    const minY = app.renderer.height - terrainContainer.height * terrainContainer.scale.y;

    terrainContainer.position.x = Math.min(maxX, Math.max(minX, terrainContainer.position.x));
    terrainContainer.position.y = Math.min(maxY, Math.max(minY, terrainContainer.position.y));
}
