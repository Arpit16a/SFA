import { combineReducers } from "redux";
import itemsReducer from './itemsReducer.js'
import authReducer from "./authReducer.js";


const rootReducer = combineReducers({
    items: itemsReducer,
    auth: authReducer
});

export default rootReducer;