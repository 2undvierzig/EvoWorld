let app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xFFFFFF
});
document.body.appendChild(app.view);

let rectangle = new PIXI.Graphics();
rectangle.beginFill(0xFF0000);
rectangle.drawRect(0, 0, 100, 100);
rectangle.endFill();
rectangle.x = 350;
rectangle.y = 250;

app.stage.addChild(rectangle);

let velocity = {
    x: 0,
    y: 0
};

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

app.ticker.add(() => {
    rectangle.x += velocity.x;
    rectangle.y += velocity.y;

    // Check border collision for realtime feedback
    let hitBorder = false;
    if (rectangle.x <= 0 || rectangle.x + rectangle.width >= app.view.width ||
        rectangle.y <= 0 || rectangle.y + rectangle.height >= app.view.height) {
        hitBorder = true;
    }

    if (hitBorder) {
        socket.emit('border_hit', { hit: hitBorder });
    }
});

let socket = io.connect('http://localhost:5000');

socket.on('rectangle_update', function(data) {
    let new_position = data.new_position;
    rectangle.x = new_position.x;
    rectangle.y = new_position.y;
});

function moveWithServerParams(speed, angle, distance) {
    socket.emit('move_rectangle', {
        speed: speed,
        angle: angle,
        distance: distance
    });
}

// Example: Move with given parameters
moveWithServerParams(50, 45, 100);
