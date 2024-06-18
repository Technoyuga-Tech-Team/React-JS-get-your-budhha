import { SELECTED_GUN_REVIEW_PAGE, SELECTED_ARTICAL_PAGE } from "./ActionTypes"

export const selectedGunReviewMessage = (payload) => {
    return {
        type: SELECTED_GUN_REVIEW_PAGE,
        payload
    }
}

export const selectedArticalMessage = (payload) => {
    return {
        type: SELECTED_ARTICAL_PAGE,
        payload
    }
}