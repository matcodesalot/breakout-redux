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