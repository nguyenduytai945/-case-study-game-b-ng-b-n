const canvas = document.getElementById("bongban");
const ctx = canvas.getContext('2d');
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 18,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "red"
}
const user = {
    x: 0,
    y: (canvas.height - 150) / 2,
    width: 15,
    height: 150,
    score: 0,
    color: "blue"
}
const com = {
    x: canvas.width - 15,
    y: (canvas.height - 150) / 2,
    width: 15,
    height: 150,
    score: 0,
    color: "yellow"
}
const net = {
    x: (canvas.width - 2) / 2,
    y: 0,
    height: 10,
    width: 2,
    color: "DeepPink "
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawArc(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = ball.velocityX;
    ball.speed = 4;
}

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 17) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawText(text, x, y) {
    ctx.fillStyle = "red";
    ctx.font = "60px fantasy";
    ctx.fillText(text, x, y);
}

function collision(ball, pong) {
    pong.top = pong.y;
    pong.bottom = pong.y + pong.height;
    pong.left = pong.x;
    pong.right = pong.x + pong.width;
    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;
    return pong.left < ball.right && pong.top < ball.bottom && pong.right > ball.left && pong.bottom > ball.top;
}

function update() {
    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    com.y += ((ball.y - (com.y + com.height / 10))) * 0.1;
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }
    let player = (ball.x + ball.radius < canvas.width / 2) ? user : com;
    if (collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.1;
    }
}

function render() {
    drawRect(0, 0, canvas.width, canvas.height, "Aqua");
    drawText(user.score, canvas.width / 4, canvas.height / 5);
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);
    drawNet();
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function game() {
    update();
    render();
}
let framePerSecond = 50;
let loop = setInterval(game, 1000 / framePerSecond);