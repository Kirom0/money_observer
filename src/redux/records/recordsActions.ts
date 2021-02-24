import {IRecord} from "../interfaces/IRecord";
import {IAction} from "../interfaces/IAction";
import {ActTypes} from "./action.types";

export const changeRecord : (record: IRecord) => IAction = (record) => {
    return {
        type: ActTypes.RECORD_CHANGE,
        record
    }
}
