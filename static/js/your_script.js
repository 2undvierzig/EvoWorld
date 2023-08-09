// Create a new Pixi Application
let app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xFFFFFF
});
document.body.appendChild(app.view);

// Create a red rectangle
let rectangle = new PIXI.Graphics();
rectangle.beginFill(0xFF0000);
rectangle.drawRect(0, 0, 100, 100);
rectangle.endFill();
rectangle.x = 350;
rectangle.y = 250;

app.stage.addChild(rectangle);

// Velocity for movement
let velocity = {
    x: 0,
    y: 0
};

// Movement with WASD keys
document.addEventListener("keydown", function(event) {
    switch(event.key) {
        case 'w':
            velocity.y = -2;
            break;
        case 'a':
            velocity.x = -2;
            break;
        case 's':
            velocity.y = 2;
            break;
        case 'd':
            velocity.x = 2;
            break;
    }
});

document.addEventListener("keyup", function(event) {
    switch(event.key) {
        case 'w':
        case 's':
            velocity.y = 0;
            break;
        case 'a':
        case 'd':
            velocity.x = 0;
            break;
    }
});

// Update loop
app.ticker.add(() => {
    rectangle.x += velocity.x;
    rectangle.y += velocity.y;
});
