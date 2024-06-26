// reducers/index.js
import { combineReducers } from "redux";
import headerReducer from "./header";

const rootReducer = combineReducers({
  headerReducer: headerReducer
});

export default rootReducer;
