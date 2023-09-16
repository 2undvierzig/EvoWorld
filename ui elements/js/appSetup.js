function createCreature(app, color, x, y) {
    // Creation of the circle (creature)
    const circle = new PIXI.Graphics();
    circle.beginFill(color);
    circle.drawCircle(0, 0, 50); // x, y, radius
    circle.endFill();
    circle.x = x;
    circle.y = y;
    app.stage.addChild(circle);

    // Create eyes for the creature
    function createEye(xOffset, yOffset) {
        const eye = new PIXI.Graphics();
        eye.beginFill(0xFFFFFF); // White color
        eye.drawCircle(0, 0, 10); // x, y, radius
        eye.endFill();
        eye.x = xOffset;
        eye.y = yOffset;
        return eye;
    }

    function createPupil(xOffset, yOffset) {
        const pupil = new PIXI.Graphics();
        pupil.beginFill(0x000000); // Black color
        pupil.drawCircle(0, -5, 5); // x, y, radius
        pupil.endFill();
        pupil.x = xOffset;
        pupil.y = yOffset;
        return pupil;
    }

    const leftEye = createEye(-20, -10);
    const rightEye = createEye(20, -10);
    const leftPupil = createPupil(0, 0);
    const rightPupil = createPupil(0, 0);
    leftEye.addChild(leftPupil);
    rightEye.addChild(rightPupil);

    circle.addChild(leftEye, rightEye);

    let elapsedTime = 0;

    // Function to animate the circle
    app.ticker.add((delta) => {
        // Using sine function to create a "breathing" effect by scaling the circle.
        circle.scale.set(1 + Math.sin(elapsedTime) * 0.05);
        // Incrementing the elapsed time.
        elapsedTime += 0.05 * delta;
    });

    // Function to make eyes blink
    function blinkEyes() {
        const blinkDuration = 0.1; // Duration of the blink in seconds

        leftEye.scale.y = 0;
        rightEye.scale.y = 0;

        setTimeout(() => {
            leftEye.scale.y = 1;
            rightEye.scale.y = 1;
            // Schedule the next blink
            setTimeout(blinkEyes, Math.random() * 3000 + 1000); // Random time between 1 to 4 seconds
        }, blinkDuration * 1000);
    }

    // Schedule the initial blink
    setTimeout(blinkEyes, Math.random() * 3000 + 1000); // Random time between 1 to 4 seconds

    return circle;
}
