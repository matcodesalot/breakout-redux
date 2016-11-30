import store from './redux/store';
console.log(store);
import * as actions from './redux/actions';

var canvas = document.getElementById('my-canvas');
var ctx = canvas.getContext('2d');

//ball starting point
var ball = {x: canvas.width / 2, y: canvas.height - 30};

var ballVelocity = {x: 4, y: -4};

var ballRadius = 10;

var randomBallColors = ["#af3421", "#5bc144", "#038922", "#f188aa", "#ef5130", "#f17fa9", "#0d8d7f", "#97aaf8"];

//put paddle in redux
// var paddleHeight = 10;
// var paddleWidth = 75;
// var paddleX = (canvas.width - paddleWidth) / 2;
// var paddleY = canvas.height - paddleHeight;
// var paddleMoveSpeed = 7;

var rightPressed = false;
var leftPressed = false;
var enterPressed = false;

var winningScore = 0;

var isSplashScreenDisplayed = true;

//put brick stuff in redux
// var brickRowCount = 3;
// var brickColumnCount = 5;
// var brickWidth = 75;
// var brickHeight = 20;
// var brickPadding = 10;
// var brickOffsetTop = 30;
// var brickOffsetLeft = 30;
var bricks = [];

for(var col = 0; col < store.getState().brickColumnCount; col++) {
	bricks[col] = [];
	for(var row = 0; row < store.getState().brickRowCount; row++) {
		bricks[col][row] = {x: 0, y: 0, status: 2};
		winningScore = store.getState().brickRowCount * store.getState().brickColumnCount * bricks[col][row].status;
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
	ctx.rect(store.getState().paddleX, store.getState().paddleY, store.getState().paddleWidth, store.getState().paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawBricks() {
	for(var col = 0; col < store.getState().brickColumnCount; col++) {
		for(var row = 0; row < store.getState().brickRowCount; row++) {
			if(bricks[col][row].status > 0) {
				store.dispatch(actions.getBrickX(col)); //sets store.getState().brickX
				store.dispatch(actions.getBrickY(row)); //store.getState().brickY
				bricks[col][row].x = store.getState().brickX;
				bricks[col][row].y = store.getState().brickY;

				ctx.beginPath();
				ctx.rect(store.getState().brickX, store.getState().brickY, store.getState().brickWidth, store.getState().brickHeight);
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
	//ctx.textAlign = "center";
	ctx.fillText("Breakout!", canvas.width / 2, 40);
	ctx.fillText("press enter to play", canvas.width / 2, 100);
	//isSplashScreenDisplayed = true;
}

function brickCollision() {
	for(var col = 0; col < store.getState().brickColumnCount; col++) {
		for(var row = 0; row < store.getState().brickRowCount; row++) {
			var brick = bricks[col][row];

			if(brick.status > 0) {
				if(ball.x > brick.x && ball.x < brick.x + store.getState().brickWidth && ball.y > brick.y && ball.y < brick.y + store.getState().brickHeight) {
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

function _resetBallAndPaddle() {
	ball = {x: canvas.width / 2, y: canvas.height - 30};
	ballVelocity = {x: 4, y: -4};
	store.dispatch(actions.resetPaddleXAndY());
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
			_resetBallAndPaddle();
		}
	}

	//if the ball hits the left or right side of the canvas...
	if(ball.x + ballVelocity.x > canvas.width - ballRadius || ball.x + ballVelocity.x < ballRadius) {
		store.dispatch(actions.randomColor(randomBallColors));
		ballVelocity.x = -ballVelocity.x;
	}
}

function paddleCollision() {
	if(ball.x > store.getState().paddleX && ball.x < store.getState().paddleX + store.getState().paddleWidth && ball.y > store.getState().paddleY - store.getState().paddleHeight) {
		store.dispatch(actions.randomColor(randomBallColors));
		ballVelocity.y = -ballVelocity.y;
	}
}

function playerInput() {
	if(rightPressed && store.getState().paddleX < canvas.width - store.getState().paddleWidth) {
		store.dispatch(actions.movePaddle(7));
	}
	else if(leftPressed && store.getState().paddleX > 0) {
		store.dispatch(actions.movePaddle(-7));
	}
}

function draw() {
	if(isSplashScreenDisplayed) {
		showSplashScreen();
		//console.log("splash is showing");

		if(enterPressed) {
			//console.log("you pressed enter");
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