import {combineReducers} from "redux";
import { getRecordsReducer } from './records/recordsReducer';
import { balanceReducer } from './balance/balanceReducer';

export const rootReducer = combineReducers({
    records: getRecordsReducer(),
    balance: balanceReducer,
});
