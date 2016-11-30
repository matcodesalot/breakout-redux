import * as actions from './actions';

const initialState = {
    score: 0,
    lives: 3,
    ballColor: "#af3421",
    paddleWidth: 75,
    paddleHeight: 10,
    paddleX: 202.5,
    paddleY: 310,
    brickRowCount: 3,
    brickColumnCount: 5,
    brickWidth: 75,
    brickHeight: 20,
    brickPadding: 10,
    brickOffset: 30,
    brickX: 0,
    brickY: 0,
    //bricks: [],
};

export default function gameReducer(state = initialState, action) {
	switch(action.type) {
		case actions.INCREASE_SCORE:
			return Object.assign({}, state, {
				score: state.score += action.payload
			});

		case actions.LOSE_LIFE:
			return Object.assign({}, state, {
				lives: state.lives -= action.payload
			});

		case actions.RANDOM_COLOR:
			return Object.assign({}, state, {
				ballColor: action.payload[Math.floor(Math.random() * action.payload.length)]
			});

		case actions.MOVE_PADDLE:
			return Object.assign({}, state, {
				paddleX: state.paddleX += action.payload
			});

		case actions.RESET_PADDLE_X_AND_Y:
			return Object.assign({}, state, {
				paddleX: state.paddleX = initialState.paddleX,
				paddleY: state.paddleY = initialState.paddleY
			});

		case actions.GET_BRICK_X:
			return Object.assign({}, state, {
				brickX: (action.payload * (state.brickWidth + state.brickPadding)) + state.brickOffset
			});

		case actions.GET_BRICK_Y:
			return Object.assign({}, state, {
				brickY: (action.payload * (state.brickHeight + state.brickPadding)) + state.brickOffset
			});

		default:
			return state;
	}
}