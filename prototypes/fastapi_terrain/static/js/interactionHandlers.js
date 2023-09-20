// Variables for mouse dragging
let dragging = false;
let prevX = 0, prevY = 0;
const maxScale = 2;
const minScale = 1;

app.view.addEventListener('mousedown', (event) => {
    dragging = true;
    prevX = event.clientX;
    prevY = event.clientY;
});

app.view.addEventListener('mouseup', () => {
    dragging = false;
});

app.view.addEventListener('mousemove', (event) => {
    if (dragging) {
        const dx = event.clientX - prevX;
        const dy = event.clientY - prevY;
        terrainContainer.position.x += dx;
        terrainContainer.position.y += dy;
        ensureVisibility();
        prevX = event.clientX;
        prevY = event.clientY;
    }
});

app.view.addEventListener('wheel', (event) => {
    const scaleAmount = 0.1;
    const oldScaleX = terrainContainer.scale.x;
    const oldScaleY = terrainContainer.scale.y;

    const newScaleX = (event.deltaY < 0) ? 
                      Math.min(oldScaleX + scaleAmount, maxScale) : 
                      Math.max(oldScaleX - scaleAmount, minScale);
    const newScaleY = (event.deltaY < 0) ? 
                      Math.min(oldScaleY + scaleAmount, maxScale) : 
                      Math.max(oldScaleY - scaleAmount, minScale);

    const pointerX = event.clientX;
    const pointerY = event.clientY;
    const localCoords = terrainContainer.toLocal(new PIXI.Point(pointerX, pointerY));
    const newPosX = pointerX - localCoords.x * newScaleX;
    const newPosY = pointerY - localCoords.y * newScaleY;

    terrainContainer.scale.set(newScaleX, newScaleY);
    terrainContainer.position.set(newPosX, newPosY);

    ensureVisibility();
    event.preventDefault();
});
