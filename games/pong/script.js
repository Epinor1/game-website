const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Paddle settings
const paddleHeight = 100;
const paddleWidth = 10;

// Player paddle
let playerY = (canvas.height - paddleHeight) / 2;

// AI paddle
let aiY = (canvas.height - paddleHeight) / 2;

// Ball
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSize = 10;
let ballSpeedX = 5;
let ballSpeedY = 3;

// Score
let playerScore = 0;
let aiScore = 0;

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "32px Arial";
    ctx.fillText(text, x, y);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, "black"); // background
    drawText(playerScore, canvas.width / 4, 50, "white");
    drawText(aiScore, 3 * canvas.width / 4, 50, "white");

    // Middle line
    for (let i = 0; i < canvas.height; i += 20) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, "white");
    }

    // Paddles and ball
    drawRect(0, playerY, paddleWidth, paddleHeight, "white");
    drawRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight, "white");
    drawCircle(ballX, ballY, ballSize, "white");
}

function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom collision
    if (ballY - ballSize < 0 || ballY + ballSize > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Player paddle collision
    if (ballX - ballSize < paddleWidth &&
        ballY > playerY &&
        ballY < playerY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // AI paddle collision
    if (ballX + ballSize > canvas.width - paddleWidth &&
        ballY > aiY &&
        ballY < aiY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Score
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI movement (smooth follow)
    let aiCenter = aiY + paddleHeight / 2;
    if (ballX > canvas.width / 2) {
        if (ballY > aiCenter + 35) aiY += 4;
        else if (ballY < aiCenter - 35) aiY -= 4;
    }

    // Keep paddles on screen
    if (playerY < 0) playerY = 0;
    if (playerY + paddleHeight > canvas.height) playerY = canvas.height - paddleHeight;
    if (aiY < 0) aiY = 0;
    if (aiY + paddleHeight > canvas.height) aiY = canvas.height - paddleHeight;
}

function game() {
    update();
    draw();
}

setInterval(game, 1000 / 60);

// Mouse control
canvas.addEventListener("mousemove", (evt) => {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
});
