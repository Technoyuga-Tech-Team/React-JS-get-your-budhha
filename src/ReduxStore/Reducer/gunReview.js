import { SELECTED_GUN_REVIEW_PAGE, SELECTED_ARTICAL_PAGE } from "../Actions/ActionTypes";

var initialState = {
    selectedPage: 1,
    selectedPageArtical: 1
};

const getGunReviewApiReducer = (state = initialState, action) => {
    switch (action.type) {
        case SELECTED_GUN_REVIEW_PAGE:
            return {
                ...state,
                selectedPage: action.payload,
            };

        case SELECTED_ARTICAL_PAGE:
            return {
                ...state,
                selectedPageArtical: action.payload,
            };

        default:
            return state;
    }
};

export default getGunReviewApiReducer;
