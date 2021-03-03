import {combineReducers} from "redux";
import { getRecordsReducer } from './records/recordsReducer';

export const rootReducer = combineReducers({
    records: getRecordsReducer(),
});
