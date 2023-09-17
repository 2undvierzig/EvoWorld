class Creature {
    constructor(app, color, x, y, size) {
        this.app = app;
        this.color = color;
        this.x = x;
        this.y = y;
        this.size = size;
        this.scale = size / 50;

        // Hier erstellen wir einen globalen Container, der Schatten enthält
        if (!this.app.stage.shadowContainer) {
            this.app.stage.shadowContainer = new PIXI.Container();
            this.app.stage.addChildAt(this.app.stage.shadowContainer, 0);
        }

        this.creatureContainer = this.createCreatureContainer();
        this.app.stage.addChild(this.creatureContainer);
    }

    createCreatureContainer() {
        const creatureContainer = new PIXI.Container();
        creatureContainer.x = this.x;
        creatureContainer.y = this.y;

        // Schatten wird jetzt zum globalen Schatten-Container hinzugefügt
        const shadow = new PIXI.Graphics();
        shadow.beginFill(0x000000, 0.2);
        shadow.drawCircle(0, 0, 45 * this.scale);
        shadow.endFill();
        shadow.y = 20 * this.scale;
        this.app.stage.shadowContainer.addChild(shadow);
        creatureContainer.shadow = shadow;

        const circle = new PIXI.Graphics();
        circle.beginFill(this.color);
        circle.drawCircle(0, 0, this.size);
        circle.endFill();
        creatureContainer.addChild(circle);

        const leftEye = this.createEye(-20, -15);
        const rightEye = this.createEye(20, -15);
        const leftPupil = this.createPupil(0, -4);
        const rightPupil = this.createPupil(0, -4);
        leftEye.addChild(leftPupil);
        rightEye.addChild(rightPupil);
        circle.addChild(leftEye, rightEye);

        let elapsedTime = 0;

        this.app.ticker.add((delta) => {
            const scale = 1 + Math.sin(elapsedTime) * 0.05;
            circle.scale.set(scale);
            shadow.scale.set(1 / scale);
            shadow.x = creatureContainer.x;
            shadow.y = creatureContainer.y + 20 * this.scale;
            elapsedTime += 0.05 * delta;
        });

        setTimeout(this.blinkEyes.bind(this, leftEye, rightEye), Math.random() * 3000 + 1000);

        return creatureContainer;
    }

    createEye(xOffset, yOffset) {
        const eye = new PIXI.Graphics();
        eye.beginFill(0xFFFFFF);
        eye.drawCircle(0, 0, 15 * this.scale);
        eye.endFill();
        eye.x = xOffset * this.scale;
        eye.y = yOffset * this.scale;
        return eye;
    }

    createPupil(xOffset, yOffset) {
        const pupil = new PIXI.Graphics();
        pupil.beginFill(0x000000);
        pupil.drawCircle(0, 0, 7 * this.scale);
        pupil.endFill();
        pupil.x = xOffset * this.scale;
        pupil.y = yOffset * this.scale;
        return pupil;
    }

    blinkEyes(leftEye, rightEye) {
        const blinkDuration = 0.1;

        leftEye.scale.y = 0;
        rightEye.scale.y = 0;

        setTimeout(() => {
            leftEye.scale.y = 1;
            rightEye.scale.y = 1;
            setTimeout(this.blinkEyes.bind(this, leftEye, rightEye), Math.random() * 3000 + 1000);
        }, blinkDuration * 1000);
    }

    divide(newX, newY) {
        const newCreature = new Creature(this.app, this.color, newX, newY, this.size); 
        newCreature.creatureContainer.alpha = 0;

        let offset = 0;

        const dx = newX - this.creatureContainer.x;
        const dy = newY - this.creatureContainer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const directionX = dx / distance;
        const directionY = dy / distance;

        const vesica = new PIXI.Graphics();
        vesica.beginFill(this.color);

        const drawVesica = () => {
            vesica.clear();
            vesica.beginFill(this.color);
            vesica.drawCircle(0, 0, this.size);  // Originalkreis
            vesica.drawCircle(offset * directionX, offset * directionY, this.size);  // Zweiter Kreis, der sich in Richtung des neuen Ziels bewegt
            vesica.endFill();
        };

        this.creatureContainer.addChild(vesica);

        gsap.to(vesica, {
            duration: 0.5,
            ease: "power2.inOut",
            onUpdate: () => {
                offset += this.size * 0.02;  // Hier steuern wir, wie schnell sich der zweite Kreis bewegt.
                drawVesica();
            },
            onComplete: () => {
                vesica.clear();

                // Füge eine sanfte Fade-In-Animation für die neue Kreatur hinzu
                gsap.to(newCreature.creatureContainer, {
                    alpha: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });

        return newCreature;
    }


    
    moveCreatureTo(targetX, targetY) {
        const dx = targetX - this.creatureContainer.x;
        const dy = targetY - this.creatureContainer.y;
        const rotation = Math.atan2(dy, dx) + (Math.PI / 2);  // Berechnung des Winkels in Richtung des Zielpunktes

        gsap.to(this.creatureContainer, {
            rotation: rotation,  // Drehung des gesamten Containers
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(this.creatureContainer, {
                    x: targetX,
                    y: targetY,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    }
}
