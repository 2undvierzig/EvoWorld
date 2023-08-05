// Get the game board and square element
let gameBoard = document.getElementById("game-board");
let squareElement = document.getElementById("square");

// Function to draw the square at its new position
function drawSquare(x, y) {
    // Calculate the max x and y to keep the square inside the game board
    let maxX = gameBoard.clientWidth - squareElement.offsetWidth;
    let maxY = gameBoard.clientHeight - squareElement.offsetHeight;
    
    let hitBorder = false;

    // If x or y is outside the game board, adjust it to keep the square inside
    if (x < 0) {
        x = 0;
        hitBorder = true;
    }
    if (y < 0) {
        y = 0;
        hitBorder = true;
    }
    if (x > maxX) {
        x = maxX;
        hitBorder = true;
    }
    if (y > maxY) {
        y = maxY;
        hitBorder = true;
    }

    // Update the position of the square
    squareElement.style.top = `${y}px`;
    squareElement.style.left = `${x}px`;

    // Return a message if the square hit the border
    if (hitBorder) {
        return "The square hit the border.";
    } else {
        return "The square did not hit the border.";
    }
}

// Function to send a message to the server
async function sendMessage(message) {
    const response = await fetch("/border_hit", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({message: message}),
    });
    const data = await response.json();
    console.log(data);
}

// Function to move the square
async function moveSquare(angle, speed, length) {
    const response = await fetch("/move", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({angle: angle, speed: speed, length: length}),
    });
    const square = await response.json();
    // Now you can use the square data to update the position on the screen
    let message = drawSquare(square.x, square.y);

    // Send the message to the server
    sendMessage(message);
}


