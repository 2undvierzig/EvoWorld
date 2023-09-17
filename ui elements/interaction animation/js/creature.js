class Creature {
    constructor(app, color, x, y) {
        this.app = app;
        this.color = color;
        this.x = x;
        this.y = y;

        this.creatureContainer = this.createCreatureContainer();
        this.app.stage.addChild(this.creatureContainer);
    }

    createCreatureContainer() {
        const creatureContainer = new PIXI.Container();
        creatureContainer.x = this.x;
        creatureContainer.y = this.y;

        const shadow = new PIXI.Graphics();
        shadow.beginFill(0x000000, 0.2); 
        shadow.drawCircle(0, 0, 45);
        shadow.endFill();
        shadow.y = 20;
        creatureContainer.addChild(shadow);

        const circle = new PIXI.Graphics();
        circle.beginFill(this.color);
        circle.drawCircle(0, 0, 50); 
        circle.endFill();
        creatureContainer.addChild(circle);

        const leftEye = this.createEye(-20, -15);
        const rightEye = this.createEye(20, -15);
        const leftPupil = this.createPupil(0, -4);
        const rightPupil = this.createPupil(0, -4);
        leftEye.addChild(leftPupil);
        rightEye.addChild(rightPupil);

        // Add eyes to circle so they are affected by the breathing animation
        circle.addChild(leftEye, rightEye);

        let elapsedTime = 0;

        // Animation for circle and shadow
        this.app.ticker.add((delta) => {
            const scale = 1 + Math.sin(elapsedTime) * 0.05;
            circle.scale.set(scale);
            shadow.scale.set(1 / scale);
            elapsedTime += 0.05 * delta;
        });

        // Schedule the initial blink
        setTimeout(this.blinkEyes.bind(this, leftEye, rightEye), Math.random() * 3000 + 1000);

        return creatureContainer;
    }

    createEye(xOffset, yOffset) {
        const eye = new PIXI.Graphics();
        eye.beginFill(0xFFFFFF);
        eye.drawCircle(0, 0, 15);
        eye.endFill();
        eye.x = xOffset;
        eye.y = yOffset;
        return eye;
    }

    createPupil(xOffset, yOffset) {
        const pupil = new PIXI.Graphics();
        pupil.beginFill(0x000000);
        pupil.drawCircle(0, 0, 7);
        pupil.endFill();
        pupil.x = xOffset;
        pupil.y = yOffset;
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
        const newCreature = new Creature(this.app, this.color, this.creatureContainer.x, this.creatureContainer.y); 
        newCreature.creatureContainer.alpha = 0;

        let radius = 0;

        const vesica = new PIXI.Graphics();
        vesica.beginFill(this.color);
        vesica.drawCircle(0, 0, 50);  // Originalkreis

        const drawVesica = () => {
            vesica.clear();
            vesica.beginFill(this.color);
            vesica.drawCircle(0, 0, 50);  // Originalkreis
            vesica.drawCircle(50 - radius, 0, radius);  // Zweiter Kreis, der wächst und sich bewegt
            vesica.endFill();
        };

        this.creatureContainer.addChild(vesica);

        gsap.to(vesica, {
            duration: 0.5,
            ease: "power2.inOut",
            onUpdate: () => {
                radius += 1;
                drawVesica();
            },
            onComplete: () => {
                vesica.clear();
                newCreature.creatureContainer.alpha = 1;
                gsap.to(newCreature.creatureContainer, {
                    x: newX,
                    y: newY,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });

        return newCreature;
    }




    
    moveCreatureTo(targetX, targetY) {
        const creature = this.creatureContainer.children[1];
        const dx = targetX - this.creatureContainer.x;
        const dy = targetY - this.creatureContainer.y;
        const rotation = Math.atan2(dy, dx) + (Math.PI / 2);

        gsap.to(creature, {
            rotation: rotation,
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
