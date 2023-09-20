const ws = new WebSocket('ws://localhost:8000/ws');

ws.onopen = () => {
    console.debug('WebSocket connection opened.');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.debug('Received data from WebSocket:', data);

    if(data.image) {
        const base64Image = data.image;
        console.debug('Loading image with Base64 data:', base64Image.substring(0, 100) + "...");  // Display first 100 characters

        const texture = PIXI.Texture.from(`data:image/png;base64,${base64Image}`);
        const sprite = new PIXI.Sprite(texture);
        terrainContainer.addChild(sprite);

        // Remove loading screen after the texture is loaded
        app.stage.removeChild(loadingText);

        // Resize the PIXI.Application according to the texture size
        app.renderer.resize(texture.width, texture.height);

        // Debug information for width and height
        console.debug(`Texture dimensions: Width = ${texture.width}, Height = ${texture.height}`);
    }
};
