import * as actions from './actions';

const initialState = {
    score: 0,
    lives: 3,
    ballColor: "#af3421",
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

		default:
			return state;
	}
}