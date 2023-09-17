
function createCreature(app, color, x, y, size = 30) {
    // Relative Skalierung berechnen
    const scale = size / 50;

    // Create a container for the creature and its shadow
    const creatureContainer = new PIXI.Container();
    creatureContainer.x = x;
    creatureContainer.y = y;
    app.stage.addChild(creatureContainer);

    // Creation of the shadow for the creature
    const shadow = new PIXI.Graphics();
    shadow.beginFill(0x000000, 0.2); // Schwarz und halbtransparent
    shadow.drawCircle(0, 0, 45 * scale); // x, y, radius
    shadow.endFill();
    shadow.y = 20 * scale; // Verschieben des Schattens ein wenig nach unten
    creatureContainer.addChild(shadow);

    // Creation of the circle (creature)
    const circle = new PIXI.Graphics();
    circle.beginFill(color);
    circle.drawCircle(0, 0, size); // x, y, radius
    circle.endFill();
    creatureContainer.addChild(circle);

    // Create eyes for the creature with the "Kawaii" style
    function createEye(xOffset, yOffset) {
        const eye = new PIXI.Graphics();
        eye.beginFill(0xFFFFFF); // White color
        eye.drawCircle(0, 0, 15 * scale); // Bigger eyes for the "Kawaii" style
        eye.endFill();
        eye.x = xOffset * scale;
        eye.y = yOffset * scale;
        return eye;
    }

    function createPupil(xOffset, yOffset) {
        const pupil = new PIXI.Graphics();
        pupil.beginFill(0x000000); // Black color
        pupil.drawCircle(0, 0, 7 * scale); // Bigger pupils for the "Kawaii" style
        pupil.endFill();
        pupil.x = xOffset * scale;
        pupil.y = yOffset * scale;
        return pupil;
    }

    const leftEye = createEye(-20, -15);
    const rightEye = createEye(20, -15);
    const leftPupil = createPupil(0, -4);
    const rightPupil = createPupil(0, -4);
    leftEye.addChild(leftPupil);
    rightEye.addChild(rightPupil);

    circle.addChild(leftEye, rightEye);

    let elapsedTime = 0;

    // Function to animate the circle and shadow
    app.ticker.add((delta) => {
        const scaleVariation = 1 + Math.sin(elapsedTime) * 0.05;
        circle.scale.set(scale * scaleVariation);
        shadow.scale.set(scale / scaleVariation);
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

    return creatureContainer;
}


function moveCreatureTo(creatureContainer, targetX, targetY) {
    const creature = creatureContainer.children[1]; // Zugriff auf die Kreatur im Container
    const dx = targetX - creatureContainer.x;
    const dy = targetY - creatureContainer.y;
    const rotation = Math.atan2(dy, dx) + (Math.PI / 2); // Bestimme den Winkel zur Zielposition und addiere π/2, um zu korrigieren

    // Zuerst rotiere die Kreatur, damit sie in die gewünschte Richtung schaut
    gsap.to(creature, {
        rotation: rotation,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
            // Nachdem die Rotation abgeschlossen ist, bewege die Kreatur und den Schatten zur gewünschten Position
            gsap.to(creatureContainer, {
                x: targetX,
                y: targetY,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
}

