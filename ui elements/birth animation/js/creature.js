class Creature {
    constructor(app, color, x, y, size) {
        this.app = app;
        this.color = color;
        this.x = x;
        this.y = y;
        this.size = size;
        this.scale = size / 50;
        this.currentRotation = 0;
        
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

        // Füge die neue Kreatur hinzu und führe die "Herzschlag"-Animation aus
        gsap.to(newCreature.creatureContainer, {
            alpha: 1,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
                // Add the heartbeat effect
                const pulseAnim = gsap.fromTo(newCreature.creatureContainer.scale, {
                    x: 0.8,
                    y: 0.8
                }, {
                    x: 1.2,
                    y: 1.2,
                    duration: 0.4,
                    yoyo: true,
                    repeat: 2,
                    ease: "power2.inOut",
                    onComplete: () => {
                        // Reset the scale after the animation
                        newCreature.creatureContainer.scale.set(1, 1);
                    }
                });
            }
        });

        return newCreature;
    }




    
    moveCreatureTo(targetX, targetY) {
        const dx = targetX - this.creatureContainer.x;
        const dy = targetY - this.creatureContainer.y;
        this.currentRotation = Math.atan2(dy, dx) + (Math.PI / 2);  // Berechnung des Winkels in Richtung des Zielpunktes

        gsap.to(this.creatureContainer, {
            rotation: this.currentRotation,  // Verwendung des aktuellen Rotationswerts
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




    /**die() {
        // Schritt 1: Zeichne ein "X" über die Augen
        const xGraphics = new PIXI.Graphics();
        xGraphics.lineStyle(2, 0x000000, 1);
        xGraphics.moveTo(-10, -10);
        xGraphics.lineTo(10, 10);
        xGraphics.moveTo(-10, 10);
        xGraphics.lineTo(10, -10);
        this.creatureContainer.addChild(xGraphics);

        // Schritt 2: Lass die Kreatur sanft verschwinden
        gsap.to(this.creatureContainer, {
            alpha: 0,
            duration: 1,
            onComplete: () => {
                this.creatureContainer.removeChild(xGraphics);
                this.creatureContainer.parent.removeChild(this.creatureContainer);
            }
        });

        // Schritt 3: Staubwolken-Animation
        for (let i = 0; i < 20; i++) {
            const particle = new PIXI.Graphics();
            particle.beginFill(0x000000);
            particle.drawCircle(0, 0, Math.random() * 3 + 1);
            particle.endFill();
            particle.x = this.creatureContainer.x + Math.random() * 40 - 20;
            particle.y = this.creatureContainer.y + Math.random() * 40 - 20;
            this.creatureContainer.parent.addChild(particle);

            gsap.to(particle, {
                alpha: 0,
                x: particle.x + (Math.random() - 0.5) * 80,
                y: particle.y + (Math.random() - 0.5) * 80,
                duration: 1,
                onComplete: () => {
                    particle.parent.removeChild(particle);
                }
            });
        }
    }**/