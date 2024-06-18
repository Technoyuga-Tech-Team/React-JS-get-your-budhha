// reducers/index.js
import { combineReducers } from "redux";
import headerReducer from "./header";
import getGunReviewApiReducer from "./gunReview";

const rootReducer = combineReducers({
  headerReducer: headerReducer,
  gunReviewReducer: getGunReviewApiReducer
});

export default rootReducer;
