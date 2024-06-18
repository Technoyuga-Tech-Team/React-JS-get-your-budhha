import { GET_USER_DATA } from "../Actions/ActionTypes";

var initialState = {
  useData: {},
};

const headerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_DATA:
      return {
        ...state,
        useData: action.payload,
      };

    default:
      return state;
  }
};
export default headerReducer;
