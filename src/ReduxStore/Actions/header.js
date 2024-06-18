import { GET_USER_DATA } from "./ActionTypes";

export const getUserDataAction = (payload) => ({
  type: GET_USER_DATA,
  payload,
});
