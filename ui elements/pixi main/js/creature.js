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
        this.shadow = new PIXI.Graphics();
        this.shadow.beginFill(0x000000, 0.2);
        this.shadow.drawCircle(0, 0, 45 * this.scale);
        this.shadow.endFill();
        this.shadow.y = 20 * this.scale;
        this.app.stage.shadowContainer.addChild(this.shadow);
        creatureContainer.shadow = this.shadow;

        this.circle = new PIXI.Graphics();
        this.circle.beginFill(this.color);
        this.circle.drawCircle(0, 0, this.size);
        this.circle.endFill();
        creatureContainer.addChild(this.circle);
        
        this.leftEye = this.createEye(-20, -15);
        this.rightEye = this.createEye(20, -15);
        this.leftPupil = this.createPupil(0, -4);
        this.rightPupil = this.createPupil(0, -4);
        this.leftEye.addChild(this.leftPupil);
        this.rightEye.addChild(this.rightPupil);
        this.circle.addChild(this.leftEye, this.rightEye);
        

        let elapsedTime = 0;
        
        //this.app.ticker.add(this.updateCreature.bind(this));

        this.tickCallback = (delta) => {
            if (this.shadow && this.creatureContainer && this.circle) {
                const scale = 1 + Math.sin(elapsedTime) * 0.05;
                this.circle.scale.set(scale);
                this.shadow.scale.set(1 / scale);
                this.shadow.x = this.creatureContainer.x;
                this.shadow.y = this.creatureContainer.y + 20 * this.scale;
            }
            elapsedTime += 0.05 * delta;
        };
        
        this.app.ticker.add(this.tickCallback, this);

        setTimeout(this.blinkEyes.bind(this, this.leftEye, this.rightEye), Math.random() * 3000 + 1000);

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

    die() {
        // Entferne die Augen und die Pupillen
        this.leftEye.clear();
        this.rightEye.clear();
        this.leftPupil.clear();
        this.rightPupil.clear();

        // Erstelle ein "X" für die Augen
        const eyeSize = this.size * 0.2;
        const eyeOffset = this.size * 0.3;

        const leftEyeLine1 = new PIXI.Graphics();
        leftEyeLine1.lineStyle(2, 0x000000)
                    .moveTo(-eyeOffset - eyeSize, -eyeOffset - eyeSize)
                    .lineTo(-eyeOffset + eyeSize, -eyeOffset + eyeSize);

        const leftEyeLine2 = new PIXI.Graphics();
        leftEyeLine2.lineStyle(2, 0x000000)
                    .moveTo(-eyeOffset + eyeSize, -eyeOffset - eyeSize)
                    .lineTo(-eyeOffset - eyeSize, -eyeOffset + eyeSize);

        const rightEyeLine1 = new PIXI.Graphics();
        rightEyeLine1.lineStyle(2, 0x000000)
                     .moveTo(eyeOffset - eyeSize, -eyeOffset - eyeSize)
                     .lineTo(eyeOffset + eyeSize, -eyeOffset + eyeSize);

        const rightEyeLine2 = new PIXI.Graphics();
        rightEyeLine2.lineStyle(2, 0x000000)
                     .moveTo(eyeOffset + eyeSize, -eyeOffset - eyeSize)
                     .lineTo(eyeOffset - eyeSize, -eyeOffset + eyeSize);

        this.creatureContainer.addChild(leftEyeLine1, leftEyeLine2, rightEyeLine1, rightEyeLine2);

        // Verfasse und starte die Animationssequenz
        gsap.to([this.creatureContainer, this.shadow], {
            alpha: 0,
            duration: 0.5,
            delay: 0.5,
            ease: "power2.out",
            onComplete: () => {
                this.app.ticker.remove(this.tickCallback, this);
                if (this.creatureContainer) {
                    this.creatureContainer.destroy();
                    this.creatureContainer = null;
                }
                if (this.shadow) {
                    this.shadow.destroy();
                    this.shadow = null;
                }
            }
        });
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


