import store from './redux/store';
import * as actions from './redux/actions';

var canvas = document.getElementById('my-canvas');
var ctx = canvas.getContext('2d');

//ball starting point
var ball = {x: canvas.width / 2, y: canvas.height - 30};

var ballVelocity = {x: 4, y: -4};

var ballRadius = 10;

var randomBallColors = ["#af3421", "#5bc144", "#038922", "#f188aa", "#ef5130", "#f17fa9", "#0d8d7f", "#97aaf8"];

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = canvas.height - paddleHeight;
var paddleMoveSpeed = 7;

var rightPressed = false;
var leftPressed = false;
var enterPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var winningScore = 0;

var isSplashScreenDisplayed = true;

var bricks = [];
for(var col = 0; col < brickColumnCount; col++) {
	bricks[col] = [];
	for(var row = 0; row < brickRowCount; row++) {
		bricks[col][row] = {x: 0, y: 0, status: 2};
		winningScore = brickRowCount * brickColumnCount * bricks[col][row].status;
	}
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = store.getState().ballColor;
	ctx.fill();
	ctx.strokeStyle = "black";
	ctx.stroke();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawBricks() {
	for(var col = 0; col < brickColumnCount; col++) {
		for(var row = 0; row < brickRowCount; row++) {
			if(bricks[col][row].status > 0) {
				var brickX = (col * (brickWidth + brickPadding)) + brickOffsetLeft;
				var brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
				bricks[col][row].x = brickX;
				bricks[col][row].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText(`Score: ${store.getState().score}`, 8, 20);
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText(`Lives: ${store.getState().lives}`, canvas.width - 65, 20);
}

function showSplashScreen() {
	ctx.font = "24px Arial";
	ctx.fillStyle = "lightgreen";
	ctx.textAlign = "center";
	ctx.fillText("Breakout!", canvas.width / 2, 40);
	ctx.fillText("press enter to play", canvas.width / 2, 100);
	//isSplashScreenDisplayed = true;
}

function brickCollision() {
	for(var col = 0; col < brickColumnCount; col++) {
		for(var row = 0; row < brickRowCount; row++) {
			var brick = bricks[col][row];

			if(brick.status > 0) {
				if(ball.x > brick.x && ball.x < brick.x + brickWidth && ball.y > brick.y && ball.y < brick.y + brickHeight) {
					store.dispatch(actions.randomColor(randomBallColors));
					ballVelocity.y = -ballVelocity.y;
					brick.status--;
					//dispatch INCREASE_SCORE action
					store.dispatch(actions.increaseScore(1));
					//TODO: change winning condition to when all the bricks are destroyed
					if(store.getState().score === winningScore) {
						isSplashScreenDisplayed = true;
					}
				}
			}
		}
	}
}

function wallCollision() {
	//if the ball hits the top of the canvas...
	if(ball.y + ballVelocity.y < ballRadius) {
		store.dispatch(actions.randomColor(randomBallColors));
		ballVelocity.y = -ballVelocity.y;
	}

	//if the ball hits the bottom of the canvas...
	if(ball.y + ballVelocity.y > canvas.height - ballRadius) {
		store.dispatch(actions.loseLife(1));
		if(store.getState().lives <= 0) {
			isSplashScreenDisplayed = true;
		}
		else {
			ball = {x: canvas.width / 2, y: canvas.height - 30};
			ballVelocity = {x: 4, y: -4};
			paddleX = (canvas.width - paddleWidth) / 2;
			paddleY = canvas.height - paddleHeight;
		}
	}

	//if the ball hits the left or right side of the canvas...
	if(ball.x + ballVelocity.x > canvas.width - ballRadius || ball.x + ballVelocity.x < ballRadius) {
		store.dispatch(actions.randomColor(randomBallColors));
		ballVelocity.x = -ballVelocity.x;
	}
}

function paddleCollision() {
	if(ball.x > paddleX && ball.x < paddleX + paddleWidth && ball.y > paddleY - paddleHeight) {
		store.dispatch(actions.randomColor(randomBallColors));
		ballVelocity.y = -ballVelocity.y;
	}
}

function playerInput() {
	if(rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += paddleMoveSpeed;
	}
	else if(leftPressed && paddleX > 0) {
		paddleX -= paddleMoveSpeed;
	}
}

function draw() {
	if(isSplashScreenDisplayed) {
		showSplashScreen();
		console.log("splash is showing");

		if(enterPressed) {
			console.log("you pressed enter");
			isSplashScreenDisplayed = false;
		}
	}
	else {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//draw things
		drawBall();
		drawPaddle();
		drawBricks();
		drawScore();
		drawLives();

		//handle collision
		brickCollision();
		wallCollision();
		paddleCollision();

		//input
		playerInput();

		ball.x += ballVelocity.x;
		ball.y += ballVelocity.y;
	}

	requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	if(e.keyCode === 39) {
		rightPressed = true;
	}
	else if(e.keyCode === 37) {
		leftPressed = true;
	}
	else if(e.keyCode === 13) {
		enterPressed = true;
	}
}

function keyUpHandler(e) {
	if(e.keyCode === 39) {
		rightPressed = false;
	}
	else if(e.keyCode === 37) {
		leftPressed = false;
	}
	else if(e.keyCode === 13) {
		enterPressed = false;
	}
}

//the game loop
draw();