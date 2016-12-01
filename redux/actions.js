export const INCREASE_SCORE = 'INCREASE_SCORE';
export function increaseScore(amount) {
	return {
		type: INCREASE_SCORE,
		payload: amount,
	};
}

export const LOSE_LIFE = 'LOSE_LIFE';
export function loseLife(amount) {
	return {
		type: LOSE_LIFE,
		payload: amount,
	};
}

export const RANDOM_COLOR = 'RANDOM_COLOR';
export function randomColor(colors) {
	return {
		type: RANDOM_COLOR,
		payload: colors,
	};
}

export const MOVE_PADDLE = 'MOVE_PADDLE';
export function movePaddle(moveSpeed) {
	return {
		type: MOVE_PADDLE,
		payload: moveSpeed,
	};
}

export const RESET_PADDLE_X_AND_Y = 'RESET_PADDLE_X_AND_Y';
export function resetPaddleXAndY() {
	return {
		type: RESET_PADDLE_X_AND_Y,
	};
}

export const GET_BRICK_X = 'GET_BRICK_X';
export function getBrickX(col) {
	return {
		type: GET_BRICK_X,
		payload: col,
	};
}

export const GET_BRICK_Y = 'GET_BRICK_Y';
export function getBrickY(row) {
	return {
		type: GET_BRICK_Y,
		payload: row,
	};
}

export const RESET = 'RESET';
export function reset() {
	return {
		type: RESET,
	};
}