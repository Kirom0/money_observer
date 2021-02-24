import {combineReducers} from "redux";
import {recordsReducer} from "./records/recordsReducer";

export const rootReducer = combineReducers({
    records: recordsReducer,
});
