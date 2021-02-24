import {IRecord} from "../../interfaces/IRecord";
import {IAction} from "../../interfaces/IAction";
import {ActTypes} from "../action.types";

export const initRecords = () => {
    return {
        type: ActTypes.INIT,
    }
}

export const changeRecord : (record: IRecord) => IAction = (record) => {
    return {
        type: ActTypes.RECORD_CHANGE,
        record
    }
}
